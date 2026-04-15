---
name: adopt
description: Adopt the Shipwright agentic coding workflow in an existing repository. Copies skills, hooks, and configuration directly from the Shipwright source.
argument-hint:
disable-model-invocation: true
---

# Adopt Shipwright

Adopt the Shipwright agentic coding workflow in an existing repository. This copies skills, hooks, and configuration directly from the Shipwright source repo.

## Instructions

### Step 1: Verify Repository

Confirm this is the correct repository:

```bash
git remote get-url origin
```

Ask the user to confirm before proceeding.

---

### Step 2: Locate Shipwright Source

The Shipwright skills are siblings of this adopt skill. Determine the source path:

```bash
# This adopt skill lives in the Shipwright repo (or is symlinked from it)
# The source skills are at ${CLAUDE_SKILL_DIR}/../
ls ${CLAUDE_SKILL_DIR}/../*/SKILL.md 2>/dev/null
```

If the source skills can't be found, tell the user:
```
Can't find the Shipwright source skills. Make sure the Shipwright repo is cloned
and /adopt is symlinked from it. See the Shipwright README for setup.
```

---

### Step 3: Choose Adoption Tier

Present the three tiers and explain the impact on other engineers:

**"How much of the workflow would you like to adopt?"**

#### Tier 1: Lightweight (zero impact to other engineers)
- `.claude/` directory only — skills, settings, hooks
- **Invisible** to non-Claude users (only affects Claude Code sessions)
- No new files in the repo root, no GitHub Actions
- Best for: trying it out, repos with skeptical teammates

#### Tier 2: Standard (minimal impact)
- Everything in Tier 1, plus:
- `CLAUDE.md` in repo root (just a markdown file — harmless documentation)
- `scripts/` directory for hook scripts
- Best for: teams open to AI tooling, most projects

#### Tier 3: Full (team-wide)
- Everything in Tier 2, plus:
- GitHub Actions: automatic PR review by Claude, @claude PR comments
- Slack notifications for PR activity
- Best for: teams fully bought in, greenfield projects

Let the user choose a tier. They can always upgrade later.

---

### Step 4: Check Environment

#### Always check:
```bash
gh auth status 2>&1 | head -3
```
- If fails: "Run `gh auth login` first, or skip GitHub features."

#### Ask about optional integrations:

**"Which optional integrations would you like?"**

1. **Jira** — ticket management (`/jira-task`, `/implement`, status updates)
2. **Frontend Design** — custom UI skill for building interfaces
3. **Both**
4. **Neither** — just core commands

If Jira is selected, ask: **"What is your Jira project key?"** (e.g., `NAV`, `PROJ`)

---

### Step 5: Check for Existing Files

```bash
ls .claude/settings.json .claude/skills/*/SKILL.md .claude/commands/*.md CLAUDE.md scripts/*.sh 2>/dev/null
```

If any exist, list them and ask: "These files already exist — should I skip, merge, or replace them?"

---

### Step 6: Copy Skills from Shipwright Source

This is the core of adoption. Read each skill from the Shipwright source and recreate it in the target repo.

#### 6a: Determine which skills to install

**Always install (core):**
- `onboard` — guided onboarding for new engineers
- `new-feature` — feature implementation workflow
- `review` — code review (with checklist and output format)
- `doctor` — setup diagnostics (with checks)

**If Jira selected, also install:**
- `jira-task` — Jira ticket planning
- `implement` — single story end-to-end implementation
- `implement-all` — batch story implementation
- `init-project` — requirements to Jira stories
- `team` — agent team management (with templates)

**Always install (utility):**
- `adr` — architecture decision records
- `setup` — setup wizard

