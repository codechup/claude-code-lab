---
name: review-security
description: Prompt-only checklist for reviewing this repo's src/ for the common mistakes it is seeded with — unvalidated input, unhandled promise rejections, secrets in logs, unsanitised string interpolation.
when_to_use: Before merging a change to src/, or when asked to "review this for security issues."
argument-hint: "[optional path to focus on, e.g. src/api/server.ts]"
allowed-tools: Read, Grep, Glob
disable-model-invocation: true
model: sonnet
effort: low
---

# /review-security

Review `$ARGUMENTS` (default: all of `src/`) against this checklist. Report each finding as
`file:line — issue — fix`, and say explicitly when a checklist item found nothing.

1. **Input validation** — does every function that accepts external input (CLI args, HTTP
   request bodies) reject empty/negative/malformed values before using them?
2. **Unhandled promises** — is every `async` call either `await`ed or has a `.catch`? A
   fire-and-forget call whose rejection is never observed is a bug, not a style nit.
3. **Secrets in logs** — does anything `console.log` a token, key, or password value, even a
   placeholder one, in a code path that would run against a real credential?
4. **Unsanitised interpolation** — does any handler splice untrusted input directly into a
   string that is later trusted as an instruction or template (the shape of a prompt-injection
   bug, even where there is no LLM call involved)?

This is a checklist skill only — it reads and reports, it does not edit `src/`.
