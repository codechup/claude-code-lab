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
npm run hygiene   # public-repo hygiene scan (this repo is public)

sh scripts/install-hooks.sh   # once per clone: pre-commit/pre-push guards (see "Tag contract")

npm start -- add "buy milk" --priority 1     # try the CLI
npm run api                                   # try the HTTP API on :3000
```

## Structure

```
src/
  types.ts        Task interface, InvalidTaskError
  store.ts        all business logic (CLI and API are thin wrappers around this)
  cli.ts          labtrack CLI (commander): add, list, show, done, rm, --version
  api/server.ts   tiny HTTP API: GET/POST /tasks, GET /health, ... (docs: docs/API.md)
test/             vitest — one file per area (store, overdue, persist, api, security,
                  cli-usability)
.claude/          this repo's own minimal Claude Code setup: CLAUDE.md, 2 rules, 4 hooks,
                  3 skills, 4 agents (code-reviewer, test-writer, docs-writer, researcher),
                  settings.json (a small team allowlist + deny list) — teaching material,
                  not a full dogfooding setup
BUGS.md           every seeded bug: what it is, how to reproduce it, its tag pair
.mcp.json         example MCP server config: github, playwright, and this repo's own
                  labtrack server (below)
mcp/              a minimal stdio MCP server (@modelcontextprotocol/sdk), one tool
                  (labtrack_status) — its own package.json, never touches root npm scripts
plugins/          labtrack-tools: the commit-msg skill + format-on-save hook, packaged
                  as an installable plugin
