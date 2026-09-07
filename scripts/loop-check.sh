#!/usr/bin/env bash
# loop-check.sh — the m17-01-loop lab: a small, idempotent check to point `/loop` at.
#
# `/loop` runs a prompt or slash command on a recurring interval (fixed or self-paced) — see
# m17-01-loop in claude-code-training. A loop target should be cheap, safe to run
# repeatedly, and able to report "nothing to do" without treating that as an error. This
# script is that target: it runs this repo's test suite and typecheck, and exits non-zero
# only on a real regression — never on "no changes since last run".
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "[loop-check] $(date -u +%Y-%m-%dT%H:%M:%SZ) — npm test && npm run typecheck"

if npm test --silent && npm run typecheck --silent; then
  echo "[loop-check] green — nothing to do."
  exit 0
else
  echo "[loop-check] red — a real regression, worth a session's attention." >&2
  exit 1
fi
