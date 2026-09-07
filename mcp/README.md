# labtrack-mcp

A minimal MCP server for the m11-06-write-your-own-server lab: one tool
(`labtrack_status`), one transport (stdio), built with `@modelcontextprotocol/sdk`.

This is a separate package from the repo root on purpose — it has its own
`package.json`/`tsconfig.json` so adding it never touches the root project's `npm test` /
`npm run typecheck`.

## Run it

No build step — Node 24 runs the `.ts` file directly, same as the repo root:

```bash
cd mcp
npm install
npm start        # node src/index.ts — speaks MCP over stdio
npm run typecheck # tsc --noEmit
```

## The tool

`labtrack_status` reads the same JSON file the `labtrack` CLI persists to
(`.labtrack-data.json` by default — override with the `dataFile` argument or the
`LABTRACK_DATA_FILE` env var) and returns `{ total, open, done, overdue }` counts. No
network access, no credentials — it only reads a local file.

## Wiring it up

The repo root's `.mcp.json` registers this server under the `labtrack` key, pointing at
`mcp/src/index.ts` — `npm install` here once so `@modelcontextprotocol/sdk` resolves before
Claude Code connects to it. See `claude mcp list` / `claude mcp add`
(m11-02-add-list-remove-scopes) for how a project-scoped `.mcp.json` entry gets picked up.
