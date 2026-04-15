# CLAUDE.md

This file is the **single source of truth** for Claude Code when working in this repository. Both Claude and humans should update this file as the project evolves—adding rules, decisions, patterns, and learnings.

## About This File

- **Living document**: Update this file whenever you establish new patterns, make architectural decisions, or learn something important about the codebase
- **Claude should update**: When Claude discovers something important or establishes a new convention, it should add it here
- **Humans should update**: When humans make decisions or want to guide Claude's behavior, add it here
- **Read first**: Claude should always read this file at the start of a session
- **ALWAYS document**: Any new workflow, convention, or process change MUST be added to this file

---

## Path-Scoped Rules

Rules in `.claude/rules/` only load when Claude touches matching files. This saves context — frontend rules don't load when editing backend code.

### Included Rules

| Rule | Applies to | What it covers |
|------|-----------|---------------|
| `frontend.md` | `*.tsx`, `*.jsx`, `src/components/`, `src/app/` | Functional components, TypeScript props, accessibility, testing |
| `api.md` | `src/api/`, `src/routes/`, `src/controllers/` | Input validation, error shapes, status codes, logging |
| `database.md` | `src/db/`, `prisma/`, `migrations/`, `*.sql` | Parameterized queries, reversible migrations, indexes |
| `tests.md` | `*.test.*`, `*.spec.*`, `__tests__/` | Behavior testing, isolation, mocks at boundaries |
| `infrastructure.md` | `terraform/`, `Dockerfile*`, `.github/workflows/` | No hardcoded secrets, pinned versions, review required |

### Customizing Rules

- Edit the `paths:` frontmatter to match your project's directory structure
- Add new rules: create a `.md` file in `.claude/rules/` with `paths:` frontmatter
- Rules without `paths:` load in every session (use sparingly — they cost context)
- Project rules override global rules (`~/.claude/rules/`) when they conflict

---

## Project Overview

Shipwright is an agentic coding framework for Claude Code. Designed for:
- Multiple Claude agents working concurrently on different features
- Human-in-the-loop review via PRs
- Optional integrations with GitHub, Jira, and Slack

---

## Core Workflow Rules (CRITICAL)

These rules apply to ALL work in projects using this framework:

### 1. ALWAYS Use Feature Branches and PRs
**Never commit directly to main.** Every change must:
1. Start from a feature branch (`feature/<description>` or `feature/<ticket-key>-<description>`)
2. Go through a Pull Request
3. Be reviewed by a human before merging

Even "small" fixes benefit from this workflow—it maintains clean git history and ensures human oversight.

### 2. Verify All ACs Before Marking Done
If the project uses a ticket tracker (Jira, Linear, etc.), do not mark a ticket "Done" until:
- All acceptance criteria are verified
- The PR is merged
- Any automated tests pass

---

## Multi-Agent Concurrent Development

There are two approaches for parallel agent work. Choose based on scope and coordination needs.

### Option 1: Agent Teams (recommended for coordinated work)

Agent teams let a lead session coordinate multiple teammate sessions with shared task lists and messaging. Teammates can communicate directly with each other.

```bash
# Start Claude and use the TeamCreate tool or ask Claude to create a team
claude
> "Create an agent team to implement PROJ-1 and PROJ-2 in parallel"
```

**Best practices for agent teams:**
- Start with 2-4 teammates (diminishing returns beyond that)
- Each teammate should own different files — avoid overlapping edits
- Use `isolation: "worktree"` for teammates that need their own git branch
- Set `mode: "plan"` for risky work that needs approval
- Monitor progress — don't let teams run fully unattended

**When to use agent teams:**
- Coordinated parallel work (e.g., API + frontend for the same feature)
- Research with competing approaches (teammates investigate alternatives)
- Parallel code review (security, performance, tests — each teammate reviews a domain)

### Option 2: Git Worktrees (recommended for independent features)

For fully independent features with no coordination needed, manual worktrees give you separate Claude instances:

