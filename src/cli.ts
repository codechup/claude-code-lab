#!/usr/bin/env node
// labtrack — a tiny task-tracker CLI. Business logic lives in store.ts; this file only parses
// arguments, calls into the store, and prints. Exported *run* functions are what tests call
// directly, so a test never has to spawn a child process to exercise CLI behaviour.
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  addTask,
  getTask,
  isOverdue,
  listTasks,
  loadFromDisk,
  markDone,
  paginate,
  removeTask,
  replaceAllTasks,
  saveToDisk,
  type StatusFilter,
} from "./store.ts";

export const DATA_FILE = resolve(process.cwd(), ".labtrack-data.json");

/** Reads this package's own version out of package.json — the single source of truth for
 * what `labtrack --version` prints (P01-cli-usability.md). */
export function readVersion(): string {
  const pkgPath = resolve(import.meta.dirname, "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };
  return pkg.version;
}

/** Hydrates the in-memory store from DATA_FILE. Call once, before any command runs. */
export async function loadStateForCli(dataFile: string = DATA_FILE): Promise<void> {
  replaceAllTasks(await loadFromDisk(dataFile));
}

export interface AddArgs {
  title: string;
  priority?: string;
  due?: string;
}

export interface AddDeps {
  save?: typeof saveToDisk;
  dataFile?: string;
}

/**
 * Adds a task and persists the full list to disk. A save failure must reach the caller —
 * never fire the write and move on (see BUGS.md, "unhandled promise rejection").
 */
export async function runAdd(args: AddArgs, deps: AddDeps = {}) {
  const save = deps.save ?? saveToDisk;
  const dataFile = deps.dataFile ?? DATA_FILE;
  const task = addTask({
    title: args.title,
    priority: args.priority !== undefined ? Number(args.priority) : undefined,
    dueDate: args.due,
  });
  try {
    await save(listTasks(), dataFile);
  } catch (err) {
    throw new Error(`failed to save tasks to ${dataFile}: ${(err as Error).message}`, {
      cause: err,
    });
  }
  return task;
}

export function runList(opts: { status?: StatusFilter; page?: string; pageSize?: string }) {
  const all = listTasks({ status: opts.status });
  const page = opts.page ? Number(opts.page) : 1;
  const pageSize = opts.pageSize ? Number(opts.pageSize) : 20;
  return paginate(all, page, pageSize);
}

export function runShow(id: string) {
  const task = getTask(id);
  if (!task) return undefined;
  return { ...task, overdue: isOverdue(task) };
}

function printTask(t: { id: string; title: string; done: boolean; priority: number }): string {
  return `[${t.done ? "x" : " "}] ${t.id.slice(0, 8)}  p${t.priority}  ${t.title}`;
}

export function buildProgram(): Command {
  const program = new Command();
  program
    .name("labtrack")
    .description("A tiny task tracker for the Claude Code Academy labs.")
    .version(readVersion(), "--version", "print the installed labtrack version");

  program
    .command("add <title>")
    .description("add a new task")
    .addHelpText("after", '\nExample: labtrack add "buy milk" --priority 1 --due 2026-09-10')
    .option("--priority <n>", "priority, 0 or higher")
    .option("--due <isoDate>", "due date, ISO 8601")
    .action(async (title: string, opts: { priority?: string; due?: string }) => {
      try {
        const task = await runAdd({ title, priority: opts.priority, due: opts.due });
        console.log(`added ${task.id}`);
      } catch (err) {
        console.error((err as Error).message);
        process.exitCode = 1;
      }
    });

  program
    .command("list")
    .description("list tasks, paginated")
    .addHelpText("after", "\nExample: labtrack list --status open --page 1 --page-size 10")
    .option("--status <status>", "all | open | done", "all")
    .option("--page <n>", "1-indexed page number", "1")
    .option("--page-size <n>", "items per page", "20")
    .action((opts: { status: StatusFilter; page: string; pageSize: string }) => {
      const page = runList({ status: opts.status, page: opts.page, pageSize: opts.pageSize });
      if (page.length === 0) {
        console.log("(no tasks)");
        return;
      }
      for (const t of page) console.log(printTask(t));
    });

  program
    .command("show <id>")
    .description("show one task, including whether it's overdue")
    .addHelpText("after", "\nExample: labtrack show 1a2b3c4d")
    .action((id: string) => {
      const task = runShow(id);
      if (!task) {
        console.error(`no such task: ${id}`);
        process.exitCode = 1;
        return;
      }
      console.log(JSON.stringify(task, null, 2));
    });

  program
    .command("done <id>")
    .description("mark a task done")
    .addHelpText("after", "\nExample: labtrack done 1a2b3c4d")
    .action(async (id: string) => {
      const task = markDone(id);
      await saveToDisk(listTasks(), DATA_FILE);
      console.log(`done ${task.id}`);
    });

  program
    .command("rm <id>")
    .description("remove a task")
    .addHelpText("after", "\nExample: labtrack rm 1a2b3c4d")
    .action(async (id: string) => {
      const removed = removeTask(id);
      if (!removed) {
        console.error(`no such task: ${id}`);
        process.exitCode = 1;
        return;
      }
      await saveToDisk(listTasks(), DATA_FILE);
      console.log(`removed ${id}`);
    });

  return program;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.dirname, "cli.ts");
if (isMain) {
  await loadStateForCli();
  await buildProgram().parseAsync(process.argv);
}
