# WORKFLOW.md

Shared workflow standards for all projects. This file can be synced to projects created from this template.

---

## Core Rules (CRITICAL)

These rules apply to ALL work. No exceptions.

### 1. ALWAYS Use Feature Branches and PRs
**Never commit directly to main.** Every change must:
1. Start from a feature branch
2. Go through a Pull Request
3. Be reviewed by a human before merging

### 2. Verify All ACs Before Marking Done
If the project uses a ticket tracker, do not mark a ticket "Done" until:
- All acceptance criteria are verified
- The PR is merged
- Any automated tests pass

### 3. Respect Architecture Decision Records
Check applicable ADRs before starting work:
- **Global ADRs** in `~/.claude/adr/` apply to all projects
- **Project ADRs** in `docs/adr/` override global ADRs when conflicting
- Only `status: accepted` ADRs are binding
- Follow all MUST rules; SHOULD rules are recommended but not required

Use `/adr check` to identify relevant ADRs for the current task.

---

## Git Workflow

### Starting New Work
**ALWAYS create a feature branch from main before starting any new work:**
```bash
git checkout main
git pull origin main
git checkout -b feature/<description>
```
Never commit directly to main. All work must happen on a feature branch.

### Branch Naming
- Features: `feature/<description>` or `feature/<ticket-key>-<description>`
- Bug fixes: `fix/<description>` or `fix/<ticket-key>-<description>`

### Jira Status Updates (if configured)
If the project uses Jira, update ticket status as work progresses:
- **Starting work** → Move ticket to "In Progress"
- **PR merged** → Move ticket to "Done"

### PR Process
1. Push branch: `git push -u origin <branch-name>`
2. Create PR: `gh pr create --base main --fill`
3. **Wait for human review** - DO NOT merge without approval
4. Address feedback, push updates
5. Human merges when approved

### After PR is Merged
1. Pull latest main: `git checkout main && git pull`
2. Delete feature branch: `git branch -d <branch-name>`
3. Update ticket tracker (if configured)

---

## Syncing This File

For projects created from the template, sync the latest workflow standards:

```bash
# One-time setup: add template as a remote
git remote add template https://github.com/jettwein/shipwright.git

# Pull latest WORKFLOW.md
git fetch template
git checkout template/main -- WORKFLOW.md
git commit -m "chore: Sync WORKFLOW.md from template"
```
