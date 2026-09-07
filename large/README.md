# large/ — a codebase big enough to get lost in

Supporting material for `m21-large-codebases` and `m21-02-context-engineering`: 30
generated placeholder modules across 5 areas (`auth`, `billing`, `notifications`, `search`,
`reporting`, 6 files each, plus one `index.ts` barrel per area). Each file's content is a
one-line placeholder — the point isn't the code, it's practicing navigation and context
management in a directory with many similarly-shaped files, which this repo's own `src/`
(4 files) is too small to teach.

This is deliberately outside the root `tsconfig.json`'s `include` (`src/**/*.ts`,
`test/**/*.ts`) and outside `vitest.config.ts`'s `include` — adding it never touches
`npm test` / `npm run typecheck` for the real project.

## What to practice here

- **Finding the right file fast** (`m21-01-large-codebases`): `large/src/billing/` and
  `large/src/reporting/` both have an `invoices`-adjacent concept
  (`billing/invoices.ts` vs. `reporting/exporters.ts`) — practice `Grep`/`Glob` instead of
  guessing a path, and `--add-dir` to scope a session to one area.
- **Context engineering** (`m21-02-context-engineering`): ask a subagent to summarize one
  area (e.g. "what does everything in `large/src/notifications/` do") instead of reading all 6
  files into the main session's context — compare context usage against reading them
  directly.
- **Per-area rules**: a real large repo often has one `.claude/rules/<area>.md` per
  directory like these. This repo doesn't add one (out of scope for a teaching fixture),
  but `m21-01-large-codebases` is exactly where a reader would practice writing one, e.g. a
  rule for `large/src/billing/` about never rounding currency in floating point.
