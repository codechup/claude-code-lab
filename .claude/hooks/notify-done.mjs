#!/usr/bin/env node
// Notification + Stop hook — appends a one-line entry to notify.log when Claude needs input
// (Notification) or finishes a turn (Stop). A real setup would also post to desktop
// notifications or Slack; this lab keeps it to a local, inspectable file so the lesson has
// something to `cat` without any webhook/secret to configure.
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const logFile = join(root, 'notify.log');

let input = {};
try {
  input = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

const event = input.hook_event_name ?? 'unknown';
const message = input.message ?? (event === 'Stop' ? 'Claude finished a turn.' : 'Claude needs input.');

try {
  appendFileSync(logFile, `${new Date().toISOString()} [${event}] ${message}\n`, 'utf8');
} catch {
  // Never block the session over a notification failing to write.
}
process.exit(0);
