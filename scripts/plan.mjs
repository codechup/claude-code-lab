#!/usr/bin/env node
// plan.mjs — the m18-05-handoff-notes lab: list plans/*.md that are claimable right now.
// A tiny, single-purpose read of the same frontmatter shape claude-code-training's fuller
// tools/plan/cli.ts reads. This script only *lists* — claiming means hand-editing a plan's
// status/owner/branch/updated_at yourself and updating STATE.md to match (see that file's
// header comment for why: a repo this small doesn't earn a full generator/claim tool).
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const plansDir = join(root, "plans");

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}

/** Parses just enough YAML frontmatter for this repo's plan schema: scalars, `[]`, `null`,
 * and one-level `key:\n  - item` lists. Not a general YAML parser — plans/*.md is small and
 * hand-written, so this only needs to handle the shapes actually used there. */
function parseFrontmatter(text, file) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) throw new Error(`${file}: no frontmatter block found`);
  const meta = {};
  let listKey = null;
  for (const line of match[1].split("\n")) {
    const listItem = /^\s+-\s*(.+)$/.exec(line);
    if (listItem && listKey) {
      meta[listKey].push(stripQuotes(listItem[1].trim()));
      continue;
    }
    const kv = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue.trim();
    listKey = null;
    if (value === "") {
      meta[key] = [];
      listKey = key; // list items follow on the next lines
    } else if (value.startsWith("[") && value.endsWith("]")) {
      // Inline flow sequence, e.g. `depends_on: [P02]` or `depends_on: []`.
      const inner = value.slice(1, -1).trim();
      meta[key] = inner === "" ? [] : inner.split(",").map((item) => stripQuotes(item.trim()));
    } else if (value === "null") {
      meta[key] = null;
    } else {
      meta[key] = stripQuotes(value);
    }
  }
  return meta;
}

function loadPlans() {
  return readdirSync(plansDir)
    .filter((file) => /^P\d+-.*\.md$/.test(file))
    .map((file) => parseFrontmatter(readFileSync(join(plansDir, file), "utf8"), file))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

/** A plan is claimable when it's `todo` and every plan it depends on is `done` — the same
 * definition claude-code-training's tools/plan/plan.ts uses, minus the stale-reclaim case. */
function isClaimable(plan, byId) {
  if (plan.status !== "todo") return false;
  const deps = Array.isArray(plan.depends_on) ? plan.depends_on : [];
  return deps.every((depId) => byId.get(depId)?.status === "done");
}

function main() {
  const plans = loadPlans();
  const byId = new Map(plans.map((plan) => [plan.id, plan]));
  const claimable = plans.filter((plan) => isClaimable(plan, byId));

  if (claimable.length === 0) {
    console.log("No claimable plans right now.");
    return;
  }
  console.log(`${claimable.length} claimable plan(s):`);
  for (const plan of claimable) {
    console.log(`  ${plan.id}  ${plan.title}`);
  }
}

main();
