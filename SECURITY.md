# Security Policy

This repository is the **lab sandbox** for the Claude Code course at
<https://cc.codechup.com>. It exists to be cloned, broken and thrown away: it
ships deliberate bugs (see `BUGS.md`) as teaching material, and it holds no
production data, no credentials and no deployment.

## Deliberate bugs are not vulnerabilities

Anything documented in `BUGS.md` is there on purpose and is not a security
report. The same goes for the "TEACHING SURFACE" comments in the source — they
mark code a lesson asks the reader to change.

## Reporting a vulnerability

If you find a genuine security problem — something that could harm a person who
clones this repo and runs the labs, such as a malicious dependency, a workflow
that could leak a fork's secrets, or a lab step that would exfiltrate a
reader's data — report it privately:

- Preferred: **GitHub private vulnerability reporting** — the _Report a
  vulnerability_ button under this repository's Security tab.
- Or email **security@codechup.com**.

Please do not open a public issue for these.

Include what you found, how to reproduce it, and the impact you think it has.
We aim to acknowledge within 5 business days and will coordinate disclosure
with you once a fix is ready.

## Supported versions

There are no releases. Only the `main` branch and the `lesson/**` tags are
supported; the tags are pinned course material and are never rewritten, so a
fix always lands on `main` (and, if a lab is affected, as a new tag).

## Scope note for the labs

Some lessons ask you to give Claude Code permission to run commands in this
repository. Run the labs in a clone you are willing to lose, never in a
checkout that shares a machine account with anything you care about, and never
put a real API key, token or personal data into a file here — the repository is
public and secret scanning with push protection is enabled, but the only
reliable protection is not writing the secret in the first place.
