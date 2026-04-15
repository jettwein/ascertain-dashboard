---
name: team
description: Create and manage agent teams for parallel development. Supports creating teams from Jira stories or predefined templates (review, implement, research).
argument-hint: <create|template|status> [args]
---

# Agent Team Command

Create and manage agent teams for parallel development.

## Arguments

$ARGUMENTS - Subcommand and arguments:
- `create <JIRA-KEY-1> [JIRA-KEY-2] [...]` — Create a team with one teammate per story
- `template <name>` — Create a team from a predefined template
- `status` — Check status of the current team

## Instructions

### Subcommand: `create`

See [create workflow](create.md) for the full create flow.

### Subcommand: `template <name>`

Available templates:
- **review** — See [review template](templates/review.md)
- **implement** — See [implement template](templates/implement.md)
- **research** — See [research template](templates/research.md)

If the template name isn't recognized, list available templates.

### Subcommand: `status`

See [status workflow](status.md) for the status check flow.

## Error Handling

- If a Jira key is invalid or inaccessible, skip it and warn the user
- If stories have file conflicts, present them clearly and suggest sequential work
- If no team is active for `status`, say so
