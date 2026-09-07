import { beforeEach, describe, expect, test, vi } from "vitest";
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

  // This is the fix for the flaky-test bug in BUGS.md ("real-timer-dependent test"): isOverdue
  // takes an injectable clock, so this test controls time with vitest's fake timers instead of
  // real sleeps. It is deterministic on every run, on every machine, at any CI load.
  test("a task becomes overdue exactly when its due date passes (fake clock, deterministic)", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
      const task = addTask({ title: "renew license", dueDate: "2026-01-01T00:00:30.000Z" });
      expect(isOverdue(task, Date.now)).toBe(false);

      vi.setSystemTime(new Date("2026-01-01T00:00:31.000Z"));
      expect(isOverdue(task, Date.now)).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
