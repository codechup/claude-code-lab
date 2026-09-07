# MARKETPLACE.md — sharing plugins/skills across a team

Supporting material for `m20-team` (`m20-03-team-marketplace`, `m20-05-cost-budgeting`'s
neighbour `m12-05-team-marketplace`). No `m20` lesson is tagged in this repo — every one is
about process (settings, CI gates, budgets, rollout), not a repo-state change — so this file
lives on `main` for reference rather than behind a `-start`/`-solution` pair.

## What this repo already has to share

- `plugins/labtrack-tools/` (m12-03-build-a-plugin) — the one plugin this repo ships: the
  `commit-msg` skill and the `format-on-save` hook, packaged.
- `.claude/settings.json` — this repo's own team allowlist (below): the Bash commands and
  the one MCP tool (`mcp__labtrack__labtrack_status`, from the `mcp/` server added in
  m11-06) that don't need a per-call prompt for anyone working in this repo.

## Publishing an internal marketplace

A team marketplace is a `.claude-plugin/marketplace.json` file (in its own repo, or a
directory within a monorepo) listing one or more plugin sources. For a team standardising
on `labtrack-tools`, that file would point at this repo:

```json
{
  "name": "codechup-labtrack-plugins",
  "owner": { "name": "CodeChup Claude Code Academy" },
  "plugins": [
    {
      "name": "labtrack-tools",
      "source": "github:codechup/claude-code-lab",
      "path": "plugins/labtrack-tools"
    }
  ]
}
```

A team member adds it once (`/plugin marketplace add codechup/claude-code-lab` or the
marketplace's own repo URL) and installs from it (`/plugin install labtrack-tools`) —
see `m12-02-marketplaces` for the discovery/installation flow this assumes.

## This repo's team allowlist

`.claude/settings.json`'s `permissions.allow` is deliberately narrow and read/verify-biased
(`npm test`, `npm run typecheck`, `git status`/`diff`/`log`/`show`, `gh pr view`/`diff`,
the one read-only MCP tool this repo ships) — nothing that pushes, force-resets, or deletes
without a prompt. `permissions.deny` blocks `git push --force*`, `git reset --hard*`, and
reading `.env*` outright, so even an explicit `--allow` elsewhere in a session can't
override them. Run `/fewer-permission-prompts` in a real project to generate a starting
allowlist from your own transcripts instead of hand-guessing one.
