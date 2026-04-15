# Implement Team Template

Creates an implementation team split by architecture layer.

## Setup

Ask the user: **"What are you building?"**

Based on the response, create the appropriate team:

### Fullstack Features

| # | Role | Focus |
|---|------|-------|
| 1 | Backend | API endpoints, database, business logic, migrations |
| 2 | Frontend | UI components, state management, routing, styles |

### Backend-Only Features

| # | Role | Focus |
|---|------|-------|
| 1 | API Layer | Controllers, routes, validation, middleware |
| 2 | Data Layer | Models, migrations, queries, seeds |

## Configuration

- **Isolation**: worktree (each teammate gets their own branch)
- **Mode**: plan (teammates present plans before coding)

## Teammate Prompts

Each teammate should:
1. Create a feature branch from main
2. Follow the `/implement` workflow for their domain
3. Create a PR when done
4. Communicate via messages if they need something from the other teammate

## Lead Responsibility

Monitor progress, answer questions, and merge PRs in the right order (usually backend first, then frontend).
