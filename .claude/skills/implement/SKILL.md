---
name: implement
description: Implement a single Jira story end-to-end — fetch ticket, create branch, code, review, and create PR. Use when the user references a Jira ticket to implement.
argument-hint: <JIRA-KEY> (e.g., ACME-123)
---

# Implement Story

Implement a single Jira story end-to-end: fetch ticket, create branch, code, review, and create PR.

## Arguments

$ARGUMENTS - Jira issue key (e.g., `ACME-123`)

## Instructions

### Step 1: Fetch the Story

```bash
jira issue view $ARGUMENTS
```

Extract: title, description, acceptance criteria, story points, related issues.

### Step 2: Check ADRs

Scan `~/.claude/adr/` and `docs/adr/` for accepted ADRs relevant to this story. Note any MUST rules that constrain the implementation.

### Step 3: Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/$ARGUMENTS-<short-description>
```

### Step 4: Update Jira Status

```bash
jira issue move $ARGUMENTS "In Progress"
```

### Step 5: Explore and Plan

- Read relevant existing code to understand patterns and conventions
- Identify files to create or modify
- Plan the implementation approach
- Consider test strategy

Present a brief plan to the user using the [plan template](plan-template.md).

**Wait for user confirmation before coding.**

### Step 6: Implement

- Write tests first when applicable (TDD)
- Implement incrementally
- Run tests after each significant change
- Follow existing code conventions
- Verify each acceptance criterion is met

### Step 7: Review

Run the `/review` workflow:
- Run tests and linting
- Check ADR compliance
- Verify all acceptance criteria

If issues are found, fix them before proceeding.

### Step 8: Create PR

```bash
git push -u origin feature/$ARGUMENTS-<short-description>
gh pr create --base main --title "[ISSUE_KEY] Short description" --body "## Summary
- Implements $ARGUMENTS
- [1-2 bullet points on what was done]

## Acceptance Criteria
- [x] [AC 1]
- [x] [AC 2]

## Test Plan
- [How to verify]"
```

Update Jira status:
```bash
jira issue move $ARGUMENTS "In Review"
```

### Step 9: Report

```
## Done: $ARGUMENTS - [Title]

**PR**: [PR URL]
**Branch**: feature/$ARGUMENTS-<description>
**Jira**: Moved to "In Review"

### Acceptance Criteria
- [x] [AC 1]
- [x] [AC 2]

Waiting for PR review and merge.
```

## Error Handling

- **Merge conflict**: Stop, notify user, provide resolution steps
- **Tests failing**: Show failures, fix if straightforward, otherwise ask user
- **Jira CLI error**: Continue without status update, warn user
- **AC can't be verified**: Flag it clearly in the PR and report

## Important Rules

- **Always branch from main** — pull latest before branching
- **Wait for plan approval** — do not start coding without user confirmation
- **Never merge without approval** — create the PR and stop
- **Update Jira status** as work progresses
