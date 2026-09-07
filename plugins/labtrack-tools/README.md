# labtrack-tools

The m12-03-build-a-plugin lab: this repo's own m06/m07 example skill and hook, repackaged
as an installable plugin.

## Layout

```
plugins/labtrack-tools/
  .claude-plugin/plugin.json   manifest — name, description, version, author
  skills/commit-msg/SKILL.md   copy of .claude/skills/commit-msg (m06-03-arguments)
  hooks/hooks.json             registers the hook below
  hooks/format-on-save.mjs     copy of .claude/hooks/format-on-save.mjs (m07-03-format-on-save)
```

Only `plugin.json` goes under `.claude-plugin/` — every other directory (`skills/`,
`hooks/`, `agents/`, ...) lives at the plugin root, one level up.

## Try it

```bash
claude plugin validate plugins/labtrack-tools
```

To actually install it in a session, add this repo as a local marketplace source (or copy
`plugins/labtrack-tools/` into a marketplace repo) and `/plugin install labtrack-tools` —
see m12-02-marketplaces and m12-05-team-marketplace.

## Already wired?

This repo's own `.claude/settings.json` already wires the original
`.claude/hooks/format-on-save.mjs` directly (not through this plugin). Installing
`labtrack-tools` _in this same repo_ would run Prettier twice per `Write`/`Edit` — harmless,
since formatting the same file twice is a no-op, but worth noticing: a real plugin
shouldn't duplicate a hook the host project already wires without saying so. In a project
that doesn't already have this hook, installing the plugin is exactly the m07-03 lab's
outcome, delivered as a plugin instead of a hand-copied file.
