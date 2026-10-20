import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { isCritical, needsUnitTest } from "./testTable.ts";

// A component that imports one of these, directly or through one of our modules built on them,
// takes data or causes effects from outside: a container. It fetches and passes down, so its visual
// lives in a view that has the story.
const containerDirs = ["api/services", "app/providers"];
// The router's hooks read app state, and so do `Routes` and `Outlet`, which render whatever the
// current location resolves to. Its other components (`Link`, `NavLink`, `Navigate`) only render, so
// a view using them stays presentational and its story just wraps it in a router.
const routerPackage = "react-router-dom";
const routerStateComponents = new Set(["Routes", "Outlet"]);

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

type RuntimeImport = {
  specifier: string;
  // Names the statement binds at runtime; `undefined` when it binds the whole module (namespace,
  // default, side-effect or `export *`), which could reach anything in it.
  names: string[] | undefined;
};

function runtimeNames(bindings: ts.NamedImportBindings | ts.NamedExportBindings | undefined) {
  if (!bindings || !(ts.isNamedImports(bindings) || ts.isNamedExports(bindings))) {
    return undefined;
  }
  return bindings.elements.filter((element) => !element.isTypeOnly).map((element) => (element.propertyName ?? element.name).text);
}

// Type-only imports bring no data or effects, so they never make a file a container.
function runtimeImports(source: ts.SourceFile): RuntimeImport[] {
  return source.statements.flatMap((statement) => {
    if (ts.isImportDeclaration(statement) && !statement.importClause?.isTypeOnly && ts.isStringLiteral(statement.moduleSpecifier)) {
      const clause = statement.importClause;
      const names = clause && !clause.name ? runtimeNames(clause.namedBindings) : undefined;
      return [{ specifier: statement.moduleSpecifier.text, names }];
    }
    if (
      ts.isExportDeclaration(statement) &&
      !statement.isTypeOnly &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      return [{ specifier: statement.moduleSpecifier.text, names: runtimeNames(statement.exportClause) }];
    }
    return [];
  });
}

function importsRouterHook({ specifier, names }: RuntimeImport) {
  if (specifier !== routerPackage && !specifier.startsWith(`${routerPackage}/`)) {
    return false;
  }
  return names === undefined || names.some((name) => name.startsWith("use") || routerStateComponents.has(name));
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
    const result = runtimeImports(parse(filePath)).some((runtimeImport) => {
      if (importsRouterHook(runtimeImport)) {
        return true;
      }
      const { specifier } = runtimeImport;
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

// A `base/` primitive's story is catalog only and runs no test, so the gate does not demand one.
function isBasePrimitive(srcDir: string, filePath: string) {
  return /(^|\/)base\//.test(toRelative(srcDir, filePath));
}

/** Component files under `srcDir` that need a sibling story and lack one, relative to `srcDir`. */
export function findMissingStories(srcDir: string): string[] {
  return classify(srcDir)
    .filter(({ filePath, container }) => !container && !isBasePrimitive(srcDir, filePath))
    .filter(({ filePath }) => !existsSync(filePath.replace(/\.tsx$/, ".stories.tsx")))
    .map(({ filePath }) => toRelative(srcDir, filePath));
}

// Callbacks that run once per element: logic even when the callback itself has no branch.
const iterationMethods = new Set([
  "map",
  "flatMap",
  "filter",
  "reduce",
  "reduceRight",
  "forEach",
  "some",
  "every",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "sort",
  "toSorted",
]);

const logicalOperators = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
]);

const arithmeticOperators = new Set([
  ts.SyntaxKind.PlusToken,
  ts.SyntaxKind.MinusToken,
  ts.SyntaxKind.AsteriskToken,
  ts.SyntaxKind.SlashToken,
  ts.SyntaxKind.PercentToken,
  ts.SyntaxKind.AsteriskAsteriskToken,
  ts.SyntaxKind.PlusEqualsToken,
  ts.SyntaxKind.MinusEqualsToken,
  ts.SyntaxKind.AsteriskEqualsToken,
  ts.SyntaxKind.SlashEqualsToken,
  ts.SyntaxKind.PercentEqualsToken,
  ts.SyntaxKind.AsteriskAsteriskEqualsToken,
]);

const decisionKinds = new Set([
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ConditionalExpression,
  ts.SyntaxKind.SwitchStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.TryStatement,
]);

// A literal, or arithmetic made only of literals (`5 * 60 * 1000`): a constant, not a computation.
function isLiteral(node: ts.Expression): boolean {
  if (ts.isParenthesizedExpression(node)) {
    return isLiteral(node.expression);
  }
  if (ts.isBinaryExpression(node) && arithmeticOperators.has(node.operatorToken.kind)) {
    return isLiteral(node.left) && isLiteral(node.right);
  }
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
    return isLiteral(node.operand);
  }
  return ts.isNumericLiteral(node) || ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function isLogicNode(node: ts.Node) {
  if (decisionKinds.has(node.kind)) {
    return true;
  }
  if (ts.isBinaryExpression(node)) {
    const operator = node.operatorToken.kind;
    if (logicalOperators.has(operator)) {
      return true;
    }
    return arithmeticOperators.has(operator) && !(isLiteral(node.left) && isLiteral(node.right));
  }
  if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
    return node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken;
  }
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    iterationMethods.has(node.expression.name.text) &&
    node.arguments.length > 0
  );
}

