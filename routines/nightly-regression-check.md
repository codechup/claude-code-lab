# Routine: nightly regression check

The m17-02-routines lab: an example routine description — the repo-side half of a
scheduled agent. A routine's schedule, trigger and delivery are configured where the
routine runs (the desktop app, `claude schedule`, or an API endpoint), not in this
repository; this file is what a maintainer would paste into that configuration, kept next
to the repo it targets so the two never drift apart.

## Trigger

Cron, nightly at 03:00 UTC — chosen to run after most contributors' timezones are done for
the day, before the next one starts.

## Prompt

```
cd claude-code-lab && git pull
Run scripts/loop-check.sh.
If it exits non-zero, open a GitHub issue titled "nightly regression: <date>" with the
script's output attached, tagged `regression`. If it exits 0, do nothing — a routine that
posts "all good" every night trains everyone to ignore it.
Read-only otherwise: never push a fix, never edit files. This routine detects; it doesn't repair.
```

## Tools

`Bash(git pull)`, `Bash(scripts/loop-check.sh)`, `Bash(gh issue create:*)`, `Bash(gh issue list:*)`
(to avoid filing a duplicate for a regression already reported and still open).

## Why a routine and not `/loop`

`/loop` runs inside one interactive session for as long as that session stays open — good
for "watch this while I'm working." A routine survives the session ending: it's the right
tool once the check needs to run whether or not anyone is at the keyboard, which is exactly
what "nightly" implies. See m17-01-loop vs. m17-02-routines for the fuller comparison.

## Failure mode this guards against

Silent regressions between contributions: this repo has no scheduled CI beyond
push/pull_request (`.github/workflows/ci.yml`), so a regression introduced by, say, a
dependency update with no matching PR would otherwise go unnoticed until the next person
happens to run `npm test` locally.
