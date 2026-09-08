#!/usr/bin/env sh
# Point git at the repo-managed hooks (idempotent). Run once per clone:
#   sh scripts/install-hooks.sh
# Installs: pre-commit (public-hygiene on staged content) and pre-push (public-hygiene on the
# commits being published + the lesson-tag contract). See .claude/rules/public-hygiene.md.
set -e
git config core.hooksPath scripts/git-hooks
chmod +x scripts/git-hooks/* 2>/dev/null || true
echo "hooks installed: $(git config core.hooksPath)"

# A fresh clone often inherits a personal global git identity. This repo is public and its history
# is course content — check now rather than at push time.
root=$(git rev-parse --show-toplevel)
if node "$root/scripts/check-public-hygiene.mjs" --identity; then
  echo "commit identity: OK"
else
  echo "" >&2
  echo "Set the project identity in this clone before committing:" >&2
  echo "  git config user.name codechup" >&2
  echo "  git config user.email <id>+codechup@users.noreply.github.com" >&2
  echo "(see .claude/rules/public-hygiene.md — 'Commit identity')" >&2
  exit 1
fi
