<div align="center">

# claude-code-lab

**The repository you check out at a tag while a lesson is open.**

A small TypeScript CLI and HTTP service, seeded with real bugs and tagged once per hands-on
exercise, so every lab in the Claude Code Academy starts from exactly the state its lesson
describes.

[![Course](https://img.shields.io/badge/course-cc.codechup.com-B75434?style=for-the-badge&labelColor=17130F)](https://cc.codechup.com)
[![Tags](https://img.shields.io/badge/lesson%20tags-98-2F6585?style=for-the-badge&labelColor=17130F)](https://github.com/codechup/claude-code-lab/tags)
[![Licence](https://img.shields.io/badge/licence-MIT-2F6B4A?style=for-the-badge&labelColor=17130F)](LICENSE)

[![CI](https://github.com/codechup/claude-code-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/codechup/claude-code-lab/actions/workflows/ci.yml)
[![Claude review](https://github.com/codechup/claude-code-lab/actions/workflows/claude-review.yml/badge.svg)](https://github.com/codechup/claude-code-lab/actions/workflows/claude-review.yml)

**English** · [Türkçe](README.tr.md)

</div>

---

## What this is

This repository is not meant to be read top to bottom. It is meant to be checked out at a tag.

Every hands-on lesson in the [CodeChup Claude Code Academy](https://cc.codechup.com) names a
pair of tags — `-start` for the state before the exercise and `-solution` for the state after —
and the lesson's instructions only make sense against that exact tree. So the interesting
artefact here is not the code but the 98 tags pinned to it.

The code itself is `labtrack`: a task tracker written as a Node 24 TypeScript CLI (`commander`)
plus a matching HTTP API (`node:http`), both thin wrappers around one store module. It carries a
handful of small, genuinely reproducible bugs, each documented in [`BUGS.md`](BUGS.md) with how
to trigger it and which tag pair contains it. `main` is the clean baseline: every seeded bug
fixed, every example skill and hook in place, `npm test` green.

## Quick start

```bash
git clone https://github.com/codechup/claude-code-lab.git
cd claude-code-lab
npm ci

npm test          # vitest — all green on main
npm run typecheck # tsc --noEmit
npm run lint      # eslint + prettier --check

npm start -- add "buy milk" --priority 1   # the CLI
npm run api                                 # the HTTP API on :3000
```

Then, when a lesson tells you to:

```bash
git checkout lesson/m02-02-start   # the state before the exercise
# ... do the exercise ...
git checkout lesson/m02-02-solution
```

Each checkout is a normal, self-contained state of this repository. Run `npm ci` again after
switching tags — `package-lock.json` can differ between them.

## The tag contract

**The 98 tags in this repository are content, not history.** Each one is cited by name from the
119 lessons of the course, rendered into the page a reader is following. Moving a tag to another
commit silently changes what that reader checks out; deleting one turns a lesson's first command
into an error.

So:

- **Tags are never moved and never deleted.** Not to tidy history, not to re-point a pair, not
  as part of a rebase.
- **A tag ruleset on the remote enforces this.** The `lesson-tags` ruleset blocks updates and
  deletions to `lesson/*` on GitHub, so a force-push of a tag fails rather than quietly landing.
- **New work goes on `main`,** which the course's supporting material is added to directly, with
  no new tag pair unless a new hands-on lesson needs one.

If a tag genuinely must change — the `-start` state is broken, or a lesson was rewritten around a
different exercise — the procedure is:

1. Open an issue in this repository naming the tag, what is wrong with it, and every lesson slug
   that cites it.
2. Open the matching pull request in
   [`codechup/claude-code-training`](https://github.com/codechup/claude-code-training) updating
   those lessons' `lab.repo_tag` and their prose.
3. Prefer **adding** a new tag (a suffixed pair) and re-pointing the lessons at it over rewriting
   an existing one. Only when that is impossible does the ruleset get lifted, the tag moved, and
   the ruleset restored — in that order, in one sitting.

## How a lesson names its tag

A lesson's frontmatter (`content/<lang>/<level>/<module>/NN-*.mdx` in `claude-code-training`,
schema in `src/content/schema.ts`) carries `lab.repo_tag`, the exact `-start` tag to check out —
e.g. `repo_tag: 'lesson/m02-02-start'` — which the `<Lab>` component renders as
`git checkout {repoTag}` (`src/components/mdx/Lab.astro`, `src/components/mdx/lab.ts`). The
matching `-solution` tag is the same stem with `-solution` in place of `-start`. A lesson with no
hands-on lab, or one not yet tagged, uses `repo_tag: 'none'` (see the M0 sample lesson,
`m01-start/01-what-claude-code-is`).

## Lesson tag map

49 lesson pairs, 98 tags, covering every `Lab`-tagged lesson in `docs/CURRICULUM.md` §2. The
"Change" column says what actually differs between a pair's `-start` and `-solution` commit — a
`BUGS.md` entry for the bug-fix ones, a short description for the rest.

"Process-only" pairs point `-start` and `-solution` at the same commit on purpose: those lessons
are about Claude Code's own CLI or UI behaviour, not a code change here, so there is nothing to
diff. In modules m01–m09 that commit is the stable `main` tip once every structural addition in
the table is in place. From m10 onward it is instead whichever commit was the tip _at that
lesson's position in the sequence_ — each module was tagged in curriculum order, building on the
one before — so `lesson/m11-03-*` points at the commit right after `lesson/m11-02-solution`
landed, not at the final tip of the table.

### Level 1 · Beginner and Level 2 · Intermediate (m01–m09)

| Lesson                          | Tag prefix      | Change                                                                |
| ------------------------------- | --------------- | --------------------------------------------------------------------- |
| m01-02-install                  | `lesson/m01-02` | Process-only — installing Claude Code itself.                         |
| m01-04-first-session            | `lesson/m01-04` | **B4** — missing input validation in `addTask`.                       |
| m02-02-tools-read-edit-run      | `lesson/m02-02` | **B1** — off-by-one pagination.                                       |
| m02-03-permissions              | `lesson/m02-03` | Process-only — permission-mode demo.                                  |
| m02-04-plan-mode                | `lesson/m02-04` | **B5** — a flaky, real-timer-dependent test.                          |
| m02-05-checkpoints-rewind       | `lesson/m02-05` | **B2** — date comparison in the wrong unit (ms vs. s).                |
| m03-01-claude-md                | `lesson/m03-01` | Adds this repo's own `.claude/CLAUDE.md`.                             |
| m03-03-rules                    | `lesson/m03-03` | Adds `.claude/rules/style.md`.                                        |
| m04-02-cli-flags                | `lesson/m04-02` | Process-only — `claude` CLI flags.                                    |
| m04-03-sessions                 | `lesson/m04-03` | Process-only — `/resume` and `/branch`.                               |
| m05-02-choosing-a-model         | `lesson/m05-02` | **B3** — unhandled promise rejection, as the cross-model task.        |
| m05-04-effort-lab               | `lesson/m05-04` | **B2** — reused as the cross-effort-level task.                       |
| m06-03-arguments                | `lesson/m06-03` | Adds `.claude/skills/commit-msg/` (prompt-only, `$ARGUMENTS`).        |
| m06-04-prompt-only-skills       | `lesson/m06-04` | Adds `.claude/skills/review-security/` (prompt-only checklist).       |
| m06-05-tool-running-skills      | `lesson/m06-05` | Adds `.claude/skills/new-component/` (tool-running, `context: fork`). |
| m07-02-block-dangerous-commands | `lesson/m07-02` | Adds `.claude/hooks/guard-dangerous-commands.mjs` (PreToolUse).       |
| m07-03-format-on-save           | `lesson/m07-03` | Adds `.claude/hooks/format-on-save.mjs` (PostToolUse).                |
| m07-04-notify-when-done         | `lesson/m07-04` | Adds `.claude/hooks/notify-done.mjs` (Notification/Stop).             |
| m07-05-session-start-context    | `lesson/m07-05` | Adds `.claude/hooks/session-context.mjs` (SessionStart + Stop).       |
| m08-01-commits-and-conventions  | `lesson/m08-01` | Process-only — practising a conventional commit.                      |
| m08-02-worktrees-branches       | `lesson/m08-02` | Process-only — worktrees and branches.                                |
| m08-03-pull-requests            | `lesson/m08-03` | Process-only — opening a PR with evidence.                            |
| m08-04-code-review-commands     | `lesson/m08-04` | **B1** — reused: review the pagination fix as a PR diff.              |

### Level 3 · Advanced and Level 4 · Master (m10–m21)

| Lesson                          | Tag prefix      | Change                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| m10-03-agent-lab                | `lesson/m10-03` | Adds `.claude/agents/` (code-reviewer, test-writer, docs-writer, researcher).                                                                                                                                                                                                                                          |
| m10-05-fork-background-worktree | `lesson/m10-05` | Process-only — fork and background agents, worktrees.                                                                                                                                                                                                                                                                  |
| m11-02-add-list-remove-scopes   | `lesson/m11-02` | Adds an example `.mcp.json` (github, playwright servers).                                                                                                                                                                                                                                                              |
| m11-03-github-mcp               | `lesson/m11-03` | Process-only — GitHub MCP server usage.                                                                                                                                                                                                                                                                                |
| m11-04-browser-mcp              | `lesson/m11-04` | Process-only — Playwright and Chrome MCP.                                                                                                                                                                                                                                                                              |
| m11-05-database-mcp             | `lesson/m11-05` | Process-only — SQLite and Postgres MCP.                                                                                                                                                                                                                                                                                |
| m11-06-write-your-own-server    | `lesson/m11-06` | Adds `mcp/`, a minimal MCP server (one tool, `labtrack_status`), registered in `.mcp.json`.                                                                                                                                                                                                                            |
| m12-02-marketplaces             | `lesson/m12-02` | Process-only — discovering and installing plugins.                                                                                                                                                                                                                                                                     |
| m12-03-build-a-plugin           | `lesson/m12-03` | Adds `plugins/labtrack-tools/` (the m06-03 skill + m07-03 hook, packaged). Its `-start` sits at the tip right before this commit, which by then already included m13-01 and m13-02's files below — a sequencing fix made while authoring this table; the diff to `-solution` is still exactly the plugin's five files. |
| m13-01-claude-p                 | `lesson/m13-01` | Adds `scripts/headless-example.sh`.                                                                                                                                                                                                                                                                                    |
| m13-02-github-actions-review    | `lesson/m13-02` | Adds `.github/workflows/claude-review.yml`.                                                                                                                                                                                                                                                                            |
| m13-03-issue-to-pr              | `lesson/m13-03` | Process-only — `@claude` on issues and PRs via the same workflow.                                                                                                                                                                                                                                                      |
| m13-05-agent-sdk-typescript     | `lesson/m13-05` | Process-only — external `@anthropic-ai/claude-agent-sdk` usage.                                                                                                                                                                                                                                                        |
| m13-06-agent-sdk-python         | `lesson/m13-06` | Process-only — the same, with the Python SDK.                                                                                                                                                                                                                                                                          |
| m14-02-prompt-injection         | `lesson/m14-02` | **B6** — unsanitised `renderNote()`.                                                                                                                                                                                                                                                                                   |
| m14-03-secrets                  | `lesson/m14-03` | **B7** — API token logged on startup; also adds `.gitleaks.toml`.                                                                                                                                                                                                                                                      |
| m15-01-vs-code                  | `lesson/m15-01` | Process-only — the VS Code extension.                                                                                                                                                                                                                                                                                  |
| m15-06-chrome                   | `lesson/m15-06` | Process-only — Claude in Chrome.                                                                                                                                                                                                                                                                                       |
| m16-04-pipeline-lab             | `lesson/m16-04` | Adds `WORKFLOW.md`, a review → verify → fix pipeline brief.                                                                                                                                                                                                                                                            |
| m17-01-loop                     | `lesson/m17-01` | Adds `scripts/loop-check.sh`.                                                                                                                                                                                                                                                                                          |
| m17-02-routines                 | `lesson/m17-02` | Adds `routines/nightly-regression-check.md`.                                                                                                                                                                                                                                                                           |
| m18-02-state-md-and-claims      | `lesson/m18-02` | Adds `plans/` (`P01-cli-usability.md`, `P02-api-error-docs.md`, both `todo`) and `STATE.md`.                                                                                                                                                                                                                           |
| m18-03-owned-paths-worktrees    | `lesson/m18-03` | Claims both plans — `todo` → `in_progress`, disjoint `owned_paths`, separate worktrees.                                                                                                                                                                                                                                |
| m18-05-handoff-notes            | `lesson/m18-05` | Implements both plans for real (CLI help text and `--version`, `docs/API.md`), fills their Handoff notes, moves them to `review`; adds `scripts/plan.mjs`.                                                                                                                                                             |
| m19-01-artifacts                | `lesson/m19-01` | Adds `artifacts/task-activity.csv` and its README — sample data to publish as an Artifact.                                                                                                                                                                                                                             |
| m19-03-chrome-automation        | `lesson/m19-03` | Process-only — driving this repo with Claude in Chrome.                                                                                                                                                                                                                                                                |

`BUGS.md`'s B6 and B7 are no longer reserved: both are fixed and tagged like B1–B5.

### Modules with no tags: m20-team, m21-scale

Neither module has a single lesson marked `Lab` in `docs/CURRICULUM.md` §2 — every lesson in both
is about process (settings, budgets, rollout, caching, gateways) or a strategy applied to a
codebase larger than this one, not a hands-on change to _this_ repository. Their supporting
material still lives here, added directly to `main` with no `-start`/`-solution` pair:

- **m20-team** — `.claude/settings.json`'s team allowlist and deny-list, `MARKETPLACE.md`.
- **m21-scale** — `large/`, 30 generated placeholder modules across 5 areas, for
  large-codebase-navigation and context-engineering practice.

## Repository structure

```
src/
  types.ts        Task interface, InvalidTaskError
  store.ts        all business logic (CLI and API are thin wrappers around this)
  cli.ts          labtrack CLI (commander): add, list, show, done, rm, --version
  api/server.ts   tiny HTTP API: GET/POST /tasks, GET /health, ... (docs: docs/API.md)
test/             vitest — one file per area (store, overdue, persist, api, security,
                  cli-usability)
.claude/          this repo's own minimal Claude Code setup: CLAUDE.md, one rule, 4 hooks,
                  3 skills, 4 agents (code-reviewer, test-writer, docs-writer, researcher),
                  settings.json (a small team allowlist + deny list) — teaching material,
                  not a full dogfooding setup
BUGS.md           every seeded bug: what it is, how to reproduce it, its tag pair
.mcp.json         example MCP server config: github, playwright, and this repo's own
                  labtrack server
mcp/              a minimal stdio MCP server (@modelcontextprotocol/sdk), one tool
                  (labtrack_status) — its own package.json, never touches root npm scripts
plugins/          labtrack-tools: the commit-msg skill + format-on-save hook, packaged
                  as an installable plugin
scripts/          headless-example.sh (claude -p), loop-check.sh (a /loop target),
                  plan.mjs (lists claimable plans/*.md)
routines/         an example routine description (cron-triggered, repo-side brief)
plans/, STATE.md  two example plans with the training repo's own frontmatter convention,
                  and a generated-looking STATE.md
WORKFLOW.md       a review → verify → fix pipeline brief (the Workflow tool)
artifacts/        sample data (task-activity.csv) for the Artifacts and dataviz labs
large/            30 generated placeholder modules for the large-codebase-navigation labs
                  — outside tsconfig.json's and vitest.config.ts's include globs by design
MARKETPLACE.md    what this repo has to share as a team plugin marketplace
.gitleaks.toml    this repo's secret-scanning baseline
.github/workflows/
  ci.yml            typecheck + lint + test on every push and PR
  claude-review.yml anthropics/claude-code-action@v1 PR review (a no-op without the secret)
```

## Transcripts

Lesson writers: capture the real session you ran against a `-start`/`-solution` pair — per
`docs/CURRICULUM.md` §4.3 in `claude-code-training`, every lab must actually be run, never
reconstructed — and store the trimmed transcript under that repository's
`content/_shared/transcripts/<module>/<slug>/`, not here.

## Licence

[MIT](LICENSE) — Copyright (c) 2026 CodeChup. Claude and Claude Code are trademarks of Anthropic;
this is an independent, unaffiliated course.
