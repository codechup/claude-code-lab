import { beforeEach, describe, expect, test } from "vitest";
import { InvalidTaskError, addTask, listTasks, paginate, resetTasks } from "../src/store.ts";

beforeEach(() => {
  resetTasks();
});

describe("addTask validation", () => {
  test("rejects an empty title", () => {
    expect(() => addTask({ title: "   " })).toThrow(InvalidTaskError);
  });

  test("rejects a negative priority", () => {
    expect(() => addTask({ title: "ok", priority: -1 })).toThrow(InvalidTaskError);
  });

  test("accepts a valid task", () => {
    const task = addTask({ title: "buy milk", priority: 2 });
    expect(task.title).toBe("buy milk");
    expect(task.priority).toBe(2);
    expect(task.done).toBe(false);
  });
});

describe("paginate", () => {
  test("page 1 returns the first page, not the second", () => {
    for (let i = 1; i <= 5; i++) addTask({ title: `task ${i}` });
    const all = listTasks();
    const page1 = paginate(all, 1, 2);
    expect(page1.map((t) => t.title)).toEqual(["task 1", "task 2"]);
  });

  test("page 2 continues right after page 1", () => {
    for (let i = 1; i <= 5; i++) addTask({ title: `task ${i}` });
    const all = listTasks();
    const page2 = paginate(all, 2, 2);
    expect(page2.map((t) => t.title)).toEqual(["task 3", "task 4"]);
  });
});

describe("listTasks status filter", () => {
  test("open excludes done tasks", () => {
    addTask({ title: "a" });
    addTask({ title: "b" });
    expect(listTasks({ status: "open" })).toHaveLength(2);
    expect(listTasks({ status: "done" })).toHaveLength(0);
  });
});
