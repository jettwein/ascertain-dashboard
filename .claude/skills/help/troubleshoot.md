# Troubleshooting Guide

Common issues and how to fix them.

## "Command not found" or skill doesn't work

**Symptom**: Typing `/implement` or another command does nothing or isn't recognized.

**Fix**: Check if skills are installed:
```bash
ls .claude/skills/*/SKILL.md
```
If empty, run `/adopt` to install Shipwright, or check that the skill directory exists.

## Jira commands fail

**Symptom**: `/implement PROJ-123` or `/jira-task` errors out.

**Fixes**:
1. Check jira-cli is installed: `jira me`
2. If not authenticated: follow docs/ONBOARDING.md for setup
3. Check the project key is correct: `jira project list`

## Git hooks blocking actions

**Symptom**: "Blocked: committing directly to main is not allowed"

**This is intentional.** Create a feature branch first:
```bash
git checkout -b feature/my-change
```

**Symptom**: "Blocked: force push is not allowed"

**This is intentional.** If you really need to force push, do it manually outside Claude Code.

## GitHub CLI not working

**Symptom**: PR creation fails or `gh` commands error.

**Fix**: `gh auth login` and follow the prompts.

## Auto-formatting not running

**Symptom**: Files aren't being formatted after edits.

**Causes**:
1. No formatter installed — install Prettier, Black, gofmt, or rustfmt
2. Hook script missing — check `ls scripts/hooks/post-tool-use.sh`
3. File type not supported — the hook only formats known extensions

## Session feels "forgetful"

**Symptom**: Claude seems to forget project conventions mid-session.

**Cause**: Context compaction happened and rules were summarized away.

**Fix**: The `session-compact.sh` hook should re-inject core rules. If it's not working:
```bash
ls scripts/session-compact.sh  # should exist
```
You can also run `/help` to re-orient, or `/clear` and start fresh.

## Desktop notifications not appearing

**Symptom**: No alerts when Claude is waiting.

**Fixes**:
- macOS: Check System Preferences → Notifications → Script Editor is allowed
- Linux: Install `notify-send` (usually in `libnotify-bin` package)
- WSL: PowerShell notifications may be blocked by execution policy

## "Can't find Shipwright source skills"

**Symptom**: `/adopt` can't find the skills to copy.

**Fix**: The Shipwright repo needs to be cloned locally and `/adopt` symlinked from it:
```bash
curl -sf https://raw.githubusercontent.com/jettwein/shipwright/main/scripts/bootstrap.sh | bash
```

## Something else?

Run `/doctor` for a full diagnostic, or just describe the problem and Claude will help troubleshoot.
