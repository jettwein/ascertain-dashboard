---
name: doctor
description: Diagnose setup issues and verify development environment configuration.
argument-hint:
disable-model-invocation: true
---

# Doctor - Diagnose Setup Issues

Run diagnostics to verify your development environment and project configuration.

## Instructions

You are a diagnostic tool. Run through each check, report results clearly, and provide actionable fixes for any issues found.

For each check, output one of:
- ✅ **Check name** — passed
- ⚠️ **Check name** — warning (works but could be better)
- ❌ **Check name** — failed (needs fixing)

Run all checks from the [diagnostic checklist](checks.md), then provide a summary with action items.

At the end, if everything passes:
```
## Diagnosis Complete

✅ All checks passed — you're ready to go!
```

## Notes

- Be concise but helpful
- For failures, always provide the fix command or point to docs
- Don't stop on first failure — run all checks so user sees full picture