**Do NOT install in target repo:**
- `adopt` — this skill itself (it's global-only, used to bootstrap other repos)

#### 6b: Copy each skill

For each skill to install:

1. Read the SKILL.md and all supporting files from `${CLAUDE_SKILL_DIR}/../<skill-name>/`
2. Create the same directory structure in the target repo under `.claude/skills/<skill-name>/`
3. Write the contents exactly as they are in the source

Example for the review skill:
```bash
# Read from source
cat ${CLAUDE_SKILL_DIR}/../review/SKILL.md
cat ${CLAUDE_SKILL_DIR}/../review/checklist.md
cat ${CLAUDE_SKILL_DIR}/../review/output-format.md

# Create in target
mkdir -p .claude/skills/review
# Write SKILL.md, checklist.md, output-format.md with the same content
```

Do this for ALL selected skills and their supporting files.

#### 6b2: Copy path-scoped rules

Read and recreate the rules from the Shipwright source:

```bash
ls ${CLAUDE_SKILL_DIR}/../../rules/*.md 2>/dev/null
```

Create `.claude/rules/` in the target repo with all rule files. These are starter rules — tell the user to customize the `paths:` frontmatter to match their project's directory structure.

Included rules: `frontend.md`, `api.md`, `database.md`, `tests.md`, `infrastructure.md`

#### 6c: Create .claude/settings.json

Read the settings.json from the Shipwright source:
```bash
cat ${CLAUDE_SKILL_DIR}/../../settings.json
```

Create it in the target repo. If Jira was selected, add `"Bash(jira:*)"` to the permissions allow list. If frontend-design was selected, add the `enabledPlugins` section.

If a settings.json already exists in the target, merge the hooks and permissions rather than replacing.

---

### Step 7: Copy Hook Scripts (Tier 2+)

Read and recreate the hook scripts from the Shipwright source:

```bash
# Find all scripts in the Shipwright repo
ls ${CLAUDE_SKILL_DIR}/../../../scripts/*.sh ${CLAUDE_SKILL_DIR}/../../../scripts/hooks/*.sh 2>/dev/null
```

Create the same structure in the target repo:
```
scripts/
├── session-start.sh
├── session-compact.sh
└── hooks/
    ├── pre-tool-use.sh
    ├── post-tool-use.sh
    ├── notify.sh
    ├── teammate-idle.sh
    └── task-completed.sh
```

Make all scripts executable: `chmod +x scripts/*.sh scripts/hooks/*.sh`

---

### Step 8: Create CLAUDE.md (Tier 2+)

Check if CLAUDE.md already exists. If it does, ask before modifying.

Create a starter CLAUDE.md that includes:
1. Project overview placeholder
2. Tech stack placeholder
3. Development workflow (feature branches, PRs)
4. Custom commands table (based on what was installed)
5. Jira section (if selected, with their project key)
6. UI Development section (if frontend-design selected)

Ask the user to fill in the project-specific sections.

---

### Step 9: Create GitHub Actions (Tier 3 only)

Read the workflow files from the Shipwright source:
```bash
ls ${CLAUDE_SKILL_DIR}/../../../.github/workflows/*.yml 2>/dev/null
```

Copy them into the target repo's `.github/workflows/`. Only copy:
- `claude.yml` — @claude PR reviews (always for Tier 3)
- `auto-review.yml` — automatic code review (always for Tier 3)
- `slack-notifications.yml` — only if user wants Slack

---

### Step 10: Summary

Display what was created and explain the impact:

```
## Shipwright adopted!

### Skills installed:
[list each skill with one-line description]

### Hooks configured:
- Safety guardrails (blocks commits to main, force push, protected files)
- Auto-formatting (Prettier, Black, gofmt, rustfmt)
- Session context (branch status, open PRs, Jira tickets)
- Desktop notifications (alerts when Claude needs input)
- Agent team quality gates (tests must pass, PRs must be created)

[If Tier 2+]
### Also created:
- CLAUDE.md — customize with your project details
- scripts/ — hook scripts

[If Tier 3]
### GitHub Actions:
- Automatic code review on every PR
- @claude PR reviews
[If Slack] - Slack notifications

### Impact on other engineers:
[If Tier 1] None — .claude/ is only used by Claude Code
[If Tier 2] Minimal — they'll see CLAUDE.md and scripts/ (documentation + shell scripts)
[If Tier 3] Moderate — PRs will get automatic Claude reviews

### Get started:
Run `/onboard` for a guided tour of this project.

### Next steps:
1. Customize CLAUDE.md with your project details
2. Commit the new files to a feature branch
3. Share `/onboard` with your team — it's the first thing they should run
```

---

### Step 11: Commit

Ask the user if they want to commit and push:

```bash
git add .claude scripts CLAUDE.md .github
git commit -m "Adopt Shipwright agentic coding workflow"
```

**Do not push without asking.**

---

## Important Notes

- **Never overwrite existing files** without asking
- **Copy skills from source** — don't use simplified inline versions
- **Include ALL supporting files** (checklists, templates, etc.)
- **Hooks are resilient** — they check for script existence before running
- **Tier 1 has zero impact** on non-Claude engineers
- **Do not copy the adopt skill itself** — it's global-only
- If environment checks fail for optional tools (Jira), continue anyway
- Check for existing `.claude/settings.json` and merge rather than replace
