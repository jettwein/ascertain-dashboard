---
paths:
  - "src/db/**"
  - "src/models/**"
  - "src/repos/**"
  - "src/repositories/**"
  - "prisma/**"
  - "migrations/**"
  - "**/*.sql"
---

# Database Rules

- Never use raw string interpolation in SQL — always use parameterized queries
- Migrations must be reversible (include both up and down)
- Never drop columns or tables without confirming the data is no longer needed
- Add indexes for columns used in WHERE, JOIN, and ORDER BY clauses
- Use transactions for operations that modify multiple tables
- Name migrations descriptively: `add-user-email-index`, not `migration-42`
- Repository/data access layer should be the only code that touches the database directly
