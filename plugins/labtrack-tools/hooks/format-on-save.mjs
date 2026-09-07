#!/usr/bin/env node
// PostToolUse hook (matcher: Write|Edit) — runs Prettier on the file Claude just wrote or
// edited. Packaged from .claude/hooks/format-on-save.mjs (m07-03-format-on-save) as this
// plugin's example hook — see this plugin's README "Already wired?" note: installing this
// plugin in *this* repo runs Prettier twice per edit (harmless, since formatting is
// idempotent) because the project's own .claude/settings.json already wires the original.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

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

  // Unlike the project-local hook, a plugin hook has no fixed path relative to the project
  // it's installed into — use the project root PostToolUse itself reports (`cwd`).
  const root = input.cwd ?? process.cwd();
  const abs = isAbsolute(filePath) ? filePath : resolve(root, filePath);
  const rel = relative(root, abs).replace(/\\/g, "/");
  if (rel.startsWith("..") || rel.length === 0) return; // not inside the project

  if (!KNOWN.has(extname(abs).toLowerCase())) return;
  if (!existsSync(abs)) return;

  const prettier = join(root, "node_modules", "prettier", "bin", "prettier.cjs");
  if (!existsSync(prettier)) return; // dependencies not installed, or project has no prettier

  const r = spawnSync(process.execPath, [prettier, "--write", "--ignore-unknown", rel], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    const why = (r.stderr || r.error?.message || "").trim().split("\n")[0] ?? "";
    console.log(`labtrack-tools:format-on-save: could not format ${rel}${why ? ` — ${why}` : ""}`);
  }
}

try {
  main();
} catch (err) {
  console.log(`labtrack-tools:format-on-save: ${err?.message ?? err}`);
}
process.exit(0);
