import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const eslint = new ESLint({ cwd: frontendDir });

// Paths do not need to exist: rules here are not type-aware, so ESLint only matches the globs.
const componentPath = "src/components/ConfigProbe.tsx";

let componentConfig: Awaited<ReturnType<ESLint["calculateConfigForFile"]>>;

// The first call imports the whole plugin stack, which can take several seconds while the unit
// project runs in parallel; ESLint caches the loaded config for every later call.
beforeAll(async () => {
  componentConfig = await eslint.calculateConfigForFile(componentPath);
}, 30_000);

async function ruleIdsFor(code: string) {
  const [result] = await eslint.lintText(code, { filePath: componentPath });
  return result.messages.map((message) => message.ruleId);
}

describe("eslint.config.js", () => {
  describe("bypass policy for src/**/*.tsx", () => {
    it("sets linterOptions.noInlineConfig (STD-02 AC 2)", () => {
      expect(componentConfig.linterOptions.noInlineConfig).toBe(true);
    });

    it("bans @ts-ignore, @ts-expect-error and @ts-nocheck even with a description (STD-02 AC 3)", () => {
      expect(componentConfig.rules["@typescript-eslint/ban-ts-comment"]).toEqual([
        2,
        expect.objectContaining({
          "ts-ignore": true,
          "ts-expect-error": true,
          "ts-nocheck": true,
        }),
      ]);
    });

    it.each(["@ts-ignore", "@ts-expect-error", "@ts-nocheck"])(
      "reports a %s comment (STD-02 AC 3)",
      async (directive) => {
        const ruleIds = await ruleIdsFor(
          `// ${directive} the type is wrong here\nexport const value = 1;\n`,
        );

        expect(ruleIds).toContain("@typescript-eslint/ban-ts-comment");
      },
    );

    it.each([
      ["an eslint-disable-next-line comment", "// eslint-disable-next-line @typescript-eslint/no-explicit-any\n"],
      ["a file-wide eslint-disable comment", "/* eslint-disable */\n"],
    ])("still reports a violation preceded by %s (STD-02 AC 9)", async (_label, directive) => {
      const ruleIds = await ruleIdsFor(`${directive}export const value: any = 1;\n`);

      expect(ruleIds).toContain("@typescript-eslint/no-explicit-any");
    });
  });
});
