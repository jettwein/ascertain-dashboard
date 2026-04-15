---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/__tests__/**"
  - "tests/**"
  - "test/**"
---

# Test Rules

- Test behavior, not implementation — tests should survive refactors
- Each test should be independent — no shared mutable state between tests
- Use descriptive test names: "should return 404 when user not found", not "test1"
- Prefer real implementations over mocks when practical — mock at system boundaries (HTTP, database), not internal modules
- Every bug fix should include a regression test
- Don't test framework behavior — focus on your business logic
- Flaky tests must be fixed or deleted, never skipped indefinitely
