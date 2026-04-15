# Diagnostic Checks

Run these checks in order:

### Check 1: Git Repository

```bash
git rev-parse --is-inside-work-tree 2>/dev/null && git remote get-url origin 2>/dev/null
```

- ✅ if inside a git repo with a remote
- ❌ if not a git repo or no remote configured

### Check 2: GitHub CLI

```bash
gh auth status 2>&1
```

- ✅ if authenticated
- ❌ if not authenticated → "Run: gh auth login"

### Check 3: Jira CLI

```bash
jira me 2>&1
```

- ✅ if returns user info
- ❌ if not configured → "See docs/ONBOARDING.md for jira-cli setup"

### Check 4: Jira Project Access

Only run this if Check 3 passed. Look for a Jira project key in CLAUDE.md:

```bash
grep -E "Project key:|project:" CLAUDE.md 2>/dev/null | head -1
```

If a project key is found, verify access:
```bash
jira project view <PROJECT_KEY> 2>&1
```

- ✅ if project is accessible
- ⚠️ if no project key found in CLAUDE.md → "Consider adding your Jira project key to CLAUDE.md"
- ❌ if project key found but not accessible → "Check your Jira permissions for this project"

### Check 5: Claude Commands/Skills

```bash
ls .claude/skills/*/SKILL.md .claude/commands/*.md 2>/dev/null | wc -l
```

- ✅ if skills or commands exist
- ❌ if none found → "Run /adopt to set up the workflow"

### Check 6: GitHub Workflows

```bash
ls .github/workflows/*.yml 2>/dev/null
```

Check for expected files:
- `claude.yml` — @claude PR reviews
- `auto-review.yml` — automatic code review
- `slack-notifications.yml` — Slack notifications

- ✅ if all three exist
- ⚠️ if some are missing → list which ones (might be intentional)
- ❌ if `.github/workflows/` doesn't exist → "Run /adopt to set up GitHub Actions"

### Check 7: CLAUDE.md Configuration

```bash
cat CLAUDE.md 2>/dev/null | head -50
```

Check for customization:
- Is "Project Overview" section filled in (not just placeholder comments)?
- Is tech stack defined?
- Is Jira project key specified (if using Jira)?

- ✅ if CLAUDE.md exists and appears customized
- ⚠️ if CLAUDE.md exists but has placeholder text → "Customize CLAUDE.md with your project details"
- ❌ if CLAUDE.md doesn't exist → "Run /adopt or create CLAUDE.md"

### Check 8: Global /adopt Command

```bash
ls ~/.claude/commands/adopt.md ~/.claude/skills/adopt/SKILL.md 2>/dev/null
```

- ✅ if exists
- ⚠️ if missing → "Install global /adopt: ln -sf ~/repos/shipwright/.claude/skills/adopt/SKILL.md ~/.claude/skills/adopt/SKILL.md"

### Check 9: Git Branch Hygiene

```bash
git branch --show-current
```

- ✅ if on a feature branch (not main/master)
- ⚠️ if on main/master → "Create a feature branch before making changes"

### Check 10: ADR Configuration

```bash
ls ~/.claude/adr/*.md 2>/dev/null | wc -l
```

If ADR directory exists:
- Count files by status: parse frontmatter `status` field from each `.md` file
- Report: "X accepted, Y proposed, Z deprecated"

```bash
ls docs/adr/*.md 2>/dev/null | wc -l
```

- If project-local ADRs exist, report count

Results:
- ✅ if `~/.claude/adr/` exists and contains accepted ADRs
- ⚠️ if `~/.claude/adr/` not found → "Set up global ADRs: git clone git@github.com:jettwein/adrs.git ~/repos/adrs && ln -sf ~/repos/adrs/adr ~/.claude/adr"
- ⚠️ if exists but no accepted ADRs → "No accepted ADRs found. Create one with /adr new <title>"
