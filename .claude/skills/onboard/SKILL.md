---
name: onboard
description: Guided onboarding for new engineers. Analyzes the codebase, checks environment, explains architecture, and shows available tools. Works on any codebase — Shipwright projects, adopted repos, or completely new codebases.
argument-hint:
disable-model-invocation: true
---

# Onboard

Welcome a new engineer to this codebase. Analyze the project, check their environment, and get them productive fast.

This skill works on **any codebase** — it adapts based on what it finds.

## Instructions

Run through all phases in order. Be conversational and welcoming — this is likely someone's first interaction with the project and with Claude Code.

### Phase 1: Detect Project Context

Silently determine what kind of project this is:

```bash
# What's here?
ls CLAUDE.md .claude/skills/*/SKILL.md .claude/commands/*.md .claude/settings.json 2>/dev/null
ls package.json requirements.txt Cargo.toml go.mod Gemfile pom.xml build.gradle pyproject.toml Makefile 2>/dev/null
ls .github/workflows/*.yml 2>/dev/null
git remote get-url origin 2>/dev/null
```

Classify the project:
- **Shipwright project**: Has `.claude/skills/` with multiple skills and `CLAUDE.md`
- **Adopted project**: Has `.claude/` with some skills/commands but may be minimal
- **Standard project**: Has code but no Claude configuration
- **Empty/new project**: Minimal or no code

Store this classification — it determines how the rest of the onboarding flows.

### Phase 2: Greet and Orient

Start with a brief, warm greeting, then provide the [project overview](project-overview.md).

The depth of analysis depends on the project type:
- **Shipwright/Adopted**: Read CLAUDE.md, summarize the project and its conventions
- **Standard/New**: Analyze the codebase to understand what it does

### Phase 3: Check Environment

Run the [environment checks](environment-checks.md).

Present results conversationally — don't dump a wall of checkboxes. Focus on what matters:
- If everything works: "Your environment looks good!"
- If something's missing: explain what it is, why they need it, and how to fix it

### Phase 4: Explore the Codebase

Give the engineer a guided tour. See [codebase tour](codebase-tour.md) for the approach.

Adapt the depth:
- **Large codebase**: Focus on entry points, key directories, and architecture patterns
- **Small codebase**: Can be more thorough
- **Monorepo**: Identify the packages/services and their relationships

### Phase 5: Show Available Tools

Based on what's configured, show what they can do. See [available tools](available-tools.md).

For **standard projects** (no Shipwright), suggest `/adopt` and explain the value.

### Phase 6: Quick Win

End with a concrete next step — something they can do right now:

**If there are open Jira tickets:**
> "You have PROJ-42 assigned to you. Want me to pull it up? Just say `/implement PROJ-42`."

**If there are open PRs:**
> "There's an open PR (#5) that could use a review. Want me to take a look? Just say `/review`."

**If it's a fresh setup:**
> "Want to try building something? Describe a small feature and I'll walk you through it with `/new-feature`."

**If it's a standard project (no Shipwright):**
> "Want to set up the agentic workflow? Just say `/adopt` — I'll walk you through it."

---

## Important Notes

- Be conversational, not robotic — this is someone's first impression
- Don't overwhelm — focus on what they need to know NOW, not everything
- If CLAUDE.md exists, trust it as the source of truth for project conventions
- If things are broken or missing, be helpful not judgmental
- The goal is: in 5 minutes, they understand the project and can start contributing
