---
id: P02
title: API docs - pagination and error responses
milestone: M1
status: in_progress
owner: opus-p02-2026-09-07
branch: plan/02-api-error-docs
model_hint: sonnet
effort_hint: low
depends_on: []
owned_paths:
  - docs/API.md
shared_paths: []
estimate: S
updated_at: 2026-09-07T10:20:00Z
---

## Goal

Document `src/api/server.ts`'s actual routes, status codes and error shapes — today the
only description of the HTTP API is `README.md`'s one-line mention.

## Context

The m18-02-state-md-and-claims / m18-03-owned-paths-worktrees / m18-05-handoff-notes labs
use this plan (and `P01-cli-usability.md`) as the worked example: two plans with disjoint
`owned_paths`, claimed and worked in parallel worktrees. This plan only creates
`docs/API.md` — a new file — so it can never conflict with `P01`'s `src/cli.ts` edits even
if both are claimed and worked at the same time.

## Scope

A new `docs/API.md`: one section per route (`GET /health`, `GET /tasks`, `POST /tasks`,
`GET /tasks/:id`, `POST /tasks/:id/done`, `POST /tasks/:id/render-note`), each with its
success shape and every error status it can return.

## Deliverables

`docs/API.md`, written directly from reading `src/api/server.ts` — not guessed.

## Acceptance criteria

- Every route in `createApp()` has a matching section.
- Every `sendJson(res, <status>, ...)` call site's status code appears somewhere in the doc
  for that route.
- `npm test` and `npm run typecheck` stay green (this plan touches no source file).

## Steps

1. Claim this plan and create a worktree for it:
   `git worktree add ../claude-code-lab-p02 plan/02-api-error-docs`.
2. Read `src/api/server.ts` route-by-route; write `docs/API.md` as you go.
3. Cross-check against `test/api.test.ts` for the response shapes already under test.

## Tests required

None — this plan produces documentation only, no behaviour change.

## Non-goals / pitfalls

- Don't edit `src/api/server.ts` or `README.md` — a doc-accuracy fix belongs to whichever
  plan owns the file that's wrong, not this one.
- Don't document the two `TEACHING SURFACE`-turned-`BUGS.md` fixes (B6/B7) as if they were
  ordinary behaviour — link to `BUGS.md` instead of re-explaining them.

## Verification

Run for real: `npm test`, `npm run typecheck`, then a manual read-through of `docs/API.md`
against `src/api/server.ts` line by line. Paste the diff in this section when the plan ships.

## Handoff notes

- _Filled by the executing session: what changed, decisions, follow-ups, blockers._
