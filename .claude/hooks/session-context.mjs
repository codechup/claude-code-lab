#!/usr/bin/env node
// SessionStart: prints a short orientation (README + open bug count) as additionalContext.
// Stop: runs the test suite and reports pass/fail so a session sees red output immediately
// after finishing a turn, without the user asking for it.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

let input = {};
try {
  input = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

const event = input.hook_event_name ?? '';

if (event === 'SessionStart') {
  let bugCount = 'unknown';
  try {
    const bugs = readFileSync(join(root, 'BUGS.md'), 'utf8');
    bugCount = String((bugs.match(/^## B\d+ /gm) ?? []).length);
  } catch {
    // BUGS.md not present yet (very early checkout) — fine, just report unknown.
  }
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext:
          `claude-code-lab: a tiny task-tracker CLI + HTTP API for the CodeChup Claude Code ` +
          `Academy. ${bugCount} entries in BUGS.md. Run "npm test" to see current pass/fail.`,
      },
    }),
  );
  process.exit(0);
}

if (event === 'Stop') {
  try {
    execFileSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run'], {
      cwd: root,
      stdio: 'inherit',
    });
  } catch {
    // A failing test suite is expected on most -start tags — never block Stop over it.
  }
  process.exit(0);
}

process.exit(0);
