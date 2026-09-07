# BUGS.md — the seeded bugs

Every bug below is real: it has a failing test at its lesson's `-start` tag, and the same
test passes at the `-solution` tag. `main` (the default branch) is the clean baseline —
every bug listed here is already fixed there. Checking out a `-start` tag intentionally
re-introduces exactly one of them.

`git checkout lesson/<module>-<NN>-start && npm ci && npm test` reproduces the bug.
`git checkout lesson/<module>-<NN>-solution && npm ci && npm test` shows it fixed.

## B1 — Off-by-one in pagination

**Where:** `paginate()` in `src/store.ts`, used by both `labtrack list` and `GET /tasks`.
**Bug:** page indexing starts the slice at `page * pageSize` instead of
`(page - 1) * pageSize`, so page 1 skips the first `pageSize` items.
**Reproduce:** `npm test` — `test/store.test.ts › paginate › page 1 returns the first page, not the second` fails, returning items 3–4 instead of 1–2.
**Fix:** `const start = (page - 1) * pageSize;`
**Used by:** `lesson/m02-02-start`/`-solution` (primary — Read/Edit/Glob/Grep to find and fix it), reused by `lesson/m08-04-start`/`-solution` (reviewing the fix as a PR diff).

## B2 — Date comparison in the wrong unit (ms vs. s)

**Where:** `isOverdue()` in `src/store.ts`.
**Bug:** compares `Date.parse(dueDate)` (milliseconds) against `now() / 1000` (seconds), so a
task due in the past is essentially never reported overdue.
**Reproduce:** `test/overdue.test.ts › isOverdue › a task due yesterday is overdue` fails.
**Fix:** compare both sides in milliseconds: `Date.parse(dueDate) < now()`.
**Used by:** `lesson/m02-05-start`/`-solution` (primary), reused by `lesson/m05-04-start`/`-solution` (same fix, compared across effort levels).

## B3 — Unhandled promise rejection

**Where:** `runAdd()` in `src/cli.ts`, which calls `saveToDisk()` after adding a task.
**Bug:** the save call is fired without `await` or a `.catch` — a disk-write failure becomes
an unobserved rejection instead of an error the caller can handle.
**Reproduce:** `test/persist.test.ts` — a mocked failing save produces an unhandled rejection
(caught by the test's own listener) instead of a thrown `Error`.
**Fix:** `await` the save inside a `try/catch` and rethrow a descriptive `Error`.
**Used by:** `lesson/m05-02-start`/`-solution` (comparing how three models diagnose and fix the same async bug).

## B4 — Missing input validation

**Where:** `addTask()` in `src/store.ts`.
**Bug:** an empty (or whitespace-only) title and a negative priority are both accepted
silently instead of being rejected.
**Reproduce:** `test/store.test.ts › addTask validation` — both rejection tests fail because
no error is thrown.
**Fix:** trim and check the title, check `priority >= 0`, throw `InvalidTaskError` otherwise.
**Used by:** `lesson/m01-04-start`/`-solution` (the first hands-on "ask, read, edit, run tests" lesson).

## B5 — A timing-dependent test (the "flaky test" lesson)

**Where:** the "becomes overdue" test in `test/overdue.test.ts`.
**Bug:** the test asserts on `isOverdue()` around real `setTimeout` sleeps instead of
controlling the clock. As written it fails deterministically (a task due in 200ms is
correctly _not yet_ overdue after only ~40ms of real sleeping, but the test asserts it
is) — real timer scheduling never gives a test the precision to assert against a fixed
elapsed-time budget, so this class of test is inherently unreliable: tune the margins
tighter and the same mistake becomes genuinely intermittent (flaky) instead of reliably
wrong. Either way, a test must never depend on real time passing.
**Reproduce:** at the `-start` tag, `npm test` fails this one assertion every run (verified
3/3 runs while authoring this repo).
**Fix:** give `isOverdue()` an injectable clock (`now: () => number = Date.now`), and drive
the test with `vi.useFakeTimers()` / `vi.setSystemTime()` — no real time elapses, so the
result is deterministic on every run.
**Used by:** `lesson/m02-04-start`/`-solution` (plan mode: plan the fix before making it).

## B6 — Prompt-injection-shaped surface

**Where:** `renderNote()` / `POST /tasks/:id/render-note` in `src/api/server.ts`.
**Bug:** splices unsanitised user input directly into a templated string. No LLM is called
here, but the shape of the mistake — untrusted text trusted as part of an
instruction/template — is the one the `m14-02-prompt-injection` lesson finds and fixes: a
role-marker-shaped line in the note (`SYSTEM: ...`) survives as a literal new line in the
rendered output.
**Reproduce:** `test/security.test.ts › POST /tasks/:id/render-note — prompt-injection-shaped input (B6)` fails at the `-start` tag.
**Fix:** `sanitizeNote()` collapses line breaks before the note reaches the template, so
injected text can never open a new "line" that looks like a fresh instruction/role marker.
**Used by:** `lesson/m14-02-start`/`-solution`.

## B7 — Secrets-in-logs surface

**Where:** `getApiToken()` in `src/api/server.ts`.
**Bug:** logs the API token to stdout on startup. The token is a placeholder value, never a
real credential, but the anti-pattern is real: this is what `m14-03-secrets` has a reader
find and remove.
**Reproduce:** `test/security.test.ts › getApiToken — no secret in logs (B7)` fails at the
`-start` tag.
**Fix:** log that a token is configured without printing its value.
**Used by:** `lesson/m14-03-start`/`-solution`. This lesson also adds `.gitleaks.toml`.

---

## Non-bug lesson tags

Not every hands-on lesson is about a code bug — several are about a repo state (a skill, a
hook, a memory file, an agent, a plugin) being added, or about Claude Code's own CLI/UI
behaviour rather than this repo's code. Those are listed in full in `README.md`'s "Lesson
tag map" tables, not here.

Several L3/L4 (`m10`–`m21`) lessons are specifically **process-only** — no lab makes sense
against this repo's code, so `-start` and `-solution` point at the same commit: the two
`m15-platforms` lessons this repo tags (`lesson/m15-01-vs-code`, about the VS Code
extension, and `lesson/m15-06-chrome`, about Claude in Chrome) both use the repo as-is,
same as `m11-03/04/05` (external MCP servers), `m12-02` (marketplaces), `m13-03/05/06`
(issue-to-PR, the Agent SDK in TypeScript/Python), `m10-05` (fork/background agents,
worktrees) and `m19-03` (Chrome automation). See `README.md`'s L3/L4 table for exactly
which commit each of those pairs points at.
