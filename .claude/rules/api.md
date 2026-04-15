---
paths:
  - "src/api/**"
  - "src/routes/**"
  - "src/controllers/**"
  - "src/middleware/**"
  - "api/**"
---

# API Rules

- Validate all request inputs at the boundary — never trust client data
- Return consistent error shapes: `{ error: { code, message, details? } }`
- Use HTTP status codes correctly: 400 for bad input, 401 for unauthenticated, 403 for unauthorized, 404 for not found, 500 for server errors
- Never expose internal error details (stack traces, SQL errors) in responses
- All endpoints must handle errors — no unhandled promise rejections
- Rate-sensitive endpoints should document their limits
- Log requests at the handler level: method, path, status, duration
