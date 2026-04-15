---
name: review
description: Review current changes for bugs, security issues, style problems, and ADR compliance before creating a PR.
argument-hint:
disable-model-invocation: true
---

# Code Review

Review current changes against project standards.

## Instructions

1. Run `git diff` to see all staged and unstaged changes
2. Run the test suite: `make test`
3. Run linting: `make lint`
4. Check each changed file against the [review checklist](checklist.md)

5. Check ADR compliance:
   - Scan `~/.claude/adr/` and `docs/adr/` for accepted ADRs
   - Verify changes comply with MUST rules
   - Flag violations as issues, note unfollowed SHOULD recommendations

6. Provide review summary using the [output format](output-format.md)

If NEEDS CHANGES, list specific items that must be addressed before PR creation.
