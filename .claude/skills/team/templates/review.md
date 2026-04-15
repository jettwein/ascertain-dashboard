# Review Team Template

Creates a parallel code review team. Each teammate reviews from a different perspective.

## Teammates

| # | Role | Focus |
|---|------|-------|
| 1 | Security Reviewer | Auth, injection, XSS, secrets, OWASP top 10, credential exposure |
| 2 | Performance Reviewer | N+1 queries, unnecessary renders, bundle size, caching, memory leaks |
| 3 | Test Reviewer | Coverage gaps, edge cases, missing assertions, test quality, flaky tests |

## Configuration

- **Isolation**: None (read-only review)
- **Mode**: default (no plan approval needed)
- **Target**: Current branch diff against main

## Teammate Prompts

Each teammate should:
1. Run `git diff main...HEAD` to see all changes
2. Focus exclusively on their domain
3. Output findings in this format:
   ```
   ### [Domain] Review

   **Verdict**: ✅ / ⚠️ / 🔴

   #### Findings
   - **file.ts:42** — [severity] [description]
   - **file.ts:78** — [severity] [description]

   #### Summary
   [1-2 sentences]
   ```

## Lead Responsibility

After all teammates report, merge findings into a single consolidated review.
