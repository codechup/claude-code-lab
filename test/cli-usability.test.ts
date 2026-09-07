import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { buildProgram, readVersion } from "../src/cli.ts";

// P01-cli-usability.md's acceptance criteria: every subcommand has a description, and
// --version prints the same string as package.json's version field.
describe("labtrack CLI — help text and --version", () => {
  test("readVersion() matches package.json's version field", () => {
    const pkg = JSON.parse(
      readFileSync(resolve(import.meta.dirname, "..", "package.json"), "utf8"),
    ) as {
      version: string;
    };
    expect(readVersion()).toBe(pkg.version);
  });

  test("every subcommand has a description shown in --help output", () => {
    const program = buildProgram();
    const help = program.helpInformation();
    for (const name of ["add", "list", "show", "done", "rm"]) {
      const command = program.commands.find((c) => c.name() === name);
      expect(command?.description(), `${name} should have a description`).not.toBe("");
    }
    expect(help).toContain("A tiny task tracker for the Claude Code Academy labs.");
  });

  test("each subcommand's own --help includes a runnable example", () => {
    const program = buildProgram();
    for (const name of ["add", "list", "show", "done", "rm"]) {
      const command = program.commands.find((c) => c.name() === name);
      // helpInformation() renders only the built-in sections — addHelpText() output is
      // written separately by outputHelp(), so capture that instead of parsing stdout.
      let captured = "";
      command?.configureOutput({ writeOut: (text) => (captured += text) });
      command?.outputHelp();
      expect(captured, `${name} --help should show an Example:`).toMatch(/Example: labtrack/);
    }
  });
});
