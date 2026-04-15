---
name: adr
description: Manage Architecture Decision Records (ADRs) — create, list, view, and check compliance across global and project scopes.
argument-hint: <new|list|view|check> [args]
---

# ADR Command

Manage Architecture Decision Records (ADRs) across global and project scopes.

## Arguments

$ARGUMENTS - Subcommand: `new <title>`, `list`, `view <NNNN>`, or `check`

## Instructions

### Subcommand: `new <title>`

1. Ask whether this ADR should be **global** (`~/.claude/adr/`) or **project-local** (`docs/adr/`)
2. Determine the next sequential number:
   - For global: `ls ~/.claude/adr/*.md | sort | tail -1` to find the highest number
   - For local: `ls docs/adr/*.md 2>/dev/null | sort | tail -1`
3. Copy the appropriate template:
   - Global: use the template at `~/.claude/adr/../TEMPLATE.md` (i.e., `~/repos/adrs/TEMPLATE.md`)
   - Local: use the template at `~/.claude/adr/../PROJECT_TEMPLATE.md` (or create a simple one)
4. Fill in the frontmatter: `id`, `title`, `date` (today), `status: proposed`
5. Convert the title to a filename: `NNNN-<kebab-case-title>.md`
6. Create the file and open it for the user to fill in
7. Ask if they'd like to create a PR for the ADR (global ADRs go through the `jettwein/adrs` repo)

### Subcommand: `list`

1. Scan both directories:
   - Global: `~/.claude/adr/*.md`
   - Project: `docs/adr/*.md`
2. Parse frontmatter from each file to extract `id`, `title`, `status`, `tags`
3. Display a table with both scopes

### Subcommand: `view <NNNN>`

1. Search for a file matching `*NNNN*.md` in both `~/.claude/adr/` and `docs/adr/`
2. Display the full contents of the ADR
3. If found in both scopes, show both and note that the project version takes precedence

### Subcommand: `check`

1. Determine current work context via `git diff --name-only` and branch name
2. Scan all accepted ADRs from both scopes
3. For each, check if `tags` or `applies_to` are relevant to current work
4. Display applicable ADRs with their MUST rules

## Error Handling

- If `~/.claude/adr/` does not exist: suggest running the symlink setup from the ADR repo README
- If `docs/adr/` does not exist and subcommand is `new` with local scope: create the directory
- If no ADRs are found: display a helpful message about getting started