scripts/          headless-example.sh (claude -p), loop-check.sh (a /loop target),
                  plan.mjs (lists claimable plans/*.md),
                  check-public-hygiene.mjs (public-repo scan), install-hooks.sh,
                  git-hooks/ (pre-commit hygiene, pre-push hygiene + lesson-tag guard)
routines/         an example routine description (cron-triggered, repo-side brief)
plans/, STATE.md  two example plans with the training repo's own frontmatter convention,
                  and a generated-looking STATE.md
WORKFLOW.md       a review → verify → fix pipeline brief (the Workflow tool)
artifacts/        sample data (task-activity.csv) for the Artifacts/dataviz labs
large/            30 generated placeholder modules for the large-codebase-navigation labs
                  — outside tsconfig.json's/vitest.config.ts's include globs by design
MARKETPLACE.md    what this repo has to share as a team plugin marketplace
.gitleaks.toml    this repo's secret-scanning baseline
.github/workflows/
  ci.yml            typecheck + lint + test, public-repo hygiene, and the lesson-tag
                    contract check, on every push/PR
  claude-review.yml anthropics/claude-code-action@v1 PR review (no-op without the secret;
                    `pull_request` only — never `pull_request_target`, see the file)
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

## Lesson tag map

Two tables: M1 (L1 Beginner + L2 Intermediate, modules m01–m09, tagged first) below, then
L3 Advanced + L4 Master (modules m10–m21) further down. Together they cover every
`Lab`-tagged lesson in `docs/CURRICULUM.md` §2 through m21 — see "Modules with no tags"
after the second table for the two modules (m20, m21) that have no `Lab`-tagged lesson at
all. "Change" says what actually differs between the `-start` and `-solution` commit for
that tag — a `BUGS.md` entry for the bug-fix ones, a short description for the rest.

### M1 — L1 Beginner + L2 Intermediate (m01–m09)

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

### L3 Advanced + L4 Master (m10–m21)

Every `Lab`-tagged lesson in `docs/CURRICULUM.md` §2 for modules m10–m21 — 26 lesson pairs,
52 tags. Unlike the M1 table above, a "process-only" pair here points `-start`/`-solution`
at whichever commit was the tip _at that lesson's position in the sequence_ (each module
was tagged in curriculum order, building on the one before), not one single stable `main`
tip — e.g. `lesson/m11-03-*` points at the commit right after `lesson/m11-02-solution`
landed, not at the final tip of this whole table.

| Lesson                          | Tag prefix      | Change                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| m10-03-agent-lab                | `lesson/m10-03` | Adds `.claude/agents/` (code-reviewer, test-writer, docs-writer, researcher).                                                                                                                                                                                                                                               |
| m10-05-fork-background-worktree | `lesson/m10-05` | Process-only — fork/background agents, worktrees; both tags point at the m10-03 solution tip.                                                                                                                                                                                                                               |
| m11-02-add-list-remove-scopes   | `lesson/m11-02` | Adds an example `.mcp.json` (github, playwright servers).                                                                                                                                                                                                                                                                   |
| m11-03-github-mcp               | `lesson/m11-03` | Process-only — GitHub MCP server usage; both tags point at the m11-02 solution tip.                                                                                                                                                                                                                                         |
| m11-04-browser-mcp              | `lesson/m11-04` | Process-only — Playwright/Chrome MCP; both tags point at the m11-02 solution tip.                                                                                                                                                                                                                                           |
| m11-05-database-mcp             | `lesson/m11-05` | Process-only — SQLite/Postgres MCP; both tags point at the m11-02 solution tip.                                                                                                                                                                                                                                             |
| m11-06-write-your-own-server    | `lesson/m11-06` | Adds `mcp/`, a minimal TypeScript MCP server (one tool, `labtrack_status`); registers it in `.mcp.json`.                                                                                                                                                                                                                    |
| m12-02-marketplaces             | `lesson/m12-02` | Process-only — discovering/installing plugins; both tags point at the m11-06 solution tip.                                                                                                                                                                                                                                  |
| m12-03-build-a-plugin           | `lesson/m12-03` | Adds `plugins/labtrack-tools/` (the m06-03 skill + m07-03 hook, packaged). **Note:** `-start` was moved to the tip right before this commit, which by then already included m13-01/m13-02's files below (a sequencing fix made while authoring this table) — the diff to `-solution` is still exactly the plugin's 5 files. |
| m13-01-claude-p                 | `lesson/m13-01` | Adds `scripts/headless-example.sh`.                                                                                                                                                                                                                                                                                         |
| m13-02-github-actions-review    | `lesson/m13-02` | Adds `.github/workflows/claude-review.yml`.                                                                                                                                                                                                                                                                                 |
| m13-03-issue-to-pr              | `lesson/m13-03` | Process-only — `@claude` on issues/PRs via the same workflow; both tags point at the m13-02 solution tip.                                                                                                                                                                                                                   |
| m13-05-agent-sdk-typescript     | `lesson/m13-05` | Process-only — external `@anthropic-ai/claude-agent-sdk` usage; both tags point at the m13-02 solution tip.                                                                                                                                                                                                                 |
| m13-06-agent-sdk-python         | `lesson/m13-06` | Process-only — same, Python SDK; both tags point at the m13-02 solution tip.                                                                                                                                                                                                                                                |
| m14-02-prompt-injection         | `lesson/m14-02` | **BUGS.md B6** — unsanitised `renderNote()`.                                                                                                                                                                                                                                                                                |
| m14-03-secrets                  | `lesson/m14-03` | **BUGS.md B7** — API token logged on startup; also adds `.gitleaks.toml`.                                                                                                                                                                                                                                                   |
| m15-01-vs-code                  | `lesson/m15-01` | Process-only — VS Code extension; both tags point at the m14-03 solution tip.                                                                                                                                                                                                                                               |
| m15-06-chrome                   | `lesson/m15-06` | Process-only — Claude in Chrome; both tags point at the m14-03 solution tip.                                                                                                                                                                                                                                                |
| m16-04-pipeline-lab             | `lesson/m16-04` | Adds `WORKFLOW.md` (a review → verify → fix pipeline brief).                                                                                                                                                                                                                                                                |
| m17-01-loop                     | `lesson/m17-01` | Adds `scripts/loop-check.sh`.                                                                                                                                                                                                                                                                                               |
| m17-02-routines                 | `lesson/m17-02` | Adds `routines/nightly-regression-check.md`.                                                                                                                                                                                                                                                                                |
| m18-02-state-md-and-claims      | `lesson/m18-02` | Adds `plans/` (`P01-cli-usability.md`, `P02-api-error-docs.md`, both `todo`) and `STATE.md`.                                                                                                                                                                                                                                |
| m18-03-owned-paths-worktrees    | `lesson/m18-03` | Claims both plans (`todo` → `in_progress`, disjoint `owned_paths`, separate worktrees/branches).                                                                                                                                                                                                                            |
| m18-05-handoff-notes            | `lesson/m18-05` | Implements both plans for real (CLI help text/`--version`, `docs/API.md`), fills their Handoff notes, moves them to `review`; adds `scripts/plan.mjs`.                                                                                                                                                                      |
| m19-01-artifacts                | `lesson/m19-01` | Adds `artifacts/task-activity.csv` (+ README) — sample data to publish as an Artifact.                                                                                                                                                                                                                                      |
| m19-03-chrome-automation        | `lesson/m19-03` | Process-only — driving this repo with Claude in Chrome; both tags point at the m19-01 solution tip.                                                                                                                                                                                                                         |

`BUGS.md`'s B6 and B7 are no longer "reserved" — both are fixed and tagged like B1–B5.

### Modules with no tags: m20-team, m21-scale

Neither module has a single lesson marked `Lab` in `docs/CURRICULUM.md` §2 — every lesson in
both is about process (settings, budgets, rollout, caching, gateways) or a strategy applied
to a codebase bigger than this one, not a hands-on change to _this_ repo. Their supporting
material still lives here, added directly to `main` with no `-start`/`-solution` pair:

- **m20-team:** `.claude/settings.json`'s team allowlist/deny-list, `MARKETPLACE.md`.
- **m21-scale:** `large/` (30 generated placeholder modules across 5 areas, for
  large-codebase-navigation and context-engineering practice).

## Tag contract

**The 98 `lesson/mNN-KK-start` / `lesson/mNN-KK-solution` tags are content, not history.** Each is
cited _by name_ from a lesson's frontmatter (`lab.repo_tag`) in `codechup/claude-code-training`,
rendered into the page a reader copies, and quoted in that lesson's captured transcript. 49 pairs,
one per `Lab`-tagged lesson.

Therefore:

- **A lesson tag is never deleted, never renamed, and never moved to a different commit.** Moving
  one silently changes what a reader gets from a `git checkout` that a published lesson told them
  to run — the lesson still "works", it just no longer matches. That is worse than a broken link.
- **Never force-push or rewrite the history a tag points into**, and never rewrite author identity
  across the repo: both detach or move every tag downstream of the rewrite.
- New lessons **add** pairs; they never repurpose an existing prefix.

Enforced by the `pre-push` hook (`sh scripts/install-hooks.sh`), which refuses a push that deletes
or moves a `refs/tags/lesson/*` ref, and by the `tags` job in `.github/workflows/ci.yml`, which
fails if the count drops below 49 pairs or a `-start` loses its `-solution`.

### If a tag genuinely must change

Only when the tagged state is _wrong_ — it does not build, or it teaches something now false.

1. Open an issue/PR in `claude-code-training` first, naming every lesson whose `lab.repo_tag`
   points at the pair (`git grep -n "lesson/m07-03" content/`). The lesson change and the tag
   change ship together, or readers see a mismatch in between.
2. Prefer **adding a new pair** (`lesson/m07-03b-start` / `-solution`) and repointing the lesson
   over moving the old one. The old tag stays valid for anyone mid-lesson or reading a cached page.
3. If the pair really must move, do it as one deliberate, announced operation:
   `LAB_ALLOW_TAG_REWRITE=1 git push --force origin lesson/m07-03-start` — then update this
   README's tag map row, and re-run the lesson's lab and re-capture its transcript. A transcript
   that no longer matches its tag is a fabricated transcript.
4. Record what moved and why in the PR description. `git tag -l 'lesson/*' | wc -l` must still
   print `98` afterwards.

## Public-repository hygiene

This repo is public and permanent. Before you push:

```bash
sh scripts/install-hooks.sh                                  # once per clone: pre-commit + pre-push
                                                            # guards, and a commit-identity check
npm run hygiene                                             # scan tracked files
node scripts/check-public-hygiene.mjs --commits origin/main..HEAD   # the commits you would publish
node scripts/check-public-hygiene.mjs --identity            # this clone's git identity
gitleaks detect --config .gitleaks.toml                     # the m14-03 lab's scanner
```

No hosting IPs or hostnames, no absolute host paths, no local user-profile paths, no personal
email address as a commit author, no `Claude-Session:` trailer, no secret values — see
`.claude/rules/public-hygiene.md` for the full rule and for `HYGIENE_EXTRA_PATTERNS` /
`.hygiene.local.json`, the out-of-band way to add private match patterns without spelling them out
in this repo. `--commits` takes an explicit range and checks author, committer and trailer
identities against a positive allowlist, masking anything it rejects. The `hygiene` job in
`.github/workflows/ci.yml` runs the same checks on every push and pull request.

`scripts/check-public-hygiene.mjs` is the sibling of the same file in
`codechup/claude-code-training` and carries the same rule set, CLI contract and commit-metadata
policy; the two lab-only differences are marked `LAB-ONLY` in the source. Note the known gap the
rule file records: commits made before the check existed do not pass it, and the guards therefore
scan only what a push adds.

## Transcripts

Lesson writers: capture the real session you ran against a `-start`/`-solution` pair (per
`docs/CURRICULUM.md` §4.3 in `claude-code-training` — every lab must actually be run, never
reconstructed) and store the trimmed transcript under
`claude-code-training`'s `content/_shared/transcripts/<module>/<slug>/`, not in this repo.

## License

MIT — see `LICENSE`. Copyright (c) 2026 CodeChup.
