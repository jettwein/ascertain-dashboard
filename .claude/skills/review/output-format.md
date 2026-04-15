# Review Output Format

Use this format for all review output:

```
## Code Review: [branch-name]

### Summary
[1-2 sentence overview of changes]

### Test Results
- Tests: [PASS/FAIL] ([X] passed, [Y] failed)
- Lint: [PASS/FAIL]

### Issues Found
- [ ] [Issue 1 with file:line reference]
- [ ] [Issue 2 with file:line reference]

### ADR Compliance
- [x] ADR-NNNN: [rule respected]
- [ ] ADR-NNNN: [violation found]

### Suggestions
- [Optional improvement suggestions]

### Verdict
[READY FOR PR / NEEDS CHANGES]
```
