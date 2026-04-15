# Research Team Template

Creates a research team that investigates a question from multiple angles.

## Setup

Ask the user: **"What should the team investigate?"**

Based on the response, create 2-3 teammates exploring different approaches.

### Example Team

| # | Role | Approach |
|---|------|----------|
| 1 | Approach A | [First approach — e.g., using library X] |
| 2 | Approach B | [Alternative — e.g., building from scratch] |
| 3 | Comparison | Waits for A and B, then compares tradeoffs |

## Configuration

- **Isolation**: None (research is read-only)
- **Mode**: default
- **Agent**: Explore (read-only, efficient)

## Teammate Prompts

Each research teammate should:
1. Investigate their assigned approach thoroughly
2. Look at existing code for relevant patterns
3. Check external documentation if needed
4. Report findings in this format:
   ```
   ### Approach: [Name]

   #### Pros
   - [advantage 1]
   - [advantage 2]

   #### Cons
   - [disadvantage 1]
   - [disadvantage 2]

   #### Effort Estimate
   [Low / Medium / High] — [brief justification]

   #### Key Files
   - `path/to/relevant/file.ts` — [why it matters]
   ```

## Lead Responsibility

After all teammates report, synthesize findings into a recommendation with clear tradeoffs.
