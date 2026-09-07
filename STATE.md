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

> **TL;DR:** **M1** 0/2 done · 2 in progress · 0 in review · 0 blocked · 0 todo. Current
> wave (0 claimable). List claimable plans with `node scripts/plan.mjs`; this repo's script
> only lists — claiming means hand-editing a plan's `status`/`owner`/`branch`/`updated_at`
> frontmatter yourself (see m18-05-handoff-notes for why a bigger repo automates this).

---

## Milestone progress

| Milestone | done | review | in_progress | blocked | todo | total |
| --------- | ---: | -----: | ----------: | ------: | ---: | ----: |
| M1        |    0 |      0 |           2 |       0 |    0 |     2 |

## Claimable now

_None — both plans are claimed and in progress (see below)._

## In progress

| Plan  | Title                                     | Owner                 | Branch                   | Since                | Stale |
| ----- | ----------------------------------------- | --------------------- | ------------------------ | -------------------- | ----- |
| `P01` | CLI usability - help text and --version   | sonnet-p01-2026-09-07 | `plan/01-cli-usability`  | 2026-09-07T10:15:00Z | —     |
| `P02` | API docs - pagination and error responses | opus-p02-2026-09-07   | `plan/02-api-error-docs` | 2026-09-07T10:20:00Z | —     |

`P01` and `P02` have disjoint `owned_paths` — that's what makes it safe to work both at once,
each in its own worktree (see m18-03-owned-paths-worktrees):
`git worktree add ../claude-code-lab-p01 plan/01-cli-usability` and
`git worktree add ../claude-code-lab-p02 plan/02-api-error-docs`.

## Blocked

_None._

## In review

_None._

## Done

_None._

## Recent changes

| Plan  | Status      | Updated              | Owner                 |
| ----- | ----------- | -------------------- | --------------------- |
| `P02` | in_progress | 2026-09-07T10:20:00Z | opus-p02-2026-09-07   |
| `P01` | in_progress | 2026-09-07T10:15:00Z | sonnet-p01-2026-09-07 |
