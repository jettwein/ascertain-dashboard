#!/usr/bin/env bash
# Runs after context compaction to re-inject critical workflow rules.
# These are the rules most likely to be lost during compaction.

set -euo pipefail

echo "## Post-Compaction Context Recovery"
echo ""
echo "### Core Workflow Rules (CRITICAL)"
echo "1. **Never commit directly to main** — use feature branches and PRs"
echo "2. **Verify all ACs before marking done** — PR must be merged, tests must pass"
echo "3. **Respect ADRs** — check ~/.claude/adr/ and docs/adr/ for accepted rules"
echo ""

# Re-inject current state
branch=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "### Current State"
echo "Branch: \`$branch\`"

if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "⚠️ Uncommitted changes present"
fi

# Show what we were working on
recent=$(git log --oneline -3 2>/dev/null || true)
if [[ -n "$recent" ]]; then
  echo ""
  echo "### Recent Commits"
  echo "$recent"
fi

# In-progress ticket
if command -v jira &>/dev/null; then
  in_progress=$(jira issue list -s"In Progress" --plain --columns key,summary --no-headers 2>/dev/null || true)
  if [[ -n "$in_progress" ]]; then
    echo ""
    echo "### In-Progress Tickets"
    echo "$in_progress"
  fi
fi

# Open PR for current branch
if command -v gh &>/dev/null && [[ "$branch" != "main" && "$branch" != "master" ]]; then
  pr_url=$(gh pr view --json url --jq '.url' 2>/dev/null || true)
  if [[ -n "$pr_url" ]]; then
    echo ""
    echo "### Current PR"
    echo "$pr_url"
  fi
fi
