#!/usr/bin/env bash
# Notification hook — sends desktop notifications when Claude needs attention.
# Works on macOS (osascript), Linux (notify-send), and WSL (powershell).
# Receives JSON on stdin with notification details.

set -euo pipefail

INPUT=$(cat)
TITLE="Claude Code"
MESSAGE=$(echo "$INPUT" | jq -r '.notification_type // "needs your attention"')

# Build a human-readable message
case "$MESSAGE" in
  permission_prompt)
    BODY="Permission requested — check your terminal"
    ;;
  idle_prompt)
    BODY="Waiting for your input"
    ;;
  *)
    BODY="Needs your attention"
    ;;
esac

# Send platform-appropriate notification
if [[ "$(uname)" == "Darwin" ]]; then
  osascript -e "display notification \"$BODY\" with title \"$TITLE\"" 2>/dev/null || true
elif command -v notify-send &>/dev/null; then
  notify-send "$TITLE" "$BODY" 2>/dev/null || true
elif command -v powershell.exe &>/dev/null; then
  powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('$BODY','$TITLE')" 2>/dev/null || true
fi

exit 0
