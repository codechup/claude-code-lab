import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    // Every test file gets a fresh module graph — module-level state (the in-memory
    // task store) never leaks between files. Don't set isolate:false; see BUGS.md.
    isolate: true,
  },
});
