---
paths:
  - "src/**"
---

# Style rules for src/

- Prefer named exports; no default exports.
- Keep the CLI (`src/cli.ts`) and the API (`src/api/server.ts`) thin: business logic
  belongs in `src/store.ts`, not in either wrapper.
- New behaviour in `src/store.ts` gets a matching test in `test/`.
- Relative imports use an explicit `.ts` extension (this project runs TypeScript
  directly on Node 24 — no build step).
