# Project Overview Phase

Analyze and present the project to the engineer.

## For Shipwright/Adopted Projects

Read `CLAUDE.md` and present:

```
## Welcome to [Project Name]!

[1-2 sentence description from CLAUDE.md or README]

**Tech stack**: [languages, frameworks, databases]
**Repo**: [git remote URL]
**Branch**: You're on `[branch]`

### How This Team Works
[Summarize key workflow rules from CLAUDE.md — keep it to 3-4 bullets max]
```

## For Standard Projects (no CLAUDE.md)

Analyze the codebase to determine:

1. **What it does**: Read README.md, package.json description, or top-level code
2. **Tech stack**: Detect from config files:
   - `package.json` → Node.js (check for React, Next.js, Express, etc.)
   - `requirements.txt` / `pyproject.toml` → Python (check for Django, Flask, FastAPI)
   - `go.mod` → Go
   - `Cargo.toml` → Rust
   - `pom.xml` / `build.gradle` → Java/Kotlin
3. **Architecture**: Scan directory structure for patterns:
   - `src/` vs `app/` vs `lib/`
   - `api/` + `frontend/` → fullstack
   - `packages/` → monorepo
   - `services/` → microservices
4. **Database**: Look for migration files, ORM config, schema files
5. **Testing**: Look for test directories, test config files

Present findings conversationally:

```
## Welcome! Let me tell you about this project.

This is a [type] application built with [tech stack].

[1-2 sentences about what it appears to do]

**Key directories:**
- `src/api/` — [what's here]
- `src/components/` — [what's here]
- `src/db/` — [what's here]
```
