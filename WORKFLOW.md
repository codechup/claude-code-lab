# WORKFLOW.md — a review → verify → fix pipeline over this repo

The m16-04-pipeline-lab lab: use the Workflow tool (`m16-01-workflows`) to run a
three-phase pipeline over a real change in this repo — a `review` agent finds issues, a
`verify` phase checks each finding is real, and a `fix` agent applies only the confirmed
ones. This file is the brief; the workflow script itself is written during the lab (see
`docs/CURRICULUM.md`'s m16 module in `claude-code-training` and the Workflow tool's own
script-authoring reference).

## Why three phases, not one

A single "review and fix" agent conflates two failure modes: a false-positive finding
becomes a real (unwanted) code change, and there is no checkpoint between "Claude thinks
there's a bug" and "Claude edited the file." Splitting `review` from `verify` gives a
cheap, read-only gate in between — most of what makes an orchestrated pipeline worth its
extra cost over one agent turn.

## The three phases

1. **Review** (read-only). Point the `code-reviewer` subagent (`.claude/agents/code-reviewer.md`)
   at a diff or a set of files. Output: a list of findings, each with a `file:line` pointer
   and a one-line description. No tool access beyond `Read`/`Grep`/`Glob` — it cannot change
   anything.
2. **Verify** (read-only, independent). For each finding from phase 1, re-check it against
   the actual file content and this repo's own rules (`BUGS.md`, `.claude/CLAUDE.md`) —
   confirm it's real, not a misreading of the diff, and not one of the two intentional
   `TEACHING SURFACE`-turned-`BUGS.md` items unless a lesson has just introduced a new one.
   Output: each finding tagged `confirmed` or `rejected`, with a reason.
3. **Fix** (write access, scoped). Only `confirmed` findings reach this phase. The
   `test-writer` and the primary session apply the minimal fix for each one, run `npm test`
   and `npm run typecheck` after every change, and stop if either goes red.

## A worked example over this repo

Run the pipeline against a deliberately reintroduced bug — check out any `-start` tag from
`BUGS.md` (e.g. `lesson/m02-02-start`, the pagination off-by-one) and point phase 1 at
`src/store.ts`. Expected shape of the run:

- **Review** finds the off-by-one in `paginate()` (`start = page * pageSize` should be
  `(page - 1) * pageSize`) — one finding.
- **Verify** confirms it against `BUGS.md`'s B1 entry and the failing test
  (`test/store.test.ts › paginate`) — `confirmed`.
- **Fix** applies the one-line change, runs `npm test` (now green) and `npm run typecheck`
  (unaffected), and stops.

A pipeline that instead "fixes" something not in `BUGS.md`, or that fixes B1 in the CLI or
API wrapper instead of `src/store.ts`, has failed the lab even if `npm test` ends up green —
see `.claude/CLAUDE.md`'s "fix a bug at the source" rule.

## Failure modes to watch for

- **Verify rubber-stamps everything.** If every review finding comes back `confirmed`,
  verify isn't adding anything — check its prompt actually re-reads the file rather than
  trusting phase 1's description.
- **Fix touches files outside the finding's scope.** Constrain `fix`'s tool access
  (`Edit`/`Write` scoped to the files named in confirmed findings) so it can't wander.
- **No stop condition.** Always stop the pipeline on a red `npm test`/`npm run typecheck`
  after a fix — don't let phase 3 "fix the fix" without a human looking first.
