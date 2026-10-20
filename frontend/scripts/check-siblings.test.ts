import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findContainersWithMarkup, findMissingStories, findMissingTests } from "./check-siblings.ts";

let srcDir: string;

function write(relativePath: string, content = "export function Probe() { return null; }\n") {
  const filePath = path.join(srcDir, relativePath);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

beforeEach(() => {
  srcDir = mkdtempSync(path.join(tmpdir(), "check-siblings-"));
});

afterEach(() => {
  rmSync(srcDir, { recursive: true, force: true });
});

describe("findMissingStories", () => {
  it("names a presentational component without a sibling story (STD-10 AC 1, 2)", () => {
    write("components/card/Card.tsx");

    expect(findMissingStories(srcDir)).toEqual(["components/card/Card.tsx"]);
  });

  it("passes a presentational component with a sibling story (STD-10 AC 1)", () => {
    write("components/card/Card.tsx");
    write("components/card/Card.stories.tsx");

    expect(findMissingStories(srcDir)).toEqual([]);
  });

  it.each([
    ['import { useGetSummary } from "@/api/services/dashboardService";'],
    ['import { useAuth } from "@/app/providers/auth/useAuth";'],
    ['import { useNavigate } from "react-router-dom";'],
  ])("exempts a container that imports %s (STD-10 AC 1)", (importLine) => {
    write("features/overview/OverviewPage.tsx", `${importLine}\nexport function OverviewPage() { return null; }\n`);

    expect(findMissingStories(srcDir)).toEqual([]);
  });

  it("does not exempt a type-only import, which brings no data or effects (STD-10 AC 1)", () => {
    write(
      "features/overview/SummaryCards.tsx",
      'import type { Summary } from "@/api/services/dashboardService";\nexport function SummaryCards(_: { summary: Summary }) { return null; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual(["features/overview/SummaryCards.tsx"]);
  });

  it("ignores src/index.tsx, src/test/**, tests, stories and .ts modules (STD-10 AC 1)", () => {
    write("index.tsx");
    write("test/renderWithProviders.tsx");
    write("features/overview/OverviewPage.test.tsx");
    write("features/overview/Orphan.stories.tsx");
    write("utils/money.ts");

    expect(findMissingStories(srcDir)).toEqual([]);
  });
});

describe("container detection through real paths and our hooks", () => {
  it("resolves a relative import into app/providers (STD-10 AC 1)", () => {
    write("app/providers/useTheme.ts", "export function useTheme() { return 'dark'; }\n");
    write(
      "app/providers/ThemeProvider.tsx",
      'import { useTheme } from "./useTheme";\nexport function ThemeProvider() { useTheme(); return null; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual([]);
  });

  it("treats a component calling our hook built on a service as a container (STD-10 AC 1)", () => {
    write("api/services/planService.ts", "export function useGetPlans() { return []; }\n");
    write(
      "features/plans/usePlanList.ts",
      'import { useGetPlans } from "@/api/services/planService";\nexport function usePlanList() { return useGetPlans(); }\n',
    );
    write(
      "features/plans/PlansPage.tsx",
      'import { usePlanList } from "./usePlanList";\nexport function PlansPage() { usePlanList(); return null; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual([]);
  });

  it("follows a chain of our modules through an import cycle (STD-10 AC 1)", () => {
    write("features/plans/a.ts", 'import { b } from "./b";\nimport { useNavigate } from "react-router-dom";\nexport const a = [b, useNavigate];\n');
    write("features/plans/b.ts", 'import { a } from "./a";\nexport const b = () => a;\n');
    write("features/plans/usePlanRoute.ts", 'import { b } from "./b";\nexport function usePlanRoute() { return b; }\n');
    write(
      "features/plans/PlanRoute.tsx",
      'import { usePlanRoute } from "./usePlanRoute";\nexport function PlanRoute() { usePlanRoute(); return null; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual([]);
  });

  it("still asks a story of a component that only renders a container (STD-10 AC 1)", () => {
    write(
      "features/plans/PlansPage.tsx",
      'import { useNavigate } from "react-router-dom";\nexport function PlansPage() { useNavigate(); return null; }\n',
    );
    write(
      "features/plans/PlansSection.tsx",
      'import { PlansPage } from "./PlansPage";\nexport function PlansSection() { return <PlansPage />; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual(["features/plans/PlansSection.tsx"]);
  });
});

describe("findContainersWithMarkup", () => {
  it("names a container that renders an intrinsic element, with the element (STD-10 AC 4)", () => {
    write(
      "features/overview/OverviewPage.tsx",
      'import { useNavigate } from "react-router-dom";\nexport function OverviewPage() { useNavigate(); return <div><span>Total</span></div>; }\n',
    );

    expect(findContainersWithMarkup(srcDir)).toEqual([
      { file: "features/overview/OverviewPage.tsx", elements: ["div", "span"] },
    ]);
  });

  it("passes a container that renders only components and fragments (STD-10 AC 4)", () => {
    write(
      "features/overview/OverviewPage.tsx",
      'import { useNavigate } from "react-router-dom";\nimport { OverviewView } from "./OverviewView";\n' +
        "export function OverviewPage() { useNavigate(); return <><OverviewView title=\"Total\" /></>; }\n",
    );
    write("features/overview/OverviewView.tsx", "export function OverviewView() { return <div>Total</div>; }\n");

    expect(findContainersWithMarkup(srcDir)).toEqual([]);
  });
});

describe("findMissingTests", () => {
  it.each([
    ["if", "export function f(a: number) { if (a > 0) { return 1; } return 0; }"],
    ["a ternary", "export function f(a: boolean) { return a ? 1 : 0; }"],
    ["switch", "export function f(a: string) { switch (a) { case 'x': return 1; default: return 0; } }"],
    ["&& as a value", "export function f(a: boolean, b: boolean) { return a && b; }"],
    ["|| as a value", "export function f(a: string) { return a || 'none'; }"],
    ["?? as a value", "export function f(a?: string) { return a ?? 'none'; }"],
    ["??= assignment", "export function f(a: { b?: number }) { a.b ??= 1; return a; }"],
    ["a for loop", "export function f(xs: number[]) { for (let i = 0; i < xs.length; i = xs[i]) { xs.pop(); } }"],
    ["a for-of loop", "export function f(xs: number[]) { let last = 0; for (const x of xs) { last = x; } return last; }"],
    ["a for-in loop", "export function f(o: object) { const keys = []; for (const k in o) { keys.push(k); } return keys; }"],
    ["a while loop", "export function f() { const xs = [1]; while (xs.pop()) { /* drain */ } }"],
    ["a do-while loop", "export function f(read: () => boolean) { do { /* poll */ } while (read()); }"],
    ["try/catch", "export function f(s: string) { try { return JSON.parse(s); } catch { return null; } }"],
  ])("names a module with %s and no sibling test (STD-11 AC 1, 2)", (_, content) => {
    write("utils/probe.ts", `${content}\n`);

    expect(findMissingTests(srcDir)).toEqual(["utils/probe.ts"]);
  });

  it.each([
    ["arithmetic on a non-literal operand", "export function cents(reais: number) { return reais * 100; }"],
    ["arithmetic between two names", "export const total = (a: number, b: number) => a + b;"],
    ["an increment", "export function next(state: { n: number }) { state.n++; return state; }"],
    ["a compound assignment", "export function add(state: { n: number }, by: number) { state.n += by; return state; }"],
  ])("names a module with %s (STD-11 AC 1, 2)", (_, content) => {
    write("utils/probe.ts", `${content}\n`);

    expect(findMissingTests(srcDir)).toEqual(["utils/probe.ts"]);
  });

  it.each([
    ["map", "export function ids(xs: { id: number }[]) { return xs.map((x) => x.id); }"],
    ["filter with a named callback", "function isPositive(n: number) { return n > 0; }\nexport const keep = (xs: number[]) => xs.filter(isPositive);"],
    ["reduce", "export function sum(xs: number[]) { return xs.reduce((a, b) => Math.max(a, b), 0); }"],
    ["forEach", "export function clear(keys: string[]) { keys.forEach((k) => localStorage.removeItem(k)); }"],
  ])("names a module with an iteration callback: %s (STD-11 AC 1, 2)", (_, content) => {
    write("utils/probe.ts", `${content}\n`);

    expect(findMissingTests(srcDir)).toEqual(["utils/probe.ts"]);
  });

  it("passes a logic module with a sibling .test.ts or .test.tsx (STD-11 AC 1)", () => {
    write("utils/a.ts", "export function f(a: boolean) { return a ? 1 : 0; }\n");
    write("utils/a.test.ts", "");
    write("hooks/useB.ts", "export function useB(a: boolean) { return a ? 1 : 0; }\n");
    write("hooks/useB.test.tsx", "");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("exempts a type-only module, including conditional and union types (STD-11 AC 1)", () => {
    write(
      "api/dtos/plan.ts",
      "export type Role = 'OWNER' | 'VIEWER';\n" +
        "export type Maybe<T> = T extends null ? never : T;\n" +
        "export interface Plan { id: number; role: Role }\n",
    );

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("exempts a constant-only module, literal arithmetic included (STD-11 AC 1)", () => {
    write(
      "app/routing/paths.ts",
      "export const PATHS = { home: '/', login: '/login' } as const;\nexport const STALE_MS = 5 * 60 * 1000;\n",
    );

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("exempts a branchless wrapper (STD-11 AC 1)", () => {
    write("lib/mergeClasses.ts", "import { clsx } from 'clsx';\nexport function cn(...inputs: string[]) { return clsx(inputs); }\n");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("exempts *.handlers.ts, src/test/** and .d.ts even with logic (STD-11 AC 1)", () => {
    const logic = "export function f(a: boolean) { return a ? 1 : 0; }\n";
    write("api/services/planService.handlers.ts", logic);
    write("test/scenarios.ts", logic);
    write("vite-env.d.ts", "declare const flag: boolean;\n");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("names every offending module, sorted (STD-11 AC 2)", () => {
    write("utils/z.ts", "export const z = (a: number) => a - 1;\n");
    write("api/utils/a.ts", "export const a = (b?: string) => b ?? '';\n");

    expect(findMissingTests(srcDir)).toEqual(["api/utils/a.ts", "utils/z.ts"]);
  });
});
