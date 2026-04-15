#!/usr/bin/env bash
# TaskCompleted hook — quality gate before marking a task as done.
# Exit 0 = allow completion, Exit 2 = block with feedback.
# Receives JSON on stdin with task context.

set -euo pipefail

INPUT=$(cat)

# Check for uncommitted changes
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "Uncommitted changes detected. Commit all changes before completing the task." >&2
  exit 2
fi

# Run tests if a test command is available
if [[ -f "Makefile" ]] && grep -q "^test:" Makefile 2>/dev/null; then
  if ! make test 2>/dev/null; then
    echo "Tests are failing. Fix test failures before completing the task." >&2
    exit 2
  fi
elif [[ -f "package.json" ]] && grep -q '"test"' package.json 2>/dev/null; then
  if ! npm test 2>/dev/null; then
    echo "Tests are failing. Fix test failures before completing the task." >&2
    exit 2
  fi
fi

# Run linter if available
if [[ -f "Makefile" ]] && grep -q "^lint:" Makefile 2>/dev/null; then
  if ! make lint 2>/dev/null; then
    echo "Linting errors found. Fix lint issues before completing the task." >&2
    exit 2
  fi
fi

exit 0
