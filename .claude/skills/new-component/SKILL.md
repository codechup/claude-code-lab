---
name: new-component
description: Scaffold a new store.ts operation (function stub + test stub) from a name, then implement it. Tool-running — runs a script, then writes real code in a forked context.
when_to_use: Adding a brand-new operation to src/store.ts (not fixing an existing bug).
argument-hint: '<functionName>'
allowed-tools: Bash(node .claude/skills/new-component/scaffold.mjs:*), Read, Edit, Write, Bash(npm test)
context: fork
model: sonnet
effort: medium
---

# /new-component

1. Run `node .claude/skills/new-component/scaffold.mjs $ARGUMENTS` to print a starting stub.
2. Read `src/store.ts` and `test/store.test.ts` to match existing conventions (named exports,
   `InvalidTaskError` for bad input, an injectable clock for anything time-based).
3. Write the real implementation into `src/store.ts` and a real test into `test/`, replacing
   the `TODO`s from the stub.
4. Run `npm test` and report the result before finishing.

Runs in a forked context so this exploration doesn't consume the parent session's context
window — only the final diff and test result need to come back.
