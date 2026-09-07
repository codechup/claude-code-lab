# claude-code-lab

The hands-on lab repository for the **CodeChup Claude Code Academy**
([cc.codechup.com](https://cc.codechup.com)). A small TypeScript/Node 24 project — a CLI
(`labtrack`, a task tracker, built with `commander`) plus a matching HTTP API
(`node:http`) — seeded with a handful of small, real bugs (see `BUGS.md`) and tagged once
per hands-on lesson, so a reader (or a lesson writer) can check out exactly the state a
lesson expects.

`main` is the clean baseline: every seeded bug is fixed, every example skill/hook is in
place, `npm test` is green.

## Quick start

```bash
git clone https://github.com/codechup/claude-code-lab.git
cd claude-code-lab
npm ci
npm test          # vitest — all green on main
npm run typecheck # tsc --noEmit
npm run lint      # eslint + prettier --check

npm start -- add "buy milk" --priority 1     # try the CLI
npm run api                                   # try the HTTP API on :3000
```

## Structure

```
src/
  types.ts        Task interface, InvalidTaskError
  store.ts        all business logic (CLI and API are thin wrappers around this)
  cli.ts          labtrack CLI (commander): add, list, show, done, rm
  api/server.ts   tiny HTTP API: GET/POST /tasks, GET /health, ...
test/             vitest — one file per area (store, overdue, persist, api)
.claude/          this repo's own minimal Claude Code setup (CLAUDE.md, one rule,
                  4 hooks, 3 skills) — teaching material, not a full dogfooding setup
BUGS.md           every seeded bug: what it is, how to reproduce it, its tag pair
```

## How a lesson uses a tag

Every hands-on lesson in the curriculum names a tag pair:

```bash
git checkout lesson/<module>-<NN>-start      # the state before the exercise
# ... do the lesson's exercise ...
git checkout lesson/<module>-<NN>-solution   # the expected state after
```

Each checkout is a normal, self-contained state of this repo — always run `npm ci` again
after switching tags, since `package-lock.json` can differ between them.

A lesson's frontmatter (`content/<lang>/<level>/<module>/NN-*.mdx` in `claude-code-training`,
schema in `src/content/schema.ts`) carries `lab.repo_tag`, the exact `-start` tag to check
out - e.g. `repo_tag: 'lesson/m02-02-start'` - which the `<Lab>` component renders as
`git checkout {repoTag}` (`src/components/mdx/Lab.astro`, `src/components/mdx/lab.ts`). The
matching `-solution` tag is the same stem with `-solution` in place of `-start`; a lesson
with no hands-on lab, or one not yet tagged, uses `repo_tag: 'none'` (see the M0 sample
lesson, `m01-start/01-what-claude-code-is`).

## Lesson tag map (M1: L1 beginner + L2 intermediate)

Every `Lab`-tagged lesson in `docs/CURRICULUM.md` §2 for modules m01–m09. "Change" says what
actually differs between the `-start` and `-solution` commit for that tag — a `BUGS.md`
entry for the bug-fix ones, a short description for the rest.

| Lesson                          | Tag prefix      | Change                                                                                     |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| m01-02-install                  | `lesson/m01-02` | Process-only — installing Claude Code itself; both tags point at the stable `main` tip.    |
| m01-04-first-session            | `lesson/m01-04` | **BUGS.md B4** — missing input validation in `addTask`.                                    |
| m02-02-tools-read-edit-run      | `lesson/m02-02` | **BUGS.md B1** — off-by-one pagination.                                                    |
| m02-03-permissions              | `lesson/m02-03` | Process-only — permission-mode demo; both tags point at the stable `main` tip.             |
| m02-04-plan-mode                | `lesson/m02-04` | **BUGS.md B5** — a flaky, real-timer-dependent test.                                       |
| m02-05-checkpoints-rewind       | `lesson/m02-05` | **BUGS.md B2** — date comparison in the wrong unit (ms vs. s).                             |
| m03-01-claude-md                | `lesson/m03-01` | Adds this repo's own `.claude/CLAUDE.md`.                                                  |
| m03-03-rules                    | `lesson/m03-03` | Adds `.claude/rules/style.md`.                                                             |
| m04-02-cli-flags                | `lesson/m04-02` | Process-only — `claude` CLI flags; both tags point at the stable `main` tip.               |
| m04-03-sessions                 | `lesson/m04-03` | Process-only — `/resume`/`/branch`; both tags point at the stable `main` tip.              |
| m05-02-choosing-a-model         | `lesson/m05-02` | **BUGS.md B3** — unhandled promise rejection (reused as the cross-model task).             |
| m05-04-effort-lab               | `lesson/m05-04` | **BUGS.md B2** — reused as the cross-effort-level task.                                    |
| m06-03-arguments                | `lesson/m06-03` | Adds `.claude/skills/commit-msg/` (prompt-only, `$ARGUMENTS`).                             |
| m06-04-prompt-only-skills       | `lesson/m06-04` | Adds `.claude/skills/review-security/` (prompt-only checklist).                            |
| m06-05-tool-running-skills      | `lesson/m06-05` | Adds `.claude/skills/new-component/` (tool-running, `allowed-tools`, `context: fork`).     |
| m07-02-block-dangerous-commands | `lesson/m07-02` | Adds `.claude/hooks/guard-dangerous-commands.mjs` (PreToolUse).                            |
| m07-03-format-on-save           | `lesson/m07-03` | Adds `.claude/hooks/format-on-save.mjs` (PostToolUse).                                     |
| m07-04-notify-when-done         | `lesson/m07-04` | Adds `.claude/hooks/notify-done.mjs` (Notification/Stop).                                  |
| m07-05-session-start-context    | `lesson/m07-05` | Adds `.claude/hooks/session-context.mjs` (SessionStart + Stop).                            |
| m08-01-commits-and-conventions  | `lesson/m08-01` | Process-only — practising a conventional commit; both tags point at the stable `main` tip. |
| m08-02-worktrees-branches       | `lesson/m08-02` | Process-only — worktrees/branches; both tags point at the stable `main` tip.               |
| m08-03-pull-requests            | `lesson/m08-03` | Process-only — opening a PR with evidence; both tags point at the stable `main` tip.       |
| m08-04-code-review-commands     | `lesson/m08-04` | **BUGS.md B1** — reused: review the pagination fix as a PR diff.                           |

"Process-only" tags intentionally point `-start` and `-solution` at the same commit (the
stable `main` tip once every structural addition above is in place): those lessons are
about Claude Code's own CLI/UI behaviour, not a code change in this repo, so there is
nothing to diff.

L3 (`m10`–`m15`) and L4 (`m16`–`m21`) hands-on lessons are **not yet tagged** — that is a
deliberate, documented scope limit of this plan (P22 shipped only the M1 tag set), tracked
as a follow-up in `claude-code-training`'s plan Handoff notes, not a gap in this file. Two
structural surfaces for the future `m14-security` module already exist in `src/api/server.ts`
(marked `TEACHING SURFACE` in comments) and are catalogued as B6/B7 in `BUGS.md`, reserved
for whichever plan tags L3.

## Transcripts

Lesson writers: capture the real session you ran against a `-start`/`-solution` pair (per
`docs/CURRICULUM.md` §4.3 in `claude-code-training` — every lab must actually be run, never
reconstructed) and store the trimmed transcript under
`claude-code-training`'s `content/_shared/transcripts/<module>/<slug>/`, not in this repo.

## License

MIT — see `LICENSE`. Copyright (c) 2026 CodeChup.
