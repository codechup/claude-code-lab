#!/usr/bin/env node
// labtrack — a tiny task-tracker CLI. Business logic lives in store.ts; this file only parses
// arguments, calls into the store, and prints. Exported *run* functions are what tests call
// directly, so a test never has to spawn a child process to exercise CLI behaviour.
import { Command } from "commander";
import { resolve } from "node:path";
import {
  addTask,
  getTask,
  isOverdue,
  listTasks,
  markDone,
  paginate,
  removeTask,
  saveToDisk,
  type StatusFilter,
} from "./store.ts";

export const DATA_FILE = resolve(process.cwd(), ".labtrack-data.json");

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
  program.name("labtrack").description("A tiny task tracker for the Claude Code Academy labs.");

  program
    .command("add <title>")
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

  program.command("show <id>").action((id: string) => {
    const task = runShow(id);
    if (!task) {
      console.error(`no such task: ${id}`);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(task, null, 2));
  });

  program.command("done <id>").action((id: string) => {
    const task = markDone(id);
    console.log(`done ${task.id}`);
  });

  program.command("rm <id>").action((id: string) => {
    const removed = removeTask(id);
    if (!removed) {
      console.error(`no such task: ${id}`);
      process.exitCode = 1;
      return;
    }
    console.log(`removed ${id}`);
  });

  return program;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.dirname, "cli.ts");
if (isMain) {
  await buildProgram().parseAsync(process.argv);
}
