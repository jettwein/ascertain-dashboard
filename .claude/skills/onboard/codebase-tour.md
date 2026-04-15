# Codebase Tour

Give the engineer a guided tour of the codebase.

## Approach

Use the Explore agent or Glob/Grep to understand the codebase structure, then present it conversationally. Don't dump raw file listings — synthesize.

## What to Cover

### 1. Architecture Overview

```bash
# Get top-level structure
ls -1
# Get key source directories (adjust based on language)
ls src/ app/ lib/ packages/ services/ 2>/dev/null
```

Explain the architecture pattern:
- "This is a **monorepo** with separate packages for API, frontend, and shared utilities"
- "This is a **standard Express app** with routes, controllers, and models"
- "This is a **Next.js app** with app router, API routes, and shared components"

### 2. Entry Points

Find and explain the main entry points:
- **Web app**: `src/index.ts`, `src/app.ts`, `pages/_app.tsx`, `app/layout.tsx`
- **API**: `src/server.ts`, `src/api/index.ts`, `main.go`
- **CLI**: `src/cli.ts`, `src/main.rs`, `cmd/main.go`
- **Config**: `next.config.js`, `tsconfig.json`, `webpack.config.js`

### 3. Key Patterns

Identify 2-3 patterns the engineer should know:
- "API routes follow the pattern `src/api/[resource]/route.ts`"
- "Components use the container/presenter pattern"
- "Database access goes through the repository layer in `src/db/repos/`"

### 4. Data Flow

If identifiable, trace a typical request:
> "A request hits `src/api/users/route.ts` → calls `src/services/user-service.ts` → queries via `src/db/repos/user-repo.ts` → returns through the service layer"

### 5. Testing

```bash
ls **/*.test.* **/*.spec.* tests/ __tests__/ 2>/dev/null | head -5
```

- Where tests live
- How to run them (`npm test`, `make test`, `go test ./...`)
- Any test utilities or fixtures

### 6. Build & Run

How to build and run the project:
```bash
# Check for common patterns
cat Makefile 2>/dev/null | grep -E '^[a-zA-Z_-]+:' | head -10
cat package.json 2>/dev/null | jq '.scripts' 2>/dev/null
```

- Dev server command
- Build command
- Any required environment variables (check `.env.example`)

## Presentation

Keep it conversational and scannable:

```
### Architecture

This is a Next.js 14 app with the app router pattern.

**Key directories:**
- `app/` — Pages and API routes
- `components/` — Shared React components
- `lib/` — Utilities, database client, auth helpers
- `prisma/` — Database schema and migrations

### How Things Connect

A typical page: `app/dashboard/page.tsx` → uses components from `components/dashboard/` → fetches data via server actions in `lib/actions/` → queries the database through `lib/db.ts`

### Running It

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:3000
npm test           # Run tests
```

You'll need a `.env` file — copy from `.env.example`.
```

Adjust depth based on codebase size. A 10-file project needs a paragraph, not a full tour.