```bash
# From main repo, create worktrees for each feature
git worktree add ../project-feature-a feature/PROJ-1-feature-a
git worktree add ../project-feature-b feature/PROJ-2-feature-b

# Start Claude in each worktree (separate terminal windows)
cd ../project-feature-a && claude
cd ../project-feature-b && claude
```

**Guidelines:**
- Each agent works on an **independent feature branch**
- Avoid working on the same files across agents
- Coordinate via ticket tracker (if configured) — check ticket status before starting
- When done, create PR and clean up worktree:
  ```bash
  git worktree remove ../project-feature-a
  ```

### Which Approach to Use

| Scenario | Approach |
|----------|----------|
| Independent features, different areas of code | Worktrees |
| Related features that need coordination | Agent teams |
| Research/investigation with multiple angles | Agent teams |
| Batch implementation of many stories | Worktrees with `/implement-all --batch` |
| Features with shared dependencies | **Don't parallelize** — work sequentially |

---

## External Tools: CLI vs MCP

**Policy: CLI-first, MCP for gaps.** See [ADR-0004](~/.claude/adr/0004-cli-first-mcp-for-gaps.md) for the full rationale.

- Use CLI tools (`gh`, `jira`, `aws`, etc.) as the default — zero context overhead, works in CI
- Add MCP servers only for tools with no adequate CLI (Figma, Notion, browser testing)
- Max 5 MCP servers per project; enable MCP Tool Search if you need more
- Document all MCP servers in this file under the section below

### Configured CLIs
- `gh` — GitHub (PRs, issues, reviews) *(optional)*
- `jira` — Jira (tickets, status updates) *(optional)*

### Configured MCP Servers
*None configured yet. Add MCP servers with `claude mcp add` and document them here.*

<!-- Example:
- **sentry** (HTTP) — Error monitoring. "What errors spiked in the last 24 hours?"
- **postgres** (stdio) — Analytics database. "What's our revenue this month?"
-->

---

## Jira Integration (Optional)

