import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const eslint = new ESLint({ cwd: frontendDir });

// Paths do not need to exist: rules here are not type-aware, so ESLint only matches the globs.
const componentPath = "src/components/ConfigProbe.tsx";

type LintConfig = Awaited<ReturnType<ESLint["calculateConfigForFile"]>>;

// The first call imports the whole plugin stack, which can take several seconds while the unit
// project runs in parallel; ESLint caches the loaded config for every later call.
beforeAll(async () => {
  await eslint.calculateConfigForFile(componentPath);
}, 30_000);

async function ruleIdsFor(code: string, filePath = componentPath) {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((message) => message.ruleId);
}

describe("eslint.config.js", () => {
  describe("bypass policy", () => {
    it("bans @ts-expect-error even with a description (STD-02 AC 3)", async () => {
      const ruleIds = await ruleIdsFor("// @ts-expect-error the type is wrong here\nexport const value = 1;\n");

      expect(ruleIds).toContain("@typescript-eslint/ban-ts-comment");
    });

    it("still reports a violation preceded by an eslint-disable comment (STD-02 AC 2, 9)", async () => {
      const ruleIds = await ruleIdsFor(
        "// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport const value: any = 1;\n",
      );

      expect(ruleIds).toContain("@typescript-eslint/no-explicit-any");
    });
  });

  describe("component files export only components", () => {
    it("reports a helper function exported beside a component (STD-02 AC 5)", async () => {
      const ruleIds = await ruleIdsFor(
        "export function Probe() {\n  return null;\n}\n\nexport function toProbe(value: number) {\n  return value + 1;\n}\n",
      );

      expect(ruleIds).toContain("react-refresh/only-export-components");
    });

    it("allows a component file that exports only components and constants (STD-02 AC 5)", async () => {
      const ruleIds = await ruleIdsFor(
        'export const PROBE_LABEL = "probe";\n\nexport function Probe() {\n  return null;\n}\n',
      );

      expect(ruleIds).not.toContain("react-refresh/only-export-components");
    });
  });

  describe("code style", () => {
    it("reports an interface (STD-02 AC 4)", async () => {
      const ruleIds = await ruleIdsFor("export interface Probe {\n  id: number;\n}\n", "src/utils/configProbe.ts");

      expect(ruleIds).toContain("@typescript-eslint/consistent-type-definitions");
    });

    it("allows an interface in a *.d.ts library augmentation (STD-02 AC 4)", async () => {
      const ruleIds = await ruleIdsFor(
        'import "axios";\n\ndeclare module "axios" {\n  interface AxiosRequestConfig {\n    probe?: boolean;\n  }\n}\n',
        "src/api/clients/configProbe.d.ts",
      );

      expect(ruleIds).not.toContain("@typescript-eslint/consistent-type-definitions");
    });

    it("reports an arrow function, even with a type annotation (STD-09 AC 1)", async () => {
      const ruleIds = await ruleIdsFor(
        "const toProbe: (value: number) => number = (value) => value + 1;\n\nexport { toProbe };\n",
      );

      expect(ruleIds).toContain("func-style");
    });

    it("allows function declarations with inline arrow callbacks (STD-09 AC 1)", async () => {
      const ruleIds = await ruleIdsFor(
        "export function Probe({ values }: { values: number[] }) {\n  function handleClick() {\n    return values.map((value) => value + 1);\n  }\n  return <button onClick={() => handleClick()} />;\n}\n",
      );

      expect(ruleIds).not.toContain("func-style");
    });
  });

  describe("test support only from tests", () => {
    const testSupportImports =
      'import { server } from "@/test/server";\nimport { probeHandlers } from "./probe.handlers";\n\nexport const value = [server, probeHandlers];\n';

    it("reports handler factories and @/test/* imported from a feature file (STD-04 AC 3)", async () => {
      const ruleIds = await ruleIdsFor(testSupportImports, "src/features/x/Foo.tsx");

      expect(ruleIds.filter((id) => id === "no-restricted-imports")).toHaveLength(2);
    });

    it("leaves a test free to import test support (STD-04 AC 3)", async () => {
      expect(await ruleIdsFor(testSupportImports, "src/features/x/Foo.test.tsx")).not.toContain(
        "no-restricted-imports",
      );
    });
  });

  describe("layered imports", () => {
    // Each fragment is identified by its group (or regex), so a layer that loses one goes red.
    const testSupport = "**/*.handlers,@/test/*";
    const appInternals = "^@/app/(?!providers/|routing/paths$)";
    const crossFeature = "@/features/*";
    const appAny = "@/app/*";
    const api = "@/api/*";

    function fragmentsOf(config: LintConfig): string[] {
      const [severity, options] = config.rules["no-restricted-imports"] ?? [];
      if (severity !== 2) return [];
      return options.patterns.map(
        (pattern: { group?: string[]; regex?: string }) => pattern.regex ?? pattern.group?.join(","),
      );
    }

    // One path per block of the import table, tests included: a block that drops a fragment goes red.
    it.each([
      ["src/features/x/ConfigProbe.tsx", [testSupport, appInternals, crossFeature]],
      ["src/features/x/ConfigProbe.test.tsx", [appInternals, crossFeature]],
      ["src/app/routing/ConfigProbe.tsx", [testSupport]],
      ["src/app/routing/ConfigProbe.test.tsx", []],
      ["src/components/x/base/ConfigProbe.tsx", [testSupport, appInternals, crossFeature, appAny, api]],
      ["src/components/x/base/ConfigProbe.test.tsx", [appInternals, crossFeature, appAny, api]],
    ])("gives %s exactly its layer's fragments (STD-05 AC 5-8)", async (filePath, expected) => {
      const config = await eslint.calculateConfigForFile(filePath);

      expect([...fragmentsOf(config)].sort()).toEqual([...expected].sort());
    });

    async function restrictedImport(specifier: string, filePath: string) {
      const ruleIds = await ruleIdsFor(
        `import { probe } from "${specifier}";\n\nexport const value = probe;\n`,
        filePath,
      );
      return ruleIds.includes("no-restricted-imports");
    }

    it.each([
      ["src/features/overview/ConfigProbe.tsx", "@/features/plans/components/PlanSwitcher", true, "AC 5"],
      ["src/features/overview/ConfigProbe.tsx", "./components/SummaryCards", false, "AC 5"],
      ["src/components/x/ConfigProbe.tsx", "@/app/routing/PlanFiltersGate", true, "AC 6"],
      ["src/components/x/ConfigProbe.tsx", "@/app/providers/useTheme", false, "AC 6"],
      ["src/components/x/base/ConfigProbe.tsx", "@/api/dtos", true, "AC 7"],
      ["src/components/x/base/ConfigProbe.tsx", "@/lib/mergeClasses", false, "AC 7"],
      ["src/app/routing/ConfigProbe.tsx", "@/features/overview/OverviewPage", false, "AC 8"],
    ])("in %s, importing %s is restricted: %s (STD-05 %s)", async (filePath, specifier, restricted) => {
      expect(await restrictedImport(specifier, filePath)).toBe(restricted);
    });
  });

  describe("syntax layers", () => {
    function syntaxMessages(config: LintConfig): string[] {
      const [severity, ...selectors] = config.rules["no-restricted-syntax"] ?? [];
      if (severity !== 2) return [];
      return selectors.map((entry: { message: string }) => entry.message);
    }

    // One path per block of the syntax table: a later block that forgot a fragment would silently drop
    // it for its files. base/ primitives keep their own text styles, so they get the palette ban only.
    it.each([
      ["src/features/x/ConfigProbe.tsx", true],
      ["src/app/routing/ConfigProbe.tsx", true],
      ["src/components/x/base/ConfigProbe.tsx", false],
    ])(
      "in %s, the palette fragment is active and the typography and raw-tag fragments are: %s (STD-06 AC 14; STD-08 AC 2, 3)",
      async (filePath, typography) => {
        const messages = syntaxMessages(await eslint.calculateConfigForFile(filePath));

        expect(messages.filter((message) => message.startsWith("Raw palette colour"))).toHaveLength(2);
        expect(messages.filter((message) => message.startsWith("Size or weight class"))).toHaveLength(
          typography ? 2 : 0,
        );
        expect(messages.filter((message) => message.startsWith("Raw <p>/<hN>"))).toHaveLength(typography ? 1 : 0);
      },
    );
  });

  describe("palette ban", () => {
    // Only the palette's messages: the typography fragment also reports some probes below.
    async function paletteMessages(jsx: string) {
      const [result] = await eslint.lintText(
        `const tone = "";\nexport function Probe() {\n  return ${jsx};\n}\n`,
        { filePath: "src/features/x/ConfigProbe.tsx" },
      );
      return result.messages
        .filter((message) => message.ruleId === "no-restricted-syntax")
        .map((message) => message.message)
        .filter((message) => message.startsWith("Raw palette colour"));
    }

    it.each([
      ['<span className="hover:text-amber-600">late</span>', "a class string"],
      ["<span className={`px-2 ${tone} dark:border-red-500`}>x</span>", "a template literal"],
    ])("reports %s in %s, naming the tokens to use (STD-06 AC 14)", async (jsx) => {
      const messages = await paletteMessages(jsx);

      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain("text-warning");
    });

    it("allows token, black/white and non-colour classes (STD-06 AC 14)", async () => {
      expect(await paletteMessages('<span className="text-warning bg-black/10 text-sm">ok</span>')).toEqual([]);
    });
  });

  describe("typography through Heading and Text", () => {
    const TYPOGRAPHY = "Size or weight class";
    const RAW_TAG = "Raw <p>/<hN>";

    async function typographyMessages(jsx: string) {
      const [result] = await eslint.lintText(
        `const tone = "";\nexport function Probe() {\n  return ${jsx};\n}\n`,
        { filePath: "src/features/x/ConfigProbe.tsx" },
      );
      return result.messages
        .filter((message) => message.ruleId === "no-restricted-syntax")
        .map((message) => message.message)
        .filter((message) => message.startsWith(TYPOGRAPHY) || message.startsWith(RAW_TAG));
    }

    it("reports <p className=\"text-sm\"> twice: raw tag and size class (STD-08 AC 2, 3)", async () => {
      const messages = await typographyMessages('<p className="text-sm">x</p>');

      expect(messages).toHaveLength(2);
      expect(messages.some((message) => message.startsWith(RAW_TAG))).toBe(true);
      expect(messages.some((message) => message.startsWith(TYPOGRAPHY))).toBe(true);
    });

    it("reports a weight class in a template literal (STD-08 AC 3)", async () => {
      expect(await typographyMessages("<span className={`px-2 ${tone} font-black`}>x</span>")).toEqual([
        expect.stringContaining("Heading/Text"),
      ]);
    });

    it("allows alignment, family and colour classes (STD-08 AC 3)", async () => {
      expect(
        await typographyMessages('<span className="text-center font-mono text-muted-foreground">x</span>'),
      ).toEqual([]);
    });
  });

  describe("local rules", () => {
    it.each([
      [60, []],
      [61, ["local/component-logic-cap"]],
    ])("with %i lines of logic before the return reports %j (STD-12 AC 3)", async (lines, expected) => {
      const logic = Array.from({ length: lines }, (_, i) => `  const v${i} = ${i};\n`).join("");
      const ruleIds = await ruleIdsFor(
        `export function Summary() {\n${logic}  return <span>{v0}</span>;\n}\n`,
      );

      expect(ruleIds.filter((id) => id === "local/component-logic-cap")).toEqual(expected);
    });

    it("reports an IIFE in a component's JSX (STD-12 AC 4)", async () => {
      const ruleIds = await ruleIdsFor(
        "export function Last() {\n  return <span>{(() => 1)()}</span>;\n}\n",
      );

      expect(ruleIds).toContain("local/no-jsx-iife");
    });
  });
});
