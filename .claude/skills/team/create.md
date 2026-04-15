# Team Create Workflow

Create an agent team where each teammate implements one Jira story.

## Steps

1. Fetch each Jira story:
   ```bash
   jira issue view <KEY>
   ```

2. Analyze stories for dependencies and file overlap:
   - Read each story's description and acceptance criteria
   - Identify which files/areas each story will touch
   - Flag conflicts: if two stories modify the same files, warn the user

3. Present the team plan:
   ```
   ## Agent Team Plan

   ### Teammates
   | # | Story | Title | Area | Isolation |
   |---|-------|-------|------|-----------|
   | 1 | PROJ-1 | [Title] | [area] | worktree |
   | 2 | PROJ-2 | [Title] | [area] | worktree |

   ### Potential Conflicts
   - None detected (or list conflicts)

   ### Team Settings
   - Mode: plan (teammates present plans before coding)
   - Isolation: worktree (each teammate gets their own branch)

   Create this team? (yes/no/adjust)
   ```

4. Wait for user approval, then create the team using TeamCreate:
   - Each teammate gets the full Jira story details
   - Branch name: `feature/<KEY>-<description>`
   - Instructions to follow the `/implement` workflow
   - Reminder to check ADRs and run `/review` before creating PR

5. Report team creation with teammate assignments and monitoring instructions.
