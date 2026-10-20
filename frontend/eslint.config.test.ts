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

async function ruleIdsFor(code: string, filePath = componentPath) {
  const [result] = await eslint.lintText(code, { filePath });
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

  describe("component files export only components", () => {
    it("sets react-refresh/only-export-components to error, constants allowed (STD-02 AC 5)", () => {
      expect(componentConfig.rules["react-refresh/only-export-components"]).toEqual([
        2,
        { allowConstantExport: true },
      ]);
    });

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
    const interfaceProbe = "export interface Probe {\n  id: number;\n}\n";

    it.each(["src/components/ConfigProbe.tsx", "src/utils/configProbe.ts"])(
      "enforces type over interface in %s (STD-02 AC 4)",
      async (filePath) => {
        const config = await eslint.calculateConfigForFile(filePath);
        const ruleIds = await ruleIdsFor(interfaceProbe, filePath);

        expect(config.rules["@typescript-eslint/consistent-type-definitions"]).toEqual([2, "type"]);
        expect(ruleIds).toContain("@typescript-eslint/consistent-type-definitions");
      },
    );

    it.each(["src/components/ConfigProbe.tsx", "src/utils/configProbe.ts"])(
      "enforces function declarations, typed arrows included, in %s (STD-09 AC 1)",
      async (filePath) => {
        const config = await eslint.calculateConfigForFile(filePath);

        expect(config.rules["func-style"]).toEqual([
          2,
          "declaration",
          { allowArrowFunctions: false, allowTypeAnnotation: false, overrides: { namedExports: "declaration" } },
        ]);
      },
    );

    it.each([
      ["an exported component arrow", "export const Probe = () => null;\n"],
      ["a top-level helper arrow", "const toProbe = (value: number) => value + 1;\n\nexport { toProbe };\n"],
      ["a function expression", "const toProbe = function (value: number) {\n  return value + 1;\n};\n\nexport { toProbe };\n"],
      ["an arrow with a type annotation", "const toProbe: (value: number) => number = (value) => value + 1;\n\nexport { toProbe };\n"],
      [
        "a handler arrow inside a component",
        "export function Probe() {\n  const handleClick = () => undefined;\n  return <button onClick={handleClick} />;\n}\n",
      ],
    ])("reports %s (STD-09 AC 1)", async (_label, code) => {
      const ruleIds = await ruleIdsFor(code);

      expect(ruleIds).toContain("func-style");
    });

    it("allows function declarations with inline arrow callbacks (STD-09 AC 1)", async () => {
      const ruleIds = await ruleIdsFor(
        "export function Probe({ values }: { values: number[] }) {\n  function handleClick() {\n    return values.map((value) => value + 1);\n  }\n  return <button onClick={() => handleClick()} />;\n}\n",
      );

      expect(ruleIds).not.toContain("func-style");
    });

    it("allows an interface in a *.d.ts library augmentation (STD-02 AC 4)", async () => {
      const filePath = "src/api/clients/configProbe.d.ts";
      const augmentation =
        'import "axios";\n\ndeclare module "axios" {\n  interface AxiosRequestConfig {\n    probe?: boolean;\n  }\n}\n';
      const config = await eslint.calculateConfigForFile(filePath);
      const ruleIds = await ruleIdsFor(augmentation, filePath);

      // A later block that sets only the severity keeps the earlier options, so check the severity.
      expect(config.rules["@typescript-eslint/consistent-type-definitions"][0]).toBe(0);
      expect(ruleIds).not.toContain("@typescript-eslint/consistent-type-definitions");
    });
  });

  describe("test support only from tests", () => {
    const testSupportGroup = ["**/*.handlers", "@/test/*"];

    function restrictedGroups(config: typeof componentConfig): unknown {
      const [, options] = config.rules["no-restricted-imports"] ?? [];
      return options?.patterns?.map((pattern: { group: string[] }) => pattern.group);
    }

    it.each(["src/features/x/Foo.tsx", "src/features/x/Foo.stories.tsx"])(
      "restricts handler factories and @/test/* in %s (STD-04 AC 3)",
      async (filePath) => {
        const config = await eslint.calculateConfigForFile(filePath);

        expect(config.rules["no-restricted-imports"][0]).toBe(2);
        expect(restrictedGroups(config)).toContainEqual(testSupportGroup);
      },
    );

    it.each(["./foo.handlers", "@/api/services/auth.handlers", "@/test/server"])(
      "reports an import of %s from a feature file (STD-04 AC 3)",
      async (specifier) => {
        const ruleIds = await ruleIdsFor(
          `import { probe } from "${specifier}";\n\nexport const value = probe;\n`,
          "src/features/x/Foo.tsx",
        );

        expect(ruleIds).toContain("no-restricted-imports");
      },
    );

    it.each(["src/features/x/Foo.test.tsx", "src/test/renderWithProviders.tsx"])(
      "leaves %s free to import test support (STD-04 AC 3)",
      async (filePath) => {
        const config = await eslint.calculateConfigForFile(filePath);
        const ruleIds = await ruleIdsFor(
          'import { server } from "@/test/server";\nimport { probeHandlers } from "./probe.handlers";\n\nexport const value = [server, probeHandlers];\n',
          filePath,
        );

        expect(restrictedGroups(config) ?? []).not.toContainEqual(testSupportGroup);
        expect(ruleIds).not.toContain("no-restricted-imports");
      },
    );
  });

  describe("layered imports", () => {
    // Each fragment is identified by its group (or regex), so a layer that loses one goes red.
    const testSupport = "**/*.handlers,@/test/*";
    const appInternals = "^@/app/(?!providers/|routing/paths$)";
    const crossFeature = "@/features/*";
    const appAny = "@/app/*";
    const api = "@/api/*";

    function fragmentsOf(config: typeof componentConfig): string[] {
      const [severity, options] = config.rules["no-restricted-imports"] ?? [];
      if (severity !== 2) return [];
      return options.patterns.map(
        (pattern: { group?: string[]; regex?: string }) => pattern.regex ?? pattern.group?.join(","),
      );
    }

    it.each([
      ["src/hooks/configProbe.ts", [testSupport, appInternals, crossFeature]],
      ["src/hooks/configProbe.test.ts", [appInternals, crossFeature]],
      ["src/utils/configProbe.ts", [testSupport, appInternals, crossFeature]],
      ["src/lib/configProbe.ts", [testSupport, appInternals, crossFeature]],
      ["src/api/services/configProbe.ts", [testSupport, appInternals, crossFeature]],
      ["src/test/configProbe.ts", [appInternals, crossFeature]],
      ["src/app/home/ConfigProbe.tsx", [testSupport]],
      ["src/app/home/ConfigProbe.test.tsx", []],
      ["src/features/x/ConfigProbe.tsx", [testSupport, appInternals, crossFeature]],
      ["src/features/x/ConfigProbe.test.tsx", [appInternals, crossFeature]],
      ["src/components/x/ConfigProbe.tsx", [testSupport, appInternals, crossFeature]],
      ["src/components/x/ConfigProbe.test.tsx", [appInternals, crossFeature]],
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
      ["src/features/overview/ConfigProbe.test.tsx", "@/features/plans/PlansPage", true, "AC 5"],
      ["src/features/overview/ConfigProbe.tsx", "./components/SummaryCards", false, "AC 5"],
      ["src/components/x/ConfigProbe.tsx", "@/features/plans/PlansPage", true, "AC 6"],
      ["src/components/x/ConfigProbe.tsx", "@/app/home/homeParams", true, "AC 6"],
      ["src/components/x/ConfigProbe.tsx", "@/app/providers/useTheme", false, "AC 6"],
      ["src/components/x/ConfigProbe.tsx", "@/app/routing/paths", false, "AC 6"],
      ["src/components/x/ConfigProbe.tsx", "@/api/dtos", false, "AC 6"],
      ["src/components/x/base/ConfigProbe.tsx", "@/features/plans/PlansPage", true, "AC 7"],
      ["src/components/x/base/ConfigProbe.tsx", "@/app/providers/useTheme", true, "AC 7"],
      ["src/components/x/base/ConfigProbe.tsx", "@/app/routing/paths", true, "AC 7"],
      ["src/components/x/base/ConfigProbe.tsx", "@/api/dtos", true, "AC 7"],
      ["src/components/x/base/ConfigProbe.tsx", "@/lib/mergeClasses", false, "AC 7"],
      ["src/hooks/configProbe.ts", "@/features/plans/PlansPage", true, "C6"],
      ["src/utils/configProbe.ts", "@/features/transactions/filters/transactionParams", true, "C6"],
      ["src/lib/configProbe.ts", "@/features/auth/LoginPage", true, "C6"],
      ["src/api/services/configProbe.ts", "@/features/categories/CategoriesTab", true, "C6"],
      ["src/test/configProbe.ts", "@/features/overview/OverviewPage", true, "C6"],
      ["src/hooks/configProbe.ts", "@/app/layout/Navbar", true, "AC 8"],
      ["src/hooks/configProbe.ts", "@/app/routing/AppRouter", true, "AC 8"],
      ["src/hooks/configProbe.ts", "@/app/routing/paths", false, "AC 8"],
      ["src/hooks/configProbe.ts", "@/app/providers/usePlanContext", false, "AC 8"],
      ["src/app/home/ConfigProbe.tsx", "@/features/overview/OverviewPage", false, "AC 8"],
    ])("in %s, importing %s is restricted: %s (STD-05 %s)", async (filePath, specifier, restricted) => {
      expect(await restrictedImport(specifier, filePath)).toBe(restricted);
    });
  });

  describe("palette ban", () => {
    function syntaxMessages(config: typeof componentConfig): string[] {
      const [severity, ...selectors] = config.rules["no-restricted-syntax"] ?? [];
      if (severity !== 2) return [];
      return selectors.map((entry: { message: string }) => entry.message);
    }

    // Only the palette's messages: the typography fragment also reports some probes below.
    async function paletteMessages(code: string, filePath: string) {
      const [result] = await eslint.lintText(code, { filePath });
      return result.messages
        .filter((message) => message.ruleId === "no-restricted-syntax")
        .map((message) => message.message)
        .filter((message) => message.startsWith("Raw palette colour"));
    }

    // One path per layer of the syntax table, base/ included: a later layer block that forgot the
    // fragment would silently drop it for its files (design decision 1).
    it.each([
      "src/hooks/configProbe.ts",
      "src/utils/configProbe.ts",
      "src/features/x/ConfigProbe.tsx",
      "src/features/x/ConfigProbe.stories.tsx",
      "src/features/x/ConfigProbe.test.tsx",
      "src/components/x/ConfigProbe.tsx",
      "src/components/x/base/ConfigProbe.tsx",
      "src/components/x/base/configProbeVariants.ts",
      "src/app/home/ConfigProbe.tsx",
    ])("keeps the palette fragment active in %s (STD-06 AC 14)", async (filePath) => {
      const config = await eslint.calculateConfigForFile(filePath);
      const messages = syntaxMessages(config);

      expect(messages.filter((message) => message.startsWith("Raw palette colour"))).toHaveLength(2);
    });

    it.each([
      ['<span className="text-amber-600">late</span>', "a JSX class string"],
      ['<span className={cn("rounded", ok && "bg-green-100")}>ok</span>', "a cn() argument"],
      ["<span className={`px-2 ${tone} dark:border-red-500`}>x</span>", "a template literal"],
      ['<span className="hover:text-slate-700">x</span>', "a neutral grey behind a variant"],
    ])("reports %s, naming the tokens to use (STD-06 AC 14)", async (jsx) => {
      for (const filePath of ["src/features/x/ConfigProbe.tsx", "src/components/x/base/ConfigProbe.tsx"]) {
        const messages = await paletteMessages(
          `const ok = true;\nconst tone = "";\nfunction cn(...values: unknown[]) {\n  return values.join(" ");\n}\nexport function Probe() {\n  return ${jsx};\n}\n`,
          filePath,
        );

        expect(messages).toHaveLength(1);
        expect(messages[0]).toContain("text-warning");
        expect(messages[0]).toContain("text-success");
        expect(messages[0]).toContain("text-destructive");
      }
    });

    it.each([
      '<span className="text-warning bg-success/10 border-destructive">ok</span>',
      '<span className="bg-black/10 text-white">overlay</span>',
      '<span className="text-sm font-medium">plain</span>',
    ])("allows token, black/white and non-colour classes: %s (STD-06 AC 14)", async (jsx) => {
      const messages = await paletteMessages(
        `export function Probe() {\n  return ${jsx};\n}\n`,
        "src/features/x/ConfigProbe.tsx",
      );

      expect(messages).toEqual([]);
    });
  });
  describe("typography through Heading and Text", () => {
    const TYPOGRAPHY = "Size or weight class";
    const RAW_TAG = "Raw <p>/<hN>";

    function syntaxMessages(config: typeof componentConfig): string[] {
      const [severity, ...selectors] = config.rules["no-restricted-syntax"] ?? [];
      if (severity !== 2) return [];
      return selectors.map((entry: { message: string }) => entry.message);
    }

    async function typographyMessages(code: string, filePath: string) {
      const [result] = await eslint.lintText(code, { filePath });
      return result.messages
        .filter((message) => message.ruleId === "no-restricted-syntax")
        .map((message) => message.message)
        .filter((message) => message.startsWith(TYPOGRAPHY) || message.startsWith(RAW_TAG));
    }

    function probe(jsx: string) {
      return `const on = true;\nconst tone = "";\nfunction cn(...values: unknown[]) {\n  return values.join(" ");\n}\nexport function Probe() {\n  return ${jsx};\n}\n`;
    }

    // One path per layer of the syntax table: every layer outside base/ spreads both fragments, and
    // base/ keeps its primitives' own text styles (design decision 1).
    it.each([
      ["src/hooks/configProbe.ts", true],
      ["src/utils/configProbe.ts", true],
      ["src/features/x/ConfigProbe.tsx", true],
      ["src/features/x/ConfigProbe.stories.tsx", true],
      ["src/features/x/ConfigProbe.test.tsx", true],
      ["src/components/x/ConfigProbe.tsx", true],
      ["src/app/home/ConfigProbe.tsx", true],
      ["src/app/home/ConfigProbe.test.tsx", true],
      ["src/components/x/base/ConfigProbe.tsx", false],
      ["src/components/x/base/configProbeVariants.ts", false],
      ["src/components/x/base/ConfigProbe.stories.tsx", false],
    ])("in %s, the typography and raw-tag fragments are active: %s (STD-08 AC 2, 3)", async (filePath, active) => {
      const messages = syntaxMessages(await eslint.calculateConfigForFile(filePath));

      expect(messages.filter((message) => message.startsWith(TYPOGRAPHY))).toHaveLength(active ? 2 : 0);
      expect(messages.filter((message) => message.startsWith(RAW_TAG))).toHaveLength(active ? 1 : 0);
    });

    it("reports <p className=\"text-sm\"> in a feature twice: raw tag and size class (STD-08 AC 2, 3)", async () => {
      const messages = await typographyMessages(probe('<p className="text-sm">x</p>'), "src/features/x/ConfigProbe.tsx");

      expect(messages).toHaveLength(2);
      expect(messages.some((message) => message.startsWith(RAW_TAG))).toBe(true);
      expect(messages.some((message) => message.startsWith(TYPOGRAPHY))).toBe(true);
    });

    it.each(["<h1>x</h1>", "<h3>x</h3>", "<h6>x</h6>"])(
      "reports the raw heading %s (STD-08 AC 2)",
      async (jsx) => {
        const messages = await typographyMessages(probe(jsx), "src/features/x/ConfigProbe.tsx");

        expect(messages).toEqual([expect.stringContaining("<Heading level={n}")]);
      },
    );

    it.each([
      ['<span className="text-xs">x</span>', "the smallest size"],
      ['<span className="text-9xl">x</span>', "the largest size"],
      ['<span className="sm:text-base">x</span>', "a size behind a breakpoint"],
      ['<span className="text-[10rem]">x</span>', "an arbitrary size"],
      ['<span className="text-md">x</span>', "an undefined size"],
      ['<span className={cn("px-2", on && "font-thin")}>x</span>', "the lightest weight in a cn() argument"],
      ["<span className={`px-2 ${tone} font-black`}>x</span>", "the heaviest weight in a template literal"],
      ['<span className="text-sm/6">x</span>', "a size with a line-height modifier"],
    ])("reports %s: %s (STD-08 AC 3)", async (jsx) => {
      const messages = await typographyMessages(probe(jsx), "src/features/x/ConfigProbe.tsx");

      expect(messages).toEqual([expect.stringContaining("Heading/Text")]);
    });

    it.each([
      '<span className="text-left text-center text-right font-mono tabular-nums">x</span>',
      '<span className="text-muted-foreground text-destructive text-foreground/50">x</span>',
      '<span className="font-sans truncate text-balance">x</span>',
      '<div>x</div>',
    ])("allows alignment, family, colour and non-text classes: %s (STD-08 AC 3)", async (jsx) => {
      expect(await typographyMessages(probe(jsx), "src/features/x/ConfigProbe.tsx")).toEqual([]);
    });

    it("leaves base/ primitives free to style their own text (STD-08 AC 2, 3)", async () => {
      const messages = await typographyMessages(
        probe('<p className="text-sm font-medium">x</p>'),
        "src/components/x/base/ConfigProbe.tsx",
      );

      expect(messages).toEqual([]);
    });
  });

  describe("local rules", () => {
    it("sets local/component-logic-cap to error at 60 lines (STD-12 AC 3)", () => {
      expect(componentConfig.rules["local/component-logic-cap"]).toEqual([2, { max: 60 }]);
    });

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

    it("sets local/no-jsx-iife to error (STD-12 AC 4)", () => {
      expect(componentConfig.rules["local/no-jsx-iife"]).toEqual([2]);
    });

    it("reports an IIFE in a component's JSX (STD-12 AC 4)", async () => {
      const ruleIds = await ruleIdsFor(
        "export function Last() {\n  return <span>{(() => 1)()}</span>;\n}\n",
      );

      expect(ruleIds).toContain("local/no-jsx-iife");
    });
  });
});
