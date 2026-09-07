# STATE.md — claude-code-lab

<!--
  The m18-02-state-md-and-claims lab: a generated-looking STATE.md, mirroring
  claude-code-training's own convention (id/title/milestone/status/owner/branch/
  model_hint/effort_hint/depends_on/owned_paths/shared_paths/estimate/updated_at
  frontmatter on each plans/PNN-*.md). That repo's tools/plan/cli.ts state fully
  regenerates its STATE.md from frontmatter; this repo's scripts/plan.mjs only
  implements the "claimable" subset (see m18-05-handoff-notes) — until a fuller
  generator exists, this file is hand-maintained from the same source of truth, so it
  is possible (if unlikely, for a repo this small) for it to drift from plans/*.md.
  Cross-check plans/*.md's frontmatter if in doubt.
-->

> **TL;DR:** **M1** 0/2 done · 0 in progress · 0 in review · 0 blocked · 2 todo. Current
> wave (2 claimable): `P01`, `P02`. Claim with `node scripts/plan.mjs claim P01 --owner <name>`.

---

## Milestone progress

| Milestone | done | review | in_progress | blocked | todo | total |
| --------- | ---: | -----: | ----------: | ------: | ---: | ----: |
| M1        |    0 |      0 |           0 |       0 |    2 |     2 |

## Claimable now

| Plan  | Title                                     | Owned paths                                |
| ----- | ----------------------------------------- | ------------------------------------------ |
| `P01` | CLI usability - help text and --version   | `src/cli.ts`, `test/cli-usability.test.ts` |
| `P02` | API docs - pagination and error responses | `docs/API.md`                              |

`P01` and `P02` have disjoint `owned_paths` — both are safe to claim and work in parallel
worktrees at once (see m18-03-owned-paths-worktrees).

## In progress

_None._

## Blocked

_None._

## In review

_None._

## Done

_None._

## Recent changes

| Plan  | Status | Updated              | Owner |
| ----- | ------ | -------------------- | ----- |
| `P02` | todo   | 2026-09-07T09:00:00Z | —     |
| `P01` | todo   | 2026-09-07T09:00:00Z | —     |
