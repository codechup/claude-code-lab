#!/usr/bin/env node
// A minimal MCP server for labtrack: one tool, one transport (stdio). This is the
// m11-06-write-your-own-server lab's target — small enough to read in one sitting, real
// enough to point Claude Code at with `claude mcp add` (see the repo root's .mcp.json).
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

interface Task {
  id: string;
  title: string;
  priority: number;
  done: boolean;
  createdAt: number;
  dueDate?: string;
}

/**
 * Reads the same JSON file the labtrack CLI persists to (see ../src/cli.ts, DATA_FILE).
 * Returns an empty list if the file doesn't exist yet — a fresh checkout with no tasks
 * added is not an error.
 */
async function readTasks(file: string): Promise<Task[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Task[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

function summarize(tasks: Task[]): {
  total: number;
  open: number;
  done: number;
  overdue: number;
} {
  const now = Date.now();
  let open = 0;
  let done = 0;
  let overdue = 0;
  for (const t of tasks) {
    if (t.done) {
      done++;
    } else {
      open++;
      if (t.dueDate && Date.parse(t.dueDate) < now) overdue++;
    }
  }
  return { total: tasks.length, open, done, overdue };
}

const server = new McpServer({ name: "labtrack-mcp", version: "1.0.0" });

server.registerTool(
  "labtrack_status",
  {
    title: "labtrack status",
    description:
      "Summarizes the labtrack task file: total/open/done/overdue counts. Reads the same " +
      ".labtrack-data.json the labtrack CLI writes to.",
    inputSchema: {
      dataFile: z
        .string()
        .optional()
        .describe("Path to the labtrack data file. Defaults to ./.labtrack-data.json."),
    },
  },
  async ({ dataFile }) => {
    const file = resolve(dataFile ?? process.env.LABTRACK_DATA_FILE ?? ".labtrack-data.json");
    const tasks = await readTasks(file);
    const summary = summarize(tasks);
    return {
      content: [{ type: "text", text: JSON.stringify({ file, ...summary }, null, 2) }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("labtrack-mcp failed to start:", err);
  process.exit(1);
});
