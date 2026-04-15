---
name: new-feature
description: Implement a new feature following the explore-plan-code-commit pattern. Use when the user wants to build something new.
argument-hint: <description of the feature>
---

# New Feature Workflow

Implement a new feature following the explore-plan-code-commit pattern.

## Arguments

$ARGUMENTS - Description of the feature to implement

## Instructions

### 1. Explore
- Read relevant existing code to understand patterns
- DO NOT write any code yet
- Identify similar features as reference
- Note conventions and patterns used
- Check applicable ADRs: Scan `~/.claude/adr/` and `docs/adr/` for accepted ADRs relevant to this feature. Note any MUST rules that constrain the implementation.

### 2. Plan
- Create detailed implementation plan
- Break into discrete, testable steps
- Identify files to create/modify
- Consider parallel task decomposition (frontend vs backend)

### 3. Code
- Write tests first (TDD approach) when applicable
- Implement incrementally
- Run tests after each significant change
- Follow existing code conventions

### 4. Commit
- Create atomic commits with clear messages
- Each commit should be a logical unit
- Use conventional commit format: `<type>(<scope>): <subject>`
- Reference Jira issue if applicable

## Parallel Task Identification

If this feature can be parallelized:
- Identify independent frontend vs backend work
- Suggest git worktree setup or agent team for parallel Claude instances
- Provide clear boundaries for each parallel task
