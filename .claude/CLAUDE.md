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
- This repo is **public** and its 98 `lesson/*` tags are cited by name from published lessons:
  never delete or move a lesson tag, and never commit a private hostname, path, or a personal
  email as the commit author, and never a `Claude-Session:` trailer in a commit message. See
  `.claude/rules/public-hygiene.md` and README.md "Tag contract"; `npm run hygiene`,
  `node scripts/check-public-hygiene.mjs --commits origin/main..HEAD` and `--identity` are the
  checks.
- Never log a secret's value, even a placeholder one (`BUGS.md` B7) — log that it's
  configured, and where it came from, not what it is. `.gitleaks.toml` documents this
  repo's secret-scanning baseline (`gitleaks detect --config .gitleaks.toml`) — a scanner is
  a backstop for that habit, not a substitute for it.
