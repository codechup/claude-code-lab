import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";
import type { AddressInfo } from "node:net";
import { resetTasks } from "../src/store.ts";
import { createApp } from "../src/api/server.ts";

let baseUrl: string;
let server: ReturnType<typeof createApp>;

beforeAll(async () => {
  server = createApp();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  resetTasks();
});

describe("labtrack API", () => {
  test("GET /health responds ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("POST /tasks then GET /tasks returns it", async () => {
    const created = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "write docs" }),
    });
    expect(created.status).toBe(201);

    const list = await fetch(`${baseUrl}/tasks`);
    const body = (await list.json()) as { items: Array<{ title: string }> };
    expect(body.items.map((t) => t.title)).toContain("write docs");
  });

  test("POST /tasks rejects an empty title with 400, not a 500", async () => {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    expect(res.status).toBe(400);
  });

  test("GET /tasks?page=1&pageSize=2 returns the first two items, in order", async () => {
    for (const title of ["a", "b", "c", "d"]) {
      await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
    }
    const res = await fetch(`${baseUrl}/tasks?page=1&pageSize=2`);
    const body = (await res.json()) as { items: Array<{ title: string }> };
    expect(body.items.map((t) => t.title)).toEqual(["a", "b"]);
  });
});
