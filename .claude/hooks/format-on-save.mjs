#!/usr/bin/env node
// PostToolUse hook (matcher: Write|Edit) — runs Prettier on the file Claude just wrote or
// edited, so the tree always matches `npm run lint`.
//
// Contract: PostToolUse receives {tool_name, tool_input, tool_response, cwd, ...} as JSON on
// stdin. It is not a blocking event — formatting must never interrupt a session, so every path
// below ends in exit 0, including every failure path.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const KNOWN = new Set([".js", ".json", ".md", ".mjs", ".cjs", ".ts", ".yaml", ".yml"]);

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return; // No/invalid JSON on stdin: nothing to format.
  }

  const tool = input.tool_name ?? "";
  if (tool !== "Write" && tool !== "Edit") return;

  const filePath = input.tool_input?.file_path;
  if (typeof filePath !== "string" || filePath.length === 0) return;

  const abs = isAbsolute(filePath) ? filePath : resolve(input.cwd ?? root, filePath);
  const rel = relative(root, abs).replace(/\\/g, "/");
  if (rel.startsWith("..") || rel.length === 0) return; // not inside this repo

  if (!KNOWN.has(extname(abs).toLowerCase())) return;
  if (!existsSync(abs)) return;

  const prettier = join(root, "node_modules", "prettier", "bin", "prettier.cjs");
  if (!existsSync(prettier)) return; // dependencies not installed yet

  const r = spawnSync(process.execPath, [prettier, "--write", "--ignore-unknown", rel], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    const why = (r.stderr || r.error?.message || "").trim().split("\n")[0] ?? "";
    console.log(`prettier: could not format ${rel}${why ? ` — ${why}` : ""}`);
  }
}

try {
  main();
} catch (err) {
  console.log(`format-on-save: ${err?.message ?? err}`);
}
process.exit(0);
