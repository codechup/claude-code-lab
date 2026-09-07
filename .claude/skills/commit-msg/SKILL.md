---
name: commit-msg
description: Draft a conventional commit message for the currently staged diff. Prompt-only — reads the diff and $ARGUMENTS (an optional scope hint), writes nothing.
when_to_use: Staged changes exist and you want a conventional-commit message drafted from them instead of writing one by hand.
argument-hint: "[optional scope, e.g. cli or api]"
allowed-tools: Bash(git diff:*), Bash(git status:*)
disable-model-invocation: true
model: haiku
effort: low
---

# /commit-msg

Run `git diff --staged` and `git status --short`. From the staged diff, write one
conventional commit message: `type(scope): summary`, types `feat|fix|docs|chore|test|refactor`.

- If `$ARGUMENTS` gives a scope, use it; otherwise infer one from the changed paths
  (`cli`, `api`, `store`, `test`, `docs`).
- Summary line under 72 characters, imperative mood ("add", not "added").
- Add a body only if the diff needs one sentence of "why" beyond the summary.
- Print the message only — do not run `git commit`.
