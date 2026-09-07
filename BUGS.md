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

## B5 — A flaky test (real-timer-dependent)

**Where:** the "becomes overdue" test in `test/overdue.test.ts`.
**Bug:** the test asserts on `isOverdue()` around real `setTimeout` sleeps instead of
controlling time — it is timing-dependent and can pass or fail depending on machine speed
and scheduler load, independent of whether the code under test is correct.
**Reproduce:** at the `-start` tag the test uses real sleeps; run it repeatedly (or under
load) to see it flake.
**Fix:** give `isOverdue()` an injectable clock (`now: () => number = Date.now`), and drive
the test with `vi.useFakeTimers()` / `vi.setSystemTime()` — no real time elapses, so the
result is deterministic on every run.
**Used by:** `lesson/m02-04-start`/`-solution` (plan mode: plan the fix before making it).

## B6 — Prompt-injection-shaped surface (reserved, not yet tagged)

**Where:** `renderNote()` / `POST /tasks/:id/render-note` in `src/api/server.ts`.
**What:** splices unsanitised user input directly into a templated string. No LLM is called
here, but the shape of the mistake — untrusted text trusted as part of an instruction/template
— is the one the security module (`m14-02-prompt-injection`) will use. Left in place on
`main` deliberately; do not "fix" it without updating this file and adding that lesson's tags
(tracked as a follow-up, see the plan's Handoff notes — `m14` is out of this plan's M1 scope).

## B7 — Secrets-in-logs surface (reserved, not yet tagged)

**Where:** `getApiToken()` in `src/api/server.ts`.
**What:** logs the API token to stdout on startup. The token is a placeholder value, never a
real credential, but the anti-pattern is real: this is what `m14-03-secrets` will have a
reader find and remove. Left in place on `main` deliberately for the same reason as B6.

---

## Non-bug lesson tags

Not every hands-on lesson is about a code bug — several are about a repo state (a skill, a
hook, a memory file) being added, or about Claude Code's own CLI/UI behaviour rather than
this repo's code. Those are listed in `README.md`'s "Lesson tag map" table, not here.
