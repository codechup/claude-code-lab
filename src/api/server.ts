#!/usr/bin/env node
// A tiny HTTP API over the same store the CLI uses. No framework — a handful of routes on
// node:http is plenty for a lab, and it keeps `npm ci` fast across every lesson checkout.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { resolve } from "node:path";
import {
  addTask,
  getTask,
  isOverdue,
  listTasks,
  markDone,
  paginate,
  type StatusFilter,
} from "../store.ts";
import { InvalidTaskError } from "../types.ts";

/**
 * TEACHING SURFACE (m14-03-secrets, a later plan): reading a token from the environment is fine;
 * logging it on startup is the anti-pattern that lesson's exercise finds and removes. Left as-is
 * here — a placeholder value only, never a real credential — so a future lesson has something
 * genuine to fix. Do not "clean this up" without updating BUGS.md.
 */
export function getApiToken(): string {
  const token = process.env.LABTRACK_API_TOKEN ?? "dev-placeholder-token";
  console.log(`[config] using token: ${token}`);
  return token;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(payload);
}

/**
 * BUGS.md B6 (m14-02-prompt-injection): note is untrusted user input. Nothing here calls a
 * real LLM, but the *shape* of the original mistake — splicing it straight into a templated
 * string — is the one that lets injected text hijack an instruction template if this string
 * were ever fed to one. Treat it as inert data: collapse line breaks (so it can never open a
 * new "line" that looks like a fresh instruction or role marker) before it goes anywhere near
 * the template.
 */
function sanitizeNote(note: string): string {
  return note.replace(/[\r\n]+/g, " ").trim();
}

function renderNote(title: string, note: string): string {
  return `Note for "${title}": ${sanitizeNote(note)}`;
}

export function createApp() {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const parts = url.pathname.split("/").filter(Boolean);

    try {
      if (req.method === "GET" && parts.length === 0) {
        sendJson(res, 200, { status: "ok" });
        return;
      }

      if (req.method === "GET" && parts[0] === "health") {
        sendJson(res, 200, { status: "ok" });
        return;
      }

      if (req.method === "GET" && parts[0] === "tasks" && parts.length === 1) {
        const status = (url.searchParams.get("status") ?? "all") as StatusFilter;
        const page = Number(url.searchParams.get("page") ?? "1");
        const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
        const items = paginate(listTasks({ status }), page, pageSize);
        sendJson(res, 200, { items });
        return;
      }

      if (req.method === "POST" && parts[0] === "tasks" && parts.length === 1) {
        const body = JSON.parse((await readBody(req)) || "{}");
        const task = addTask({ title: body.title, priority: body.priority, dueDate: body.dueDate });
        sendJson(res, 201, task);
        return;
      }

      if (req.method === "GET" && parts[0] === "tasks" && parts.length === 2) {
        const task = getTask(parts[1] ?? "");
        if (!task) {
          sendJson(res, 404, { error: "not found" });
          return;
        }
        sendJson(res, 200, { ...task, overdue: isOverdue(task) });
        return;
      }

      if (req.method === "POST" && parts[0] === "tasks" && parts[2] === "done") {
        const task = markDone(parts[1] ?? "");
        sendJson(res, 200, task);
        return;
      }

      if (req.method === "POST" && parts[0] === "tasks" && parts[2] === "render-note") {
        const body = JSON.parse((await readBody(req)) || "{}");
        const task = getTask(parts[1] ?? "");
        if (!task) {
          sendJson(res, 404, { error: "not found" });
          return;
        }
        sendJson(res, 200, { note: renderNote(task.title, String(body.note ?? "")) });
        return;
      }

      sendJson(res, 404, { error: "not found" });
    } catch (err) {
      if (err instanceof InvalidTaskError) {
        sendJson(res, 400, { error: err.message });
        return;
      }
      sendJson(res, 500, { error: (err as Error).message });
    }
  });
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.dirname, "server.ts");
if (isMain) {
  getApiToken();
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => console.log(`labtrack API listening on :${port}`));
}
