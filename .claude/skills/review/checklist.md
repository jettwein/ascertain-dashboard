# Review Checklist

Check each changed file against these criteria:

## Code Quality
- [ ] Follows project code style
- [ ] Has appropriate test coverage
- [ ] No debug statements (console.log/print) unless intentional logging
- [ ] Error handling is appropriate
- [ ] Types are properly defined (no `any` in TypeScript)

## Security
- [ ] No hardcoded values or secrets
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] No XSS vulnerabilities in user-facing code
- [ ] No exposed API keys, tokens, or credentials
- [ ] Authentication/authorization checks in place

## Performance
- [ ] No N+1 query patterns
- [ ] No unnecessary re-renders (React)
- [ ] Efficient data structures and algorithms
- [ ] No memory leaks (event listeners, subscriptions cleaned up)

## Maintainability
- [ ] Clear naming (variables, functions, files)
- [ ] No dead code or commented-out blocks
- [ ] Complex logic has comments explaining "why"
- [ ] No overly clever one-liners that hurt readability
