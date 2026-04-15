#!/usr/bin/env bash
# PostToolUse hook — runs auto-formatting after file edits.
# Receives JSON on stdin with tool_name and tool_input.
# Exit 0 = success (stdout is shown to Claude as context).

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only run on Edit or Write
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# Try project-level formatter first, then fall back to common formatters.
# Only format if the tool is actually available — skip silently otherwise.

format_with_prettier() {
  # Check for prettier in project
  if [[ -f "node_modules/.bin/prettier" ]]; then
    npx prettier --write "$FILE_PATH" 2>/dev/null && return 0
  elif command -v prettier &>/dev/null; then
    prettier --write "$FILE_PATH" 2>/dev/null && return 0
  fi
  return 1
}

format_with_black() {
  if command -v black &>/dev/null; then
    black --quiet "$FILE_PATH" 2>/dev/null && return 0
  fi
  return 1
}

format_with_gofmt() {
  if command -v gofmt &>/dev/null; then
    gofmt -w "$FILE_PATH" 2>/dev/null && return 0
  fi
  return 1
}

format_with_rustfmt() {
  if command -v rustfmt &>/dev/null; then
    rustfmt "$FILE_PATH" 2>/dev/null && return 0
  fi
  return 1
}

case "$EXT" in
  js|jsx|ts|tsx|json|css|scss|html|md|yaml|yml)
    format_with_prettier || true
    ;;
  py)
    format_with_black || true
    ;;
  go)
    format_with_gofmt || true
    ;;
  rs)
    format_with_rustfmt || true
    ;;
esac

exit 0
