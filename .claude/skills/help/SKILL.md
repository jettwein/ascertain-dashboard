---
name: help
description: Contextual help for Shipwright — shows available commands, current status, and how to do common tasks. Use when an engineer asks for help or seems stuck.
argument-hint: [topic]
---

# Help

Provide contextual help based on what's available and what the engineer needs.

## Arguments

$ARGUMENTS — Optional topic. If provided, give focused help on that topic. If empty, give an overview.

## Instructions

### Step 1: Detect What's Available

Silently check what's configured:

```bash
# Skills available
ls .claude/skills/*/SKILL.md 2>/dev/null
# Rules configured
ls .claude/rules/*.md 2>/dev/null
# Hooks active
ls scripts/hooks/*.sh scripts/session-start.sh 2>/dev/null
# Jira configured
command -v jira &>/dev/null && echo "jira: yes" || echo "jira: no"
# Current state
git branch --show-current 2>/dev/null
```

### Step 2: Route Based on Input

**If no arguments** — show the overview from [overview.md](overview.md)

**If a topic is given**, match it and provide focused help:

| Topic | What to show |
|-------|-------------|
| `commands`, `skills` | List all available commands with descriptions |
| `hooks`, `safety` | Explain active hooks and what they enforce |
| `rules` | List active rules and what they cover |
| `jira`, `tickets` | How to work with Jira tickets |
| `team`, `agents`, `parallel` | How to use agent teams |
| `review` | How code review works |
| `adopt` | How to adopt Shipwright into a repo |
| `adr`, `decisions` | How ADRs work |
| `git`, `workflow`, `branches` | Git workflow and branch conventions |
| `mcp`, `tools` | External tool policy (CLI vs MCP) |
| `troubleshoot`, `fix`, `broken` | Common issues and fixes — see [troubleshoot.md](troubleshoot.md) |

If the topic doesn't match anything, use your best judgment to answer the question or suggest the closest match.

### Step 3: End with a Suggestion

Always end with a relevant next action:
- If they seem lost: suggest `/onboard`
- If they're on main: suggest creating a feature branch
- If they have uncommitted changes: suggest `/review`
- If there's an open PR: mention it
- Otherwise: "Just ask me what you'd like to build."
