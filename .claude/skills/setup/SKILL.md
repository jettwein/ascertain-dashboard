---
name: setup
description: Interactive setup wizard for configuring project integrations (Jira, GitHub Actions, Slack, UI).
argument-hint:
disable-model-invocation: true
---

# Project Setup Wizard

Interactive setup for configuring your project integrations.

## Instructions

You are helping the user configure their project. This command verifies their environment is ready and helps configure project-specific settings.

### Step 1: Verify Developer Environment

First, check that the developer's environment is properly configured:

```bash
# Check GitHub CLI
gh auth status 2>&1 | head -3

# Check Jira CLI
jira project list 2>&1 | head -3
```

**If either check fails**, tell the user:
```
Your development environment isn't fully configured.
Please follow the setup guide: docs/ONBOARDING.md

Once complete, run /setup again.
```

Stop here if environment checks fail.

**If both checks pass**, continue to Step 2.

### Step 2: Check Current Configuration

Check what's already configured in this project:

```bash
# Check for CLAUDE.md
ls CLAUDE.md 2>/dev/null && echo "CLAUDE.md exists"

# Check for workflow files
ls .github/workflows/*.yml 2>/dev/null

# Check git remote
git remote get-url origin 2>/dev/null
```

Report what you find to the user.

### Step 3: Ask About Integrations

Ask the user which integrations they want to enable for this project:

**"Which integrations would you like to set up?"**

1. **Jira** — Ticket management (`/jira-task`, `/init-project`, `/implement-all`)
2. **GitHub Actions** — @claude PR reviews, automatic code review
3. **Slack** — PR and Claude activity notifications
4. **All of the above** (Recommended)
5. **None** — Just use basic commands (`/new-feature`, `/review`)

### Step 4: Configure Based on Selections

Based on their selections, verify org-level setup and gather project info. If Jira selected, ask for the project key. If GitHub Actions selected, verify secrets are configured.

### Step 5: Ask About UI Approach

**"Does this project have a frontend? If so, would you like to use the frontend-design skill?"**

1. **frontend-design skill** — Custom UI using any framework
2. **None/Skip** — No UI guidance

### Step 6: Update CLAUDE.md

Help the user customize CLAUDE.md with project-specific details:
1. Project name and description
2. Tech stack
3. Key conventions
4. Jira project key (if using Jira)
5. UI Development section (if frontend-design selected)

### Step 7: Summary

Provide a summary of the project configuration, available commands, and next steps.

## Important Notes

- Be conversational and helpful
- Don't walk through environment setup — point to docs/ONBOARDING.md instead
- Focus on project-specific configuration
- If something fails, help troubleshoot or point to the right resource
