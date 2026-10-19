import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// A component that imports one of these, directly or through one of our modules built on them,
// takes data or causes effects from outside: a container. It fetches and passes down, so its visual
// lives in a view that has the story.
const containerDirs = ["api/services", "app/providers"];
const containerPackages = ["react-router-dom"];

export type ContainerWithMarkup = {
  file: string;
  elements: string[];
};

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function toRelative(srcDir: string, filePath: string) {
  return path.relative(srcDir, filePath).split(path.sep).join("/");
}

function parse(filePath: string) {
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, readFileSync(filePath, "utf-8"), ts.ScriptTarget.Latest, true, kind);
}

// Type-only imports bring no data or effects, so they never make a file a container.
function runtimeSpecifiers(source: ts.SourceFile) {
  return source.statements.flatMap((statement) => {
    if (ts.isImportDeclaration(statement) && !statement.importClause?.isTypeOnly) {
      return ts.isStringLiteral(statement.moduleSpecifier) ? [statement.moduleSpecifier.text] : [];
    }
    if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && statement.moduleSpecifier) {
      return ts.isStringLiteral(statement.moduleSpecifier) ? [statement.moduleSpecifier.text] : [];
    }
    return [];
  });
}

function createResolver(srcDir: string) {
  // `@/` is the project's alias for `src/` (tsconfig `paths`); the test points it at its own tree.
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    jsx: ts.JsxEmit.ReactJSX,
    paths: { "@/*": [path.join(srcDir, "*")] },
  };
  // An import that does not resolve still names where it points, so classify by that location;
  // `tsc` reports the broken import itself.
  function lexicalPath(specifier: string, fromFile: string) {
    if (specifier.startsWith("@/")) {
      return path.join(srcDir, specifier.slice(2));
    }
    return specifier.startsWith(".") ? path.resolve(path.dirname(fromFile), specifier) : undefined;
  }
  return function resolve(specifier: string, fromFile: string) {
    const resolved = ts.resolveModuleName(specifier, fromFile, options, ts.sys).resolvedModule;
    if (resolved && !resolved.isExternalLibraryImport) {
      return { path: path.resolve(resolved.resolvedFileName), exists: true };
    }
    const fallback = lexicalPath(specifier, fromFile);
    return fallback ? { path: fallback, exists: false } : undefined;
  };
}

function createContainerCheck(srcDir: string) {
  const resolve = createResolver(srcDir);
  const memo = new Map<string, boolean>();

  function inContainerDir(filePath: string) {
    const relative = toRelative(srcDir, filePath);
    return containerDirs.some((dir) => relative === dir || relative.startsWith(`${dir}/`));
  }

  // Follows our `.ts` modules (hooks and helpers) transitively; components (`.tsx`) are rendered,
  // not called, so importing one does not make a file a container. `visiting` stops import cycles.
  function reachesOutside(filePath: string, visiting: Set<string>): boolean {
    const known = memo.get(filePath);
    if (known !== undefined) {
      return known;
    }
    if (visiting.has(filePath)) {
      return false;
    }
    visiting.add(filePath);
    const result = runtimeSpecifiers(parse(filePath)).some((specifier) => {
      if (containerPackages.some((name) => specifier === name || specifier.startsWith(`${name}/`))) {
        return true;
      }
      const target = resolve(specifier, filePath);
      if (!target) {
        return false;
      }
      if (inContainerDir(target.path)) {
        return true;
      }
      const isOurModule = target.exists && /(?<!\.d)\.ts$/.test(target.path) && !path.relative(srcDir, target.path).startsWith("..");
      return isOurModule && reachesOutside(target.path, visiting);
    });
    visiting.delete(filePath);
    memo.set(filePath, result);
    return result;
  }

  return function isContainer(filePath: string) {
    return reachesOutside(filePath, new Set());
  };
}

function isComponentFile(srcDir: string, filePath: string) {
  const relative = toRelative(srcDir, filePath);
  if (!relative.endsWith(".tsx") || relative === "index.tsx" || relative.startsWith("test/")) {
    return false;
  }
  return !/\.(test|stories)\.tsx$/.test(relative);
}

function classify(srcDir: string) {
  const isContainer = createContainerCheck(srcDir);
  return listFiles(srcDir)
    .filter((filePath) => isComponentFile(srcDir, filePath))
    .sort()
    .map((filePath) => ({ filePath, container: isContainer(filePath) }));
}

/** Component files under `srcDir` that need a sibling story and lack one, relative to `srcDir`. */
export function findMissingStories(srcDir: string): string[] {
  return classify(srcDir)
    .filter(({ filePath, container }) => !container && !existsSync(filePath.replace(/\.tsx$/, ".stories.tsx")))
    .map(({ filePath }) => toRelative(srcDir, filePath));
}

// An intrinsic element is a lowercase JSX tag (`div`, `span`, `svg`); fragments have no tag at all.
function intrinsicElements(source: ts.SourceFile) {
  const tags = new Set<string>();
  function visit(node: ts.Node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName)) {
      const tag = node.tagName.text;
      if (/^[a-z]/.test(tag)) {
        tags.add(tag);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return [...tags].sort();
}

/** Containers that render HTML elements of their own instead of only components. */
export function findContainersWithMarkup(srcDir: string): ContainerWithMarkup[] {
  return classify(srcDir)
    .filter(({ container }) => container)
    .map(({ filePath }) => ({ file: toRelative(srcDir, filePath), elements: intrinsicElements(parse(filePath)) }))
    .filter(({ elements }) => elements.length > 0);
}

function main() {
  const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
  const missingStories = findMissingStories(srcDir);
  const containersWithMarkup = findContainersWithMarkup(srcDir);
  if (missingStories.length > 0) {
    console.error("Component files without a sibling .stories.tsx:");
    for (const file of missingStories) {
      console.error(`  src/${file}`);
    }
  }
  if (containersWithMarkup.length > 0) {
    console.error("Containers rendering HTML elements (split into a container and a view with a story):");
    for (const { file, elements } of containersWithMarkup) {
      console.error(`  src/${file} (${elements.map((tag) => `<${tag}>`).join(", ")})`);
    }
  }
  if (missingStories.length > 0 || containersWithMarkup.length > 0) {
    process.exitCode = 1;
  }
}

// Runs only as `node scripts/check-siblings.ts`; the test imports the functions without a report.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
