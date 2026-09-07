#!/usr/bin/env node
// Prints a store.ts function stub and a matching test stub for a new task-store operation.
// Usage: node scaffold.mjs <functionName>
const name = process.argv[2];
if (!name) {
  console.error("usage: node scaffold.mjs <functionName>");
  process.exit(1);
}

console.log(`// Add to src/store.ts:
export function ${name}(/* args */): void {
  // TODO: implement
}

// Add to test/store.test.ts:
test("${name} …", () => {
  // TODO: assert behaviour
});
`);
