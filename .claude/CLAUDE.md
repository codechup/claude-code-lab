# CLAUDE.md — claude-code-lab

This is the hands-on lab repository for the **CodeChup Claude Code Academy**
(cc.codechup.com). It is a tiny TypeScript task-tracker CLI (`labtrack`) plus a matching
HTTP API, intentionally seeded with a handful of small, real bugs — see `BUGS.md`.

This `.claude/` is deliberately minimal: just enough to make "run Claude Code against a
real small project" realistic for lessons that use this repo as a demo target. It is not
this project's own dogfooded setup (see `claude-code-training`'s `.claude/` for that).

## Commands

```bash
npm ci               # install
npm test             # vitest
npm run typecheck    # tsc --noEmit
npm run lint         # eslint + prettier --check
npm run format       # prettier --write
```

## Conventions

- Core logic lives in `src/store.ts`. The CLI (`src/cli.ts`) and the API
  (`src/api/server.ts`) are thin wrappers around it — fix a bug at the source, not in
  both wrappers.
- Every bug in `BUGS.md` ships with a failing test at its `-start` tag and a passing one
  at its `-solution` tag. Don't "fix" a bug by loosening or deleting its test.
- `getApiToken()` in `src/api/server.ts` is marked `TEACHING SURFACE` and is intentionally
  left as-is for `m14-03-secrets` — do not "clean it up" without updating `BUGS.md` and its
  tag pair. `renderNote()`'s equivalent surface is already fixed (`BUGS.md` B6,
  `lesson/m14-02-*`).
