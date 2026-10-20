// Which modules must have a sibling unit test, decided by path and file name only. Classifying by
// content made every `.map` demand a test; a path rule stays mechanical. Paths are relative to `src/`.

// An error in one of these writes wrong data or drops the session without the user noticing, so each
// needs its own test even without logic, and its own tests hold it to the branch threshold.
export const criticalModules = [
  "utils/money.ts",
  "components/input/currencyDigits.ts",
  "features/transactions/components/transactionForm.ts",
  "features/categories/components/categoryForm.ts",
  "api/clients/findracoApi.ts",
];

export type UnitRow = {
  name: string;
  pattern: RegExp;
};

export const unitRows: UnitRow[] = [
  { name: "business rule: form schema and mapper", pattern: /(^|\/)[^/]+Forms?\.ts$/ },
  { name: "business rule: pure computation", pattern: /(^|\/)utils\/.+\.ts$/ },
  { name: "service hook", pattern: /^api\/services\/use[^/]+Service\.ts$/ },
  { name: "API client", pattern: /^api\/clients\/[^/]+\.ts$/ },
  { name: "URL params", pattern: /(^|\/)[^/]+Params\.ts$/ },
  { name: "shared hook", pattern: /^hooks\/[^/]+\.ts$/ },
];

export function isCritical(relativePath: string) {
  return criticalModules.includes(relativePath);
}

export function needsUnitTest(relativePath: string) {
  return isCritical(relativePath) || unitRows.some(({ pattern }) => pattern.test(relativePath));
}
