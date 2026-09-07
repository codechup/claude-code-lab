---
id: P01
title: CLI usability - help text and --version
milestone: M1
status: review
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
updated_at: 2026-09-07T10:45:00Z
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

**What shipped.** `src/cli.ts`: every `program.command(...)` got a one-line `.description()`
plus an `.addHelpText("after", ...)` runnable example; `program.version()` reads the version
from `package.json` via a new `readVersion()` helper (reads the file directly with
`node:fs`, not an import assertion — matches this file's existing style). New
`test/cli-usability.test.ts` (3 tests): `readVersion()` matches `package.json`, every
subcommand has a non-empty description, and every subcommand's own `--help` shows an
`Example:` line (captured via `command.configureOutput()` + `outputHelp()` —
`helpInformation()` alone doesn't include `addHelpText()` content, learned by first writing
the test against it and watching it fail with the built-in help text only).

**Verified for real:** `npm test` (20/20, up from 17), `npm run typecheck` (clean),
`node src/cli.ts --version` → `1.0.0`, `node src/cli.ts --help` and
`node src/cli.ts add --help` (both show the new descriptions/example).

**Decisions.** Used commander's own `.version()` rather than a bespoke `--version` handler —
it also gives `-V` for free and integrates with `--help`'s option list.

**Follow-ups / open questions.** None blocking. A future plan could add `--json` to `list`/
`show` for scripting, but that's a new feature, not usability polish — out of this plan's
scope.

**Status:** moved to `review` — ready for another session to check the two acceptance
criteria and merge.
