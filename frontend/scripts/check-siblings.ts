import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// A component that imports one of these takes data or causes effects from outside: a container.
// It fetches and passes down, so its visual (if any) lives in a view that has the story.
const containerModules = ["@/api/services", "@/app/providers", "react-router-dom"];

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function isContainerModule(specifier: string) {
  return containerModules.some(
    (module) => specifier === module || specifier.startsWith(`${module}/`),
  );
}

// Type-only imports bring no data or effects, so they do not make a file a container.
function importsContainerModule(filePath: string) {
  const source = ts.createSourceFile(filePath, readFileSync(filePath, "utf-8"), ts.ScriptTarget.Latest);
  return source.statements.some(
    (statement) =>
      ts.isImportDeclaration(statement) &&
      !statement.importClause?.isTypeOnly &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      isContainerModule(statement.moduleSpecifier.text),
  );
}

function needsStory(srcDir: string, filePath: string) {
  const relative = path.relative(srcDir, filePath).split(path.sep).join("/");
  if (!relative.endsWith(".tsx") || relative === "index.tsx" || relative.startsWith("test/")) {
    return false;
  }
  if (/\.(test|stories)\.tsx$/.test(relative)) {
    return false;
  }
  return !importsContainerModule(filePath);
}

/** Component files under `srcDir` that need a sibling story and lack one, relative to `srcDir`. */
export function findMissingStories(srcDir: string): string[] {
  return listFiles(srcDir)
    .filter((filePath) => needsStory(srcDir, filePath))
    .filter((filePath) => !existsSync(filePath.replace(/\.tsx$/, ".stories.tsx")))
    .map((filePath) => path.relative(srcDir, filePath).split(path.sep).join("/"))
    .sort();
}

function main() {
  const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
  const missingStories = findMissingStories(srcDir);
  if (missingStories.length === 0) {
    return;
  }
  console.error("Component files without a sibling .stories.tsx:");
  for (const file of missingStories) {
    console.error(`  src/${file}`);
  }
  process.exitCode = 1;
}

// Runs only as `node scripts/check-siblings.ts`; the test imports the functions without a report.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
