#!/usr/bin/env bash
# TeammateIdle hook — quality gate before a teammate goes idle.
# Exit 0 = allow idle, Exit 2 = keep working (with feedback on stderr).
# Receives JSON on stdin with teammate context.

set -euo pipefail

INPUT=$(cat)

# Check if there are uncommitted changes
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "You have uncommitted changes. Please commit or stash before finishing." >&2
  exit 2
fi

# Check if on a feature branch (not main)
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  # On main is fine for read-only tasks (review, research)
  exit 0
fi

# If on a feature branch, check if a PR was created
if command -v gh &>/dev/null; then
  PR_STATE=$(gh pr view --json state --jq '.state' 2>/dev/null || echo "NONE")
  if [[ "$PR_STATE" == "NONE" ]]; then
    # No PR yet — check if there are commits ahead of main
    AHEAD=$(git rev-list --count main..HEAD 2>/dev/null || echo "0")
    if [[ "$AHEAD" -gt 0 ]]; then
      echo "You have $AHEAD commit(s) but no PR created. Push and create a PR before finishing." >&2
      exit 2
    fi
  fi
fi

exit 0
