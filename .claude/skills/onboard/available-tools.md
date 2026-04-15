# Available Tools

Show the engineer what they can do with Claude Code in this project.

## For Shipwright/Adopted Projects

List available skills based on what's configured:

```
### What You Can Do

Here are the commands available in this project:

| Command | What it does |
|---------|-------------|
| `/new-feature <desc>` | Describe what you want, Claude builds it |
| `/review` | Review your changes before creating a PR |
| `/doctor` | Check if your environment is set up correctly |
```

If Jira is configured, add:
```
| `/implement PROJ-123` | Pick up a Jira ticket and implement it end-to-end |
| `/jira-task PROJ-123` | Pull up a ticket and plan the approach |
| `/team create PROJ-1 PROJ-2` | Spin up parallel agents for multiple stories |
```

If ADRs are configured, add:
```
| `/adr list` | See the architecture decisions that govern this project |
| `/adr check` | Check which rules apply to your current work |
```

### Hooks (automatic)

If hooks are configured, explain briefly:
- "**Safety guardrails** are active — Claude can't accidentally commit to main, force push, or edit .env files"
- "**Auto-formatting** runs after every edit (using [Prettier/Black/gofmt])"
- "**Desktop notifications** will alert you when Claude needs your input"

## For Standard Projects (no Shipwright)

Show what Claude Code can do out of the box, then offer to set up more:

```
### What You Can Do Right Now

Even without any configuration, you can:
- Ask Claude to explain any part of the codebase
- Ask Claude to implement features, fix bugs, or refactor code
- Ask Claude to write tests or review your changes

### Want More?

Run `/adopt` to add:
- Guided workflows for features and code review
- Safety guardrails (prevent accidental commits to main)
- Auto-formatting after every edit
- Jira integration for ticket management
- GitHub Actions for automated PR reviews

It takes about 2 minutes and you can choose how much to install.
```

## Presentation

Keep it brief — just enough to know what's possible. Don't explain every flag and option. The engineer will discover details when they actually use the commands.
