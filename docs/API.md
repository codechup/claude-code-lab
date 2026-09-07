# labtrack HTTP API

`src/api/server.ts` — a tiny `node:http` API over the same store the CLI uses (`src/store.ts`).
`npm run api` starts it on `:3000` (override with `PORT`). Written directly from the route
table in `createApp()` (P02-api-error-docs.md), not guessed.

Every response is JSON. Every route can also return `500 {"error": "<message>"}` for an
unexpected error, and any unmatched method/path returns `404 {"error": "not found"}`.

## `GET /`

Liveness check, identical to `GET /health`.

- **200** `{ "status": "ok" }`

## `GET /health`

- **200** `{ "status": "ok" }`

## `GET /tasks`

List tasks, paginated. Query parameters (all optional):

| Param      | Default | Meaning                   |
| ---------- | ------- | ------------------------- |
| `status`   | `all`   | `all` \| `open` \| `done` |
| `page`     | `1`     | 1-indexed page number     |
| `pageSize` | `20`    | items per page            |

- **200** `{ "items": Task[] }`

## `POST /tasks`

Body: `{ "title": string, "priority"?: number, "dueDate"?: string }`.

- **201** the created `Task`.
- **400** `{ "error": "<message>" }` — the title is empty/whitespace-only, or `priority` is
  negative (`src/store.ts`'s `addTask`, `InvalidTaskError`).

## `GET /tasks/:id`

- **200** the `Task`, plus `overdue: boolean`.
- **404** `{ "error": "not found" }` — no task with that id.

## `POST /tasks/:id/done`

Marks a task done. No body.

- **200** the updated `Task`.
- **400** `{ "error": "no such task: <id>" }` — `markDone` throws `InvalidTaskError` for an
  unknown id (unlike `GET /tasks/:id`, which returns 404 for the same case — this route
  doesn't check existence before calling `markDone`).

## `POST /tasks/:id/render-note`

Body: `{ "note": string }`. See `BUGS.md` B6 — `note` is sanitised (line breaks collapsed)
before it's spliced into the response; this route pre-dates and demonstrates that fix, it
doesn't call an LLM.

- **200** `{ "note": "Note for \"<title>\": <sanitised note>" }`.
- **404** `{ "error": "not found" }` — no task with that id.
