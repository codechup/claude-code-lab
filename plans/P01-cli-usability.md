---
id: P01
title: CLI usability - help text and --version
milestone: M1
status: in_progress
owner: sonnet-p01-2026-09-07
branch: plan/01-cli-usability
model_hint: sonnet
effort_hint: low
depends_on: []
owned_paths:
  - src/cli.ts
  - test/cli-usability.test.ts
shared_paths: []
estimate: S
updated_at: 2026-09-07T10:15:00Z
---

## Goal

Make `labtrack --help` and each subcommand's `--help` output actually useful, and add a
`--version` flag — right now `commander`'s defaults are the only help text this CLI has.

## Context

The m18-02-state-md-and-claims / m18-03-owned-paths-worktrees / m18-05-handoff-notes labs
use this plan (and `P02-api-error-docs.md`) as the worked example: two plans with disjoint
`owned_paths`, claimed and worked in parallel worktrees, one of them handed off mid-review.
This plan's `owned_paths` never overlaps `P02`'s — that's what makes running both in
parallel worktrees safe.

## Scope

`src/cli.ts` only: per-command `.description()` text and one example per command, plus a
`--version` flag reading `package.json`'s `version` field.

## Deliverables

- Every `program.command(...)` call gets a one-line `.description()` beyond what's there
  today, plus a `--help`-visible example.
- `labtrack --version` prints the version from `package.json`.

## Acceptance criteria

- `node src/cli.ts --help` shows a description for every subcommand.
- `node src/cli.ts --version` prints the same string as `require("./package.json").version`.
- `npm test` and `npm run typecheck` stay green.

## Steps

1. Claim this plan (see `STATE.md`'s claim command) and create a worktree for it:
   `git worktree add ../claude-code-lab-p01 plan/01-cli-usability`.
2. Add descriptions/examples to each `program.command(...)` in `src/cli.ts`.
3. Wire `--version` (commander's own `.version()` helper reads `package.json` for you).
4. Add `test/cli-usability.test.ts` asserting the two acceptance criteria above.

## Tests required

`test/cli-usability.test.ts` — new file, this plan's only test file (see `owned_paths`).

## Non-goals / pitfalls

- Don't touch `src/api/server.ts` or anything under `docs/` — that's `P02`'s territory;
  touching it here defeats the point of disjoint `owned_paths`.
- Don't restructure `buildProgram()` beyond adding descriptions/the version flag.

## Verification

Run for real: `npm test`, `npm run typecheck`, `node src/cli.ts --help`,
`node src/cli.ts --version`. Paste the actual output in this section when the plan ships.

## Handoff notes

- _Filled by the executing session: what changed, decisions, follow-ups, blockers._
