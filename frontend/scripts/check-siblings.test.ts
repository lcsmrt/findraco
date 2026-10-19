import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findContainersWithMarkup, findMissingStories } from "./check-siblings.ts";

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
    write("features/overview/OverviewTab.tsx", `${importLine}\nexport function OverviewTab() { return null; }\n`);

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
    write("features/overview/OverviewTab.test.tsx");
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
      "features/overview/OverviewTab.tsx",
      'import { useNavigate } from "react-router-dom";\nexport function OverviewTab() { useNavigate(); return <div><span>Total</span></div>; }\n',
    );

    expect(findContainersWithMarkup(srcDir)).toEqual([
      { file: "features/overview/OverviewTab.tsx", elements: ["div", "span"] },
    ]);
  });

  it("passes a container that renders only components and fragments (STD-10 AC 4)", () => {
    write(
      "features/overview/OverviewTab.tsx",
      'import { useNavigate } from "react-router-dom";\nimport { OverviewView } from "./OverviewView";\n' +
        "export function OverviewTab() { useNavigate(); return <><OverviewView title=\"Total\" /></>; }\n",
    );
    write("features/overview/OverviewView.tsx", "export function OverviewView() { return <div>Total</div>; }\n");

    expect(findContainersWithMarkup(srcDir)).toEqual([]);
  });
});
