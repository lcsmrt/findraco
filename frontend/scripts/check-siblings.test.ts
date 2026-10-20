import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findContainersWithMarkup, findMissingStories, findMissingTests } from "./check-siblings.ts";
import { criticalModules } from "./testTable.ts";

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

  it("passes a base/ primitive without a story (CAL-07)", () => {
    write("components/button/base/Button.tsx");

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

  it("does not exempt a view that only renders router components (STD-10 AC 1)", () => {
    write(
      "app/layout/TabRowView.tsx",
      'import { Link } from "react-router-dom";\nexport function TabRowView() { return <nav><Link to="/">Home</Link></nav>; }\n',
    );

    expect(findMissingStories(srcDir)).toEqual(["app/layout/TabRowView.tsx"]);
    expect(findContainersWithMarkup(srcDir)).toEqual([]);
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

  it("treats a component using our helper built on a router hook as a container (STD-10 AC 1)", () => {
    write("app/layout/activeTab.ts", 'import { useLocation } from "react-router-dom";\nexport function useActiveTab() { return useLocation().pathname; }\n');
    write(
      "app/layout/TabRow.tsx",
      'import { useActiveTab } from "./activeTab";\nexport function TabRow() { useActiveTab(); return null; }\n',
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
  const logic = "export function f(a: boolean) { return a ? 1 : 0; }\n";

  const rowModules = [
    ["form schema and mapper", "features/plans/components/inviteForm.ts"],
    ["form schemas", "features/auth/authForms.ts"],
    ["pure computation under utils/", "features/overview/utils/scaleLimits.ts"],
    ["service hook", "api/services/usePlanService.ts"],
    ["API client", "api/clients/accessToken.ts"],
    ["URL params", "features/overview/filters/overviewParams.ts"],
    ["shared hook", "hooks/usePlanPermissions.ts"],
  ];

  it.each(rowModules)("names a %s module with logic and no sibling test (CAL-04)", (_, modulePath) => {
    write(modulePath, logic);

    expect(findMissingTests(srcDir)).toEqual([modulePath]);
  });

  it.each(rowModules)("passes a %s module with a sibling test (CAL-04)", (_, modulePath) => {
    write(modulePath, logic);
    write(modulePath.replace(/\.ts$/, ".test.ts"), "");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it.each(criticalModules)("names the critical module %s without a sibling test even with no logic (CAL-02)", (modulePath) => {
    write(modulePath, "export const PLACEHOLDER = 1;\n");

    expect(findMissingTests(srcDir)).toEqual([modulePath]);
  });

  it("passes a critical module with a sibling .test.tsx (CAL-02)", () => {
    write("utils/money.ts", "export const PLACEHOLDER = 1;\n");
    write("utils/money.test.tsx", "");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("passes a logic module that matches no row (CAL-03)", () => {
    write("features/overview/components/spendingRows.ts", logic);
    write("features/plans/usePlanList.ts", logic);
    write("api/services/queryKeys.ts", logic);

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("passes a row module with nothing to test: types, constants, a branchless wrapper (CAL-02)", () => {
    write("api/clients/plan.ts", "export type Role = 'OWNER' | 'VIEWER';\nexport type Maybe<T> = T extends null ? never : T;\n");
    write("utils/paths.ts", "export const PATHS = { home: '/' } as const;\nexport const STALE_MS = 5 * 60 * 1000;\n");
    write("hooks/useDebounce.ts", "import { useDeferredValue } from 'react';\nexport function useDebounce<T>(v: T) { return useDeferredValue(v); }\n");

    expect(findMissingTests(srcDir)).toEqual([]);
  });

  it("exempts *.handlers.ts, src/test/** and .d.ts inside a row, even with logic (CAL-02)", () => {
    write("api/utils/paged.handlers.ts", logic);
    write("test/utils/scenarios.ts", logic);
    write("api/clients/axios.d.ts", "declare const flag: boolean;\n");

    expect(findMissingTests(srcDir)).toEqual([]);
  });
});
