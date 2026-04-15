#!/usr/bin/env bash
# PreToolUse hook — blocks dangerous operations before they execute.
# Exit 0 = allow, Exit 2 = block (with stderr message shown to Claude).
# Receives JSON on stdin with tool_name and tool_input.

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# --- Protect sensitive files from Edit/Write ---
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

  PROTECTED_PATTERNS=(
    ".env"
    ".env.local"
    ".env.production"
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
    ".git/"
    "secrets.json"
    "credentials.json"
  )

  for pattern in "${PROTECTED_PATTERNS[@]}"; do
    if [[ "$FILE_PATH" == *"$pattern"* ]]; then
      echo "Blocked: '$FILE_PATH' is a protected file. Ask the user before modifying." >&2
      exit 2
    fi
  done
fi

# --- Block dangerous Bash commands ---
if [[ "$TOOL_NAME" == "Bash" ]]; then
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

  # Block destructive file operations outside project
  if echo "$COMMAND" | grep -qE 'rm\s+(-rf|-fr)\s+(/|~|\$HOME|\.\.)'; then
    echo "Blocked: destructive rm -rf outside project directory. Ask the user first." >&2
    exit 2
  fi

  # Block force push
  if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force|git\s+push\s+-f\b'; then
    echo "Blocked: force push is not allowed. Ask the user first." >&2
    exit 2
  fi

  # Block direct commits to main/master
  if echo "$COMMAND" | grep -qE 'git\s+commit' ; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
      echo "Blocked: committing directly to $BRANCH is not allowed. Create a feature branch first." >&2
      exit 2
    fi
  fi

  # Block hard resets
  if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
    echo "Blocked: git reset --hard can destroy work. Ask the user first." >&2
    exit 2
  fi

  # Block database destruction
  if echo "$COMMAND" | grep -qiE 'drop\s+(table|database|schema)|truncate\s+table|delete\s+from\s+\S+\s*(;|$)'; then
    echo "Blocked: destructive database operation detected. Ask the user first." >&2
    exit 2
  fi

  # Block sudo
  if echo "$COMMAND" | grep -qE '^\s*sudo\s'; then
    echo "Blocked: sudo commands are not permitted. Ask the user first." >&2
    exit 2
  fi
fi

exit 0
