# Public-repository hygiene (applies to every file in this repo)

This repository is **public**, and it is course material: 119 lessons on cc.codechup.com send
readers here and check out its tags. Nothing that identifies or grants access to private
infrastructure may be committed — not in code, docs, workflows, comments, tests or fixtures, and
not in a commit message or an author identity either.

**Never write into this repo:**

- Hosting IP addresses, hostnames of other projects, absolute host paths (e.g. anything under
  `/opt/...`), local user-profile paths (`C:\Users\<name>\...`, `/home/<name>/...`), SSH usernames
  tied to a host, firewall or DNS details.
- Names of private sibling projects or their infrastructure.
- Secrets or their values: API keys, tokens, private keys, certificates, `.env*` files,
  `authorized_keys` blobs. `dev-placeholder-token` (see `BUGS.md` B7) is a documented placeholder,
  not a secret — it is allowlisted in `.gitleaks.toml`.
- A personal email address as the commit author or committer. Commit as the publishing account's
  `@users.noreply.github.com` address; once pushed, an author email is visible on every commit
  page forever and cannot be removed without rewriting history and moving all 98 lesson tags.
- A `Claude-Session:` trailer. It is a private URL into the owner's account, and a commit message
  is public forever.

**Known gap (owner action).** The commits on `main` from before this check was added do not pass
`--commits`: they carry a personal author identity and `Claude-Session` trailers. Fixing them means
rewriting history and re-pointing all 98 `lesson/*` tags, which the tag contract in `README.md`
forbids doing casually. The guards therefore scan only what a push **adds**; the owner decides
whether the historical rewrite is worth it.

**Session and artifact identifiers.** A Claude _session URL/id_ (`claude.ai/code/session_…`, a
`Claude-Session:` trailer) and an _artifact URL_ (`claude.ai/code/artifact/<uuid>`) name resources in
the owner's Claude account and must never be committed. `scripts/check-public-hygiene.mjs` blocks
both (rules `session-url`, `artifact-url`) in files, staged content and commit metadata. Lab
material that needs an example uses an obviously synthetic ALL-CAPS placeholder
(`session_01EXAMPLEEXAMPLEEXAMPLE`, `<artifact-id>`), which the rule deliberately allows.

**Do instead:**

- Keep endpoints generic: `http://localhost:3000`, `127.0.0.1`, `example.com`.
- Reference secrets by name only — `${{ secrets.X }}` in a workflow, `process.env.X` in code.
- Local-only values go in `.env.local` or `.claude/settings.local.json` (both git-ignored).
- Private match patterns that must not be spelled out here are supplied out-of-band, as a list of
  regexes: the `HYGIENE_EXTRA_PATTERNS` repo secret (`"re1|||re2"`) or a git-ignored
  `.hygiene.local.json` (`{"patterns": ["re1"]}`).

**Enforcement (all of these must stay green):**

1. `node scripts/check-public-hygiene.mjs` — tracked files. Also `--staged` (pre-commit),
   `--commits <RANGE>` (commit metadata: author, committer and `Co-authored-by` /
   `Signed-off-by` identities against a **positive allowlist**, a ban on `Claude-Session`
   trailers, and the file rules applied to the message text — every offending value is masked in
   the output, because this runs in public CI logs), `--identity` (this clone's configured git
   identity, run by `install-hooks.sh`), and `--stdin --label <name>` for a single blob.
   This file is the sibling of the same script in `codechup/claude-code-training` and carries the
   same rule set, CLI contract and commit-metadata policy; the two lab-only differences (the
   `SKIP` and `SELF` path lists) are marked `LAB-ONLY` in the source.
2. `sh scripts/install-hooks.sh` — installs `pre-commit` (staged content) and `pre-push`
   (the commits being published, plus the lesson-tag contract in README.md).
3. `.github/workflows/ci.yml` — the `hygiene` job on every push and pull request, and the
   `tags` job that asserts the 98 lesson tags are still present and paired.
4. `gitleaks detect --config .gitleaks.toml` — the m14-03 lab's scanner, run by hand.

If something seems to need a private value, it does not: use a secret or a placeholder and write
the owner action down in the pull request instead.
