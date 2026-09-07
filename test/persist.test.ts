import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { resetTasks } from "../src/store.ts";
import { runAdd } from "../src/cli.ts";

beforeEach(() => {
  resetTasks();
});

describe("runAdd persistence", () => {
  let rejections: unknown[] = [];
  const onRejection = (reason: unknown) => rejections.push(reason);

  beforeEach(() => {
    rejections = [];
    process.on("unhandledRejection", onRejection);
  });

  afterEach(() => {
    process.off("unhandledRejection", onRejection);
  });

  test("a save failure is reported, not swallowed as an unhandled rejection", async () => {
    const failingSave = async () => {
      throw new Error("disk full");
    };

    let thrown: unknown;
    try {
      await runAdd({ title: "buy milk" }, { save: failingSave, dataFile: "/dev/null/unwritable" });
    } catch (err) {
      thrown = err;
    }

    // Give the microtask queue a turn — an unhandled rejection from a fire-and-forget call
    // surfaces here, not synchronously.
    await new Promise((resolve) => setImmediate(resolve));

    expect(rejections).toHaveLength(0);
    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toMatch(/disk full/);
  });
});
