import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findMissingStories } from "./check-siblings.ts";

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
