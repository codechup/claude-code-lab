#!/usr/bin/env bash
# headless-example.sh — the m13-01-claude-p lab: running Claude Code non-interactively
# (`claude -p`) against this repo, the same way claude-code-training's content-plan writers
# capture a lab transcript (docs/authoring/CONTENT-PLAN-BRIEF.md §1.3): headless,
# reproducible, and cheap enough to re-run.
set -euo pipefail

# --- Read-only: ask a question, get machine-readable output back. -------------------------
# --output-format json wraps the result in a single JSON object (result, cost, duration,
# num_turns, ...) instead of plain text — easy to pipe into `jq` or a script.
claude -p "Summarize every bug in BUGS.md as a JSON array of objects with id, where and fix." \
  --model sonnet \
  --max-turns 6 \
  --output-format json \
  --allowedTools "Read"

# --- A lab that edits files needs a wider allowlist and an explicit permission mode. -------
# Never use --permission-mode bypassPermissions for a real capture (or in CI) — acceptEdits
# still asks for anything outside --allowedTools, it just doesn't prompt for edits the tool
# list already allows.
#
# claude -p "Fix the off-by-one bug in paginate() per BUGS.md B1, then run npm test." \
#   --model sonnet \
#   --max-turns 10 \
#   --output-format json \
#   --permission-mode acceptEdits \
#   --allowedTools "Read,Edit,Bash(npm test)"

# --- Streaming variant, for a long-running task where you want incremental progress. -------
# claude -p "..." --output-format stream-json --include-partial-messages
