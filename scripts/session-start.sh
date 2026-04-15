#!/usr/bin/env bash
# Session start hook for Shipwright agentic coding framework.
# Runs at the beginning of each Claude Code session to provide context.
# Output is injected into the conversation as system context.

set -euo pipefail

echo "## Session Context"
echo ""

# --- Git Status ---
if git rev-parse --is-inside-work-tree &>/dev/null; then
  branch=$(git branch --show-current 2>/dev/null || echo "detached")

  if [[ "$branch" == "main" || "$branch" == "master" ]]; then
    echo "⚠️ **On $branch** — create a feature branch before making changes."
  else
    echo "Branch: \`$branch\`"
  fi

  # Uncommitted changes
  if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
    echo "⚠️ **Uncommitted changes detected** — review before starting new work."
  fi

  # Check if branch has a remote and is behind
  if git rev-parse --abbrev-ref "@{upstream}" &>/dev/null; then
    git fetch --quiet origin 2>/dev/null || true
    behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo "0")
    if [[ "$behind" -gt 0 ]]; then
      echo "⚠️ **Branch is $behind commit(s) behind remote** — consider pulling."
    fi
  fi

  # Check for open PRs on this branch
  if command -v gh &>/dev/null && [[ "$branch" != "main" && "$branch" != "master" ]]; then
    pr_url=$(gh pr view --json url --jq '.url' 2>/dev/null || true)
    if [[ -n "$pr_url" ]]; then
      pr_state=$(gh pr view --json state --jq '.state' 2>/dev/null || true)
      if [[ "$pr_state" == "MERGED" ]]; then
        echo "✅ **PR merged**: $pr_url — time to clean up branch and return to main."
      elif [[ "$pr_state" == "OPEN" ]]; then
        echo "📋 **Open PR**: $pr_url"
      fi
    fi
  fi
  # Recent commits
  recent=$(git log --oneline -3 2>/dev/null || true)
  if [[ -n "$recent" ]]; then
    echo ""
    echo "### Recent Commits"
    echo "$recent"
  fi
else
  echo "⚠️ Not in a git repository."
fi

echo ""

# --- Tool Authentication ---
warnings=""

if command -v gh &>/dev/null; then
  if ! gh auth status &>/dev/null 2>&1; then
    warnings="${warnings}\n- GitHub CLI not authenticated — run \`gh auth login\`"
  fi
else
  warnings="${warnings}\n- GitHub CLI (gh) not installed"
fi

if command -v jira &>/dev/null; then
  if ! jira me &>/dev/null 2>&1; then
    warnings="${warnings}\n- Jira CLI not authenticated — see docs/ONBOARDING.md"
  fi
fi

if [[ -n "$warnings" ]]; then
  echo "### Auth Issues"
  echo -e "$warnings"
  echo ""
fi

# --- In-Progress Jira Tickets ---
if command -v jira &>/dev/null; then
  in_progress=$(jira issue list -s"In Progress" --plain --columns key,summary --no-headers 2>/dev/null || true)
  if [[ -n "$in_progress" ]]; then
    echo "### In-Progress Tickets"
    echo "$in_progress"
    echo ""
  fi
fi

# --- Open PRs for this repo ---
if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
  open_prs=$(gh pr list --limit 5 --json number,title,author --jq '.[] | "- #\(.number) \(.title) (\(.author.login))"' 2>/dev/null || true)
  if [[ -n "$open_prs" ]]; then
    echo "### Open PRs"
    echo "$open_prs"
    echo ""
  fi
fi
