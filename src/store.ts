// Core task-tracking logic. The CLI (src/cli.ts) and the HTTP API (src/api/server.ts) are both
// thin wrappers around this module — fix a bug here once, not twice. See BUGS.md.
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { InvalidTaskError, type Task } from "./types.ts";

export { InvalidTaskError };
export type { Task };

const tasks: Task[] = [];

/** Test-only: clears the in-memory store between test cases. */
export function resetTasks(): void {
  tasks.length = 0;
}

export interface AddTaskInput {
  title: string;
  priority?: number;
  dueDate?: string;
}

export function addTask(input: AddTaskInput): Task {
  const title = input.title?.trim();
  if (!title) {
    throw new InvalidTaskError("title must not be empty");
  }
  const priority = input.priority ?? 0;
  if (priority < 0) {
    throw new InvalidTaskError("priority must not be negative");
  }
  const task: Task = {
    id: randomUUID(),
    title,
    priority,
    done: false,
    createdAt: Date.now(),
    dueDate: input.dueDate,
  };
  tasks.push(task);
  return task;
}

export type StatusFilter = "all" | "open" | "done";

export function listTasks(opts: { status?: StatusFilter } = {}): Task[] {
  const status = opts.status ?? "all";
  const filtered = tasks.filter((t) => {
    if (status === "all") return true;
    return status === "done" ? t.done : !t.done;
  });
  return [...filtered].sort((a, b) => a.createdAt - b.createdAt);
}

/** Slice `items` into 1-indexed pages of `pageSize`. Page 1 is the first page. */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function markDone(id: string): Task {
  const task = getTask(id);
  if (!task) throw new InvalidTaskError(`no such task: ${id}`);
  task.done = true;
  return task;
}

export function removeTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

/**
 * A task is overdue when it has a due date in the past and is not done.
 * `now` is injectable so tests never depend on the real wall clock (see BUGS.md, the
 * flaky-test lesson) — always pass a fixed clock in tests, never rely on real timers.
 */
export function isOverdue(task: Task, now: () => number = Date.now): boolean {
  if (!task.dueDate || task.done) return false;
  return Date.parse(task.dueDate) < now() / 1000;
}

export interface Persister {
  write: (file: string, data: string) => Promise<void>;
}

export const nodeFsPersister: Persister = {
  write: (file, data) => writeFile(file, data, "utf8"),
};

export async function saveToDisk(
  items: Task[],
  file: string,
  persister: Persister = nodeFsPersister,
): Promise<void> {
  await persister.write(file, JSON.stringify(items, null, 2));
}
