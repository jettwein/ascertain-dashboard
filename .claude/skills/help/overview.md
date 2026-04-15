# Help Overview

Show this when `/help` is called with no arguments.

## Format

Present contextually — only show what's actually available.

```
## Shipwright Help

### Building Things
- `/new-feature <description>` — describe what you want, Claude builds it
- `/implement PROJ-123` — pick up a Jira ticket end-to-end [only if Jira configured]
- `/team create PROJ-1 PROJ-2` — parallel agents for multiple stories [only if Jira configured]

### Reviewing & Quality
- `/review` — review your changes before opening a PR
- `/team template review` — parallel security + performance + test review
- `/adr check` — check which architecture rules apply to your work

### Understanding the Codebase
- `/onboard` — guided tour (great for your first time)
- `/adr list` — see the architecture decisions that govern this project

### Setup & Diagnostics
- `/doctor` — check if your environment is set up correctly
- `/setup` — configure integrations (Jira, GitHub Actions, Slack)
- `/help <topic>` — get help on a specific topic

### What's Active Behind the Scenes
[List based on what's detected:]
- Safety guardrails: can't commit to main, force push, or edit protected files
- Auto-formatting: [formatter] runs after every edit
- Session context: branch status and open work shown on startup
- Path-scoped rules: [count] domain rules loaded when relevant
- Desktop notifications: alerts when Claude needs your input

### Current Status
- Branch: `[current branch]`
- [Open PR: URL — if exists]
- [In-progress ticket: KEY — if Jira configured and ticket found]
- [Uncommitted changes — if any]
```

Adapt based on what's actually installed. Don't show Jira commands if Jira isn't configured. Don't mention hooks if scripts don't exist.
