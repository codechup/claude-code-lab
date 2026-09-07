import { beforeEach, describe, expect, test } from "vitest";
import { addTask, isOverdue, resetTasks } from "../src/store.ts";

beforeEach(() => {
  resetTasks();
});

describe("isOverdue", () => {
  test("a task due yesterday is overdue", () => {
    const task = addTask({
      title: "renew passport",
      dueDate: new Date(Date.now() - 86_400_000).toISOString(),
    });
    expect(isOverdue(task)).toBe(true);
  });

  test("a task due next week is not overdue", () => {
    const task = addTask({
      title: "plan trip",
      dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    });
    expect(isOverdue(task)).toBe(false);
  });

  test("a done task is never overdue, even past its due date", () => {
    const task = addTask({
      title: "old task",
      dueDate: new Date(Date.now() - 86_400_000).toISOString(),
    });
    task.done = true;
    expect(isOverdue(task)).toBe(false);
  });

  // Seeded bug B5 (BUGS.md): this test asserts against real wall-clock timing instead of
  // controlling the clock. It hard-codes elapsed-time assumptions that real setTimeout scheduling
  // does not guarantee - it fails outright here, and would merely be *intermittent* if the
  // margins were tuned tighter. Either way, a test must never depend on real time passing.
  test("a task becomes overdue exactly when its due date passes", async () => {
    const task = addTask({
      title: "renew license",
      dueDate: new Date(Date.now() + 200).toISOString(),
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(isOverdue(task)).toBe(false);

    await new Promise((r) => setTimeout(r, 20)); // ~40ms elapsed - due date is still ~160ms away
    expect(isOverdue(task)).toBe(true);
  });
});
