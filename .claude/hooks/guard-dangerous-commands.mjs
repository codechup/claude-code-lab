#!/usr/bin/env node
// PreToolUse hook (matcher: Bash|PowerShell) — denies obviously destructive commands before
// they run: `rm -rf` on a broad path, and a force-push to a shared branch.
//
// Contract: exit 2 (or a JSON hookSpecificOutput.permissionDecision) on stdin/stdout blocks the
// tool call; this hook is deliberately narrow — it is teaching material, not a full sandbox.
import { readFileSync } from "node:fs";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const tool = input.tool_name ?? "";
if (tool !== "Bash" && tool !== "PowerShell") process.exit(0);

const command = String(input.tool_input?.command ?? "");

const DANGEROUS = [
  /\brm\s+(-\w*r\w*f\w*|-\w*f\w*r\w*)\s+(\/|~|\.\.|\*)/i, // rm -rf /, rm -rf ~, rm -rf .., rm -rf *
  /\bgit\s+push\b.*--force(?!-with-lease)/i, // plain --force, not --force-with-lease
  /\bgit\s+push\b.*(-f)\b/i,
];

const hit = DANGEROUS.find((re) => re.test(command));
if (!hit) process.exit(0);

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        `Blocked by guard-dangerous-commands: "${command}" looks destructive ` +
        `(broad rm -rf or a plain force-push). Use --force-with-lease, or narrow the path, ` +
        `or ask the user to run it themselves.`,
    },
  }),
);
process.exit(0);
