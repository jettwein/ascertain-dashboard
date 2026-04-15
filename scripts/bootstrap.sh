#!/usr/bin/env bash
# Shipwright Bootstrap
# One-time setup to make /adopt and /onboard available globally.
# Run: curl -sf https://raw.githubusercontent.com/jettwein/shipwright/main/scripts/bootstrap.sh | bash

set -euo pipefail

REPO_DIR="${SHIPWRIGHT_DIR:-$HOME/repos/shipwright}"

echo "Setting up Shipwright..."

# Clone if not already present
if [[ -d "$REPO_DIR/.git" ]]; then
  echo "Shipwright repo found at $REPO_DIR — pulling latest..."
  git -C "$REPO_DIR" pull --quiet
else
  echo "Cloning Shipwright to $REPO_DIR..."
  mkdir -p "$(dirname "$REPO_DIR")"
  git clone --quiet https://github.com/jettwein/shipwright.git "$REPO_DIR"
fi

# Create global skills directories
mkdir -p ~/.claude/skills/adopt
mkdir -p ~/.claude/skills/onboard

# Symlink skills
ln -sf "$REPO_DIR/.claude/skills/adopt/SKILL.md" ~/.claude/skills/adopt/SKILL.md
ln -sf "$REPO_DIR/.claude/skills/onboard" ~/.claude/skills/onboard

echo ""
echo "Done! You now have:"
echo "  /adopt   — adopt Shipwright into any repo"
echo "  /onboard — guided onboarding in any repo"
echo ""
echo "Next steps:"
echo "  1. Open any repo:  cd your-project && claude"
echo "  2. Get oriented:   /onboard"
echo "  3. Adopt workflow:  /adopt"