If your project uses Jira, Shipwright integrates via [jira-cli](https://github.com/ankitpokhrel/jira-cli). This enables commands like `/implement`, `/jira-task`, and `/init-project`.

### Developer Setup

Each developer needs jira-cli configured locally. See [docs/ONBOARDING.md](./docs/ONBOARDING.md) for setup instructions.

### How It Works
- **Local development**: Uses your personal Jira API token (configured via jira-cli)
- **GitHub Actions**: Uses org-level service account (pre-configured)
- Each developer maintains their own `~/.config/.jira/.config.yml` locally
- No credentials are stored in the repo

> **Without Jira:** The core workflow (feature branches, PRs, code review, `/new-feature`, `/review`) works without Jira. Only the Jira-specific commands (`/implement`, `/jira-task`, `/init-project`, `/implement-all`) require it.

---

## GitHub Actions Setup

If using GitHub Actions, the following secrets can be configured at the org or repo level:
- `ANTHROPIC_API_KEY` — Claude API key
- `JIRA_API_TOKEN`, `JIRA_EMAIL`, `JIRA_SERVER` — Jira service account *(only if using Jira)*
- `SLACK_WEBHOOK_URL` — Slack notifications *(only if using Slack)*

The Claude GitHub App should be installed for `@claude` PR review support.

For admin details, see [docs/ADMIN_SETUP.md](./docs/ADMIN_SETUP.md).

---

## Slack Notifications

Slack notifications are pre-configured at the organization level. All repos notify the shared engineering channel.

**Events that trigger notifications:**

| Event | Message |
|-------|---------|
| PR created | 🔀 New PR: Title (#123) |
| PR merged | ✅ Merged: Title (#123) |
| Review submitted | 👀 Review submitted on #123 |
| @claude triggered | 🤖 Claude triggered on #123 |
| @claude finished | 🤖 Claude finished on #123 - success/failure |

For webhook configuration, see [docs/ADMIN_SETUP.md](./docs/ADMIN_SETUP.md).

---

## New Project Setup Checklist

When cloning this template for a new project, here's what you need to configure:

### Inherited from Template (no setup needed)
- [x] GitHub Actions workflows (`.github/workflows/`)
- [x] Claude custom commands (`.claude/skills/`)

### Pre-Configured at Org Level (no setup needed)
- [x] GitHub secrets (`ANTHROPIC_API_KEY`, `JIRA_*`, `SLACK_WEBHOOK_URL`)
- [x] Claude GitHub App (installed org-wide)

### Per-Project Setup Required

| Item | Where | What's Needed | Required? |
|------|-------|---------------|-----------|
| **CLAUDE.md customization** | This repo | Project-specific conventions | Yes |
| **gh CLI** | Local machine | GitHub CLI — see [docs/ONBOARDING.md](./docs/ONBOARDING.md) | If using GitHub |
| **jira-cli** | Local machine | Jira CLI — see [docs/ONBOARDING.md](./docs/ONBOARDING.md) | If using Jira |
| **Jira project key** | CLAUDE.md | Your project's Jira key (e.g., `PROJ`) | If using Jira |

### Quick Setup Commands

```bash
# 1. Create a new repo from the template (no link to the original)
gh repo create my-new-project --template jettwein/shipwright --public
cd my-new-project

# 2. Customize CLAUDE.md with your project details

# 3. Optionally configure integrations
claude
> /setup
```

Everything is already installed — skills, hooks, workflows. No need for `/onboard` or `/adopt` on template-created projects.

---

## Adopting in Existing Repositories

For existing repositories that weren't created from this template, use `/onboard` and `/adopt` to set up the agentic coding workflow.

### How to Adopt

1. **Open Claude Code** in the existing repo:
   ```bash
   cd /path/to/existing-repo
   claude
   ```

2. **Orient Claude** (optional but recommended):
   ```
   /onboard
   ```
   Claude analyzes the codebase, checks your environment, and shows what's available.

3. **Install the workflow**:
   ```
   /adopt
   ```

4. **Follow the prompts** — Claude will:
   - Verify you're in the right repo
   - Create `.claude/skills/` with custom commands
   - Create `.github/workflows/` with GitHub Actions
   - Create a starter `CLAUDE.md`
   - Provide a checklist of secrets to configure

### What Gets Created

| Directory/File | Purpose |
|----------------|---------|
| `.claude/skills/jira-task/` | Jira ticket implementation workflow |
| `.claude/skills/new-feature/` | New feature workflow |
| `.claude/skills/review/` | Pre-PR code review |
| `.claude/settings.json` | Claude permissions for git, gh, jira |
| `.github/workflows/claude.yml` | @claude PR review trigger |
| `.github/workflows/auto-review.yml` | Automatic code review |
| `.github/workflows/slack-notifications.yml` | Slack notifications |
| `CLAUDE.md` | Project instructions (customize this!) |

### After Adopting

1. **Customize CLAUDE.md** — add project-specific details, tech stack, conventions
2. **Set up integrations** (optional) — run `/setup` to configure Jira, GitHub Actions, and Slack
3. **Commit and push** the new files

---

## Custom Commands

| Command | Description |
|---------|-------------|
| `/onboard` | Guided onboarding — analyzes codebase, checks environment, shows available tools |
| `/adopt` | Adopt agentic workflow in an existing repository |
| `/doctor` | Diagnose setup issues and verify configuration |
| `/init-project JIRA-PROJ-ID [file]` | Read requirements and create Jira epics/stories |
| `/implement JIRA-PROJ-ID-123` | Implement a single Jira story end-to-end (branch, code, review, PR) |
| `/implement-all JIRA-PROJ-ID [--wait\|--batch]` | Auto-implement all stories in dependency order |
| `/jira-task JIRA-PROJ-ID-123` | Fetch issue and plan implementation |
| `/new-feature <desc>` | Implement with explore-plan-code-commit workflow |
| `/review` | Review changes before PR |
| `/team <subcommand>` | Create and manage agent teams (create, template, status) |
| `/adr <subcommand>` | Manage Architecture Decision Records (new, list, view, check) |
| `/help [topic]` | Contextual help — shows available commands, troubleshooting, how-tos |
| `/setup` | Interactive setup wizard for configuring integrations |


---

## UI Development (Optional)

> **Note:** This section is configured during `/adopt` or `/setup`. If your project has UI, you can use the **frontend-design skill** for creating custom, distinctive interfaces.

When building UI components or pages, invoke the frontend-design skill:
- Use `/frontend-design` or ask Claude to "use the frontend-design skill"
- The skill creates production-grade, polished interfaces
- Works with any CSS framework (Tailwind, vanilla CSS, ShadCN, etc.)

### Guidelines
- Describe the desired look and feel when requesting UI work
- Specify framework preferences if any (e.g., "use Tailwind")
- Focus on user experience and accessibility
- The skill avoids generic AI aesthetics and creates distinctive designs

### Example Usage
```
"Create a dashboard page with a sidebar navigation using Tailwind CSS"
"Build a pricing table component with a modern, clean design"
"Design a login form with dark mode support"
```

*Add project-specific UI conventions (component libraries, design tokens, etc.) below as needed.*

---

## Workflow: Requirements → Stories → Implementation

### Phase 1: Define Stories
1. **Add requirements**: Copy `requirements.md.example` to `requirements.md` and fill it in
2. **Generate stories**: `/init-project JIRA-PROJ-ID` - Claude reads requirements and writes stories to `stories.md` *(requires Jira)*
3. **Review stories**: Review `stories.md` - each story has GIVEN/WHEN/THEN acceptance criteria
4. **Iterate** (optional): Edit `stories.md` directly, or ask Claude to make changes conversationally
5. **Approve**: Say "approved" to create Jira tickets (Claude will NOT create tickets without approval)

### Phase 2: Implement
6. **Implement all stories**: `/implement-all JIRA-PROJ-ID` - Claude analyzes dependencies and works through stories *(requires Jira)*
   - `--wait` (default): Waits for PR approval before next story
   - `--batch`: Creates all PRs without waiting
   - Or use `/jira-task JIRA-PROJ-ID-X` for individual stories
7. **Human reviews and merges**: Review PRs, merge when approved

> **Without Jira:** Use `/new-feature <description>` for the same explore-plan-code-commit workflow without ticket tracking.

---

## Adding Features After Initial Implementation

Once a project is running, there are three ways to add new features:

### Option 1: Quick Features (Conversational)
Best for: 1-2 small features

Just tell Claude what you want:
> "Add a dark mode toggle to the app"

Claude will:
1. Create a feature branch
2. Implement the feature
3. Create a PR

### Option 2: Work on Existing Tickets (requires Jira)
Best for: Pre-planned work or tickets created by others

Reference a Jira ticket directly:
> "Work on PM-10"

Or use the command:
> `/jira-task PM-10`

Claude will fetch the ticket details and implement it.

### Option 3: Batch of New Features (Requirements Update, requires Jira)
Best for: Major new feature areas or significant scope additions

1. Update `requirements.md` with new features
2. Run `/init-project JIRA-PROJ-ID`
3. Review generated stories in `stories.md`
4. Say "approved" to create Jira tickets
5. Use `/implement-all` or work tickets individually

### Which Option to Choose?
| Scope | Recommended Approach |
|-------|---------------------|
| Quick fix or small feature | Option 1 (conversational) |
| Ticket already exists | Option 2 (`/jira-task`) |
| Multiple related features | Option 3 (requirements update) |
| New feature area | Option 3 (requirements update) |

---

## Git Workflow

> **Note**: Core workflow is also in [WORKFLOW.md](./WORKFLOW.md) for syncing to cloned projects.

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

### PR Process
1. Push branch: `git push -u origin <branch-name>`
2. Create PR: `gh pr create --base main --fill`
3. **Wait for human review** - DO NOT merge without approval
4. Address feedback, push updates (see **@claude PR Reviews** below)
5. Human merges when approved

### Automatic Code Review

Every PR is automatically reviewed by Claude when opened or updated. This is **advisory only** — it won't block merging.

**What Claude checks:**
- Potential bugs, edge cases, error handling gaps
- Security concerns (XSS, injection, exposed secrets)
- React: hooks usage, accessibility, TypeScript types (avoid `any`)
- TypeScript: error handling, type safety, null checks
- Config files: exposed secrets, valid syntax

**Review output format:**
- Summary (one sentence)
- File-by-file findings with line numbers
- Verdict: ✅ Looks good, ⚠️ Minor suggestions, or 🔍 Needs discussion

This runs automatically — no action needed. The review appears as a comment on the PR.

**Configuration:** See `.github/workflows/auto-review.yml`

### @claude PR Reviews

Humans can request changes directly in PR comments using `@claude`:

```
@claude Please fix the type errors in this file
@claude Can you add error handling to this function?
@claude Refactor this to use the shared Button component
```

**The flow in practice:**

1. **Claude creates PR** for a feature branch
2. **Human reviews** the PR and leaves a comment:
   ```
   @claude Please add error handling to the submit function
   ```
3. **GitHub Action triggers** automatically (listens for `@claude` mentions)
4. **Claude spins up** in a GitHub Actions runner, checks out the PR branch
5. **Claude reads context** — the PR diff, your comment, CLAUDE.md, custom commands
6. **Claude makes changes** based on your feedback and pushes to the branch
7. **Human sees the update** in the PR and continues the review
8. **Repeat** as needed until the PR is ready to merge

**What Claude can do in PR reviews:**
- Fix bugs and type errors
- Refactor code based on feedback
- Add missing error handling
- Any code change a human reviewer requests

**Note:** There is no persistent Claude instance waiting. Each `@claude` mention triggers a fresh GitHub Actions job that spins up, does the work, and shuts down.

This enables an iterative review workflow without the human needing to make changes themselves.

### Jira Status Updates (if configured)
If the project uses Jira, Claude should update ticket status as work progresses:
- **Starting work** → Move ticket to "In Progress"
- **PR merged** → Move ticket to "Done"

### After Creating a PR
Claude can automatically check if a PR has been merged:
```bash
gh pr view <PR-number> --json state --jq '.state'
```

**User can say any of these to proceed:**
- "continue" or "next" - Claude checks PR status and proceeds if merged
- "merged" - Claude proceeds with cleanup
- Give a new task - Claude checks PR status first

**After merge is confirmed, Claude will:**
1. Pull latest main: `git checkout main && git pull`
2. Delete feature branch: `git branch -d <branch-name>`
3. Update Jira (if configured): `jira issue move <KEY> "Done"`

---

## Architecture Decision Records (ADRs)

ADRs govern agent behavior across all projects. They define MUST/SHOULD/MAY rules that agents are expected to follow.

### Where ADRs Live
- **Global**: `~/.claude/adr/` (symlinked from `~/repos/adrs/adr/`)
- **Project-local**: `docs/adr/` (overrides global ADRs when conflicting)

### ADR Lifecycle
| Status | Meaning |
|--------|---------|
| `proposed` | Under discussion, not binding |
| `accepted` | Binding — agents MUST follow |
| `deprecated` | No longer applies |
| `superseded` | Replaced by newer ADR |

### Commands
- `/adr list` — View all ADRs from both scopes
- `/adr view NNNN` — Read a specific ADR
- `/adr new <title>` — Create a new ADR (global or local)
- `/adr check` — Find ADRs relevant to current work

### When to Check ADRs
- Before starting implementation (during explore/plan phase)
- During code review (verify compliance)
- When making architectural decisions (check for existing guidance)

### When to Create ADRs
- When establishing a new rule that should apply across projects
- When a project needs a local exception to a global rule
- When formalizing a decision that came from a retrospective or incident

---

## Project-Specific Rules

<!-- Add project-specific conventions, patterns, and decisions below -->
<!-- Example entries:
- Use snake_case for all Python files
- All API endpoints must have OpenAPI documentation
- Database migrations require review from @dbadmin
-->

*No project-specific rules yet. Add them as the project evolves.*

---

## Decisions Log

<!-- Record important architectural or design decisions here -->
<!-- Format: **YYYY-MM-DD**: Decision description - rationale -->

*No decisions logged yet.*

---

## Learnings

<!-- Record things Claude or humans learn about the codebase -->
<!-- Example: "The auth module requires tokens to be refreshed every 15 min" -->

*No learnings recorded yet.*