// A decision point, arithmetic on non-literal operands, or an iteration callback. Inside a table row it
// still spares a module with nothing to test (types, constants, a branchless wrapper). Types emit no
// code, so they are never searched.
function hasLogic(source: ts.SourceFile) {
  function visit(node: ts.Node): boolean {
    if (ts.isTypeNode(node) || ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      return false;
    }
    return isLogicNode(node) || (ts.forEachChild(node, visit) ?? false);
  }
  return visit(source);
}

function isModuleFile(srcDir: string, filePath: string) {
  const relative = toRelative(srcDir, filePath);
  if (!relative.endsWith(".ts") || relative.startsWith("test/")) {
    return false;
  }
  // MSW handler factories are test support (decision 3), exercised by every test that uses them.
  return !/\.(test|d|handlers)\.ts$/.test(relative);
}

function hasSiblingTest(filePath: string) {
  const base = filePath.replace(/\.ts$/, "");
  return existsSync(`${base}.test.ts`) || existsSync(`${base}.test.tsx`);
}

// The test table decides which modules need a test; a module outside every row needs none, logic or not.
function requiresTest(srcDir: string, filePath: string) {
  const relative = toRelative(srcDir, filePath);
  return needsUnitTest(relative) && (isCritical(relative) || hasLogic(parse(filePath)));
}

/** Modules under `srcDir` the test table requires a test for and that lack a sibling `.test.ts(x)`. */
export function findMissingTests(srcDir: string): string[] {
  return listFiles(srcDir)
    .filter((filePath) => isModuleFile(srcDir, filePath))
    .sort()
    .filter((filePath) => !hasSiblingTest(filePath) && requiresTest(srcDir, filePath))
    .map((filePath) => toRelative(srcDir, filePath));
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
  const missingTests = findMissingTests(srcDir);
  const missingStories = findMissingStories(srcDir);
  const containersWithMarkup = findContainersWithMarkup(srcDir);
  if (missingTests.length > 0) {
    console.error("Modules the test table requires a test for, without a sibling .test.ts:");
    for (const file of missingTests) {
      console.error(`  src/${file}`);
    }
  }
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
  if (missingTests.length > 0 || missingStories.length > 0 || containersWithMarkup.length > 0) {
    process.exitCode = 1;
  }
}

// Runs only as `node scripts/check-siblings.ts`; the test imports the functions without a report.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
