# Environment Checks

Verify the engineer's development environment.

## Always Check

### Git
```bash
git --version 2>/dev/null
git config user.name 2>/dev/null
git config user.email 2>/dev/null
```
- Name and email configured? If not, they'll need to set these before committing.

### GitHub CLI
```bash
gh auth status 2>&1 | head -3
```
- Authenticated? If not: "Run `gh auth login` to connect to GitHub."

### Package Manager / Runtime
Based on the detected tech stack:
- **Node.js**: `node --version && npm --version` (or yarn/pnpm)
- **Python**: `python3 --version && pip --version`
- **Go**: `go version`
- **Rust**: `rustc --version && cargo --version`

### Dependencies Installed
- **Node.js**: Check if `node_modules/` exists, suggest `npm install` if not
- **Python**: Check for virtual env, suggest setup if missing
- **Go**: `go mod download` if needed

## If Shipwright/Adopted Project

### Jira CLI (if Jira is configured)
```bash
jira me 2>&1
```
- If configured in CLAUDE.md but not installed: "This project uses Jira for tracking. Set up jira-cli to use `/implement` and `/jira-task`."
- If not configured in project: skip silently

### Hooks
```bash
ls scripts/hooks/*.sh scripts/session-start.sh 2>/dev/null
```
- If hook scripts exist: "This project has safety guardrails and auto-formatting hooks configured."
- If settings.json references scripts that don't exist: warn

### ADRs
```bash
ls ~/.claude/adr/*.md docs/adr/*.md 2>/dev/null
```
- If global ADRs exist: note how many accepted rules apply
- If not: skip (don't push setup during onboarding)

## Presentation

Keep it light:
- Group into "Ready" and "Needs setup"
- For anything that needs setup, give the exact command
- Don't block onboarding on missing optional tools — note them and move on
