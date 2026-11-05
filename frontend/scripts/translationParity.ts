import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

type Resource = { [key: string]: string | Resource };

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;
const VARIABLE = /\{\{\s*([^\s,}]+)[^}]*\}\}/g;

function flatten(resource: Resource, prefix = ""): Map<string, string> {
  const flat = new Map<string, string>();
  for (const [name, value] of Object.entries(resource)) {
    const key = prefix === "" ? name : `${prefix}.${name}`;
    if (typeof value === "string") {
      flat.set(key, value);
    } else {
      for (const [nested, text] of flatten(value, key)) flat.set(nested, text);
    }
  }
  return flat;
}

function variablesOf(text: string): string[] {
  return [
    ...new Set([...text.matchAll(VARIABLE)].map((match) => match[1])),
  ].sort();
}

function pluralForms(keys: Iterable<string>): Map<string, Set<string>> {
  const groups = new Map<string, Set<string>>();
  for (const key of keys) {
    const suffix = PLURAL_SUFFIX.exec(key);
    if (suffix === null) continue;
    const base = key.slice(0, suffix.index);
    groups.set(base, (groups.get(base) ?? new Set()).add(suffix[1]));
  }
  return groups;
}

function compareKeys(
  sourceName: string,
  source: Map<string, string>,
  otherName: string,
  other: Map<string, string>,
) {
  const problems: string[] = [];
  for (const key of source.keys()) {
    if (!other.has(key))
      problems.push(
        `${otherName} is missing "${key}" (present in ${sourceName})`,
      );
  }
  return problems;
}

// Every problem found between two language files; an empty list means they are in parity: the same keys,
// the same `{{variables}}` in each text, and the same plural forms (`_one`, `_other`) for each counted text.
export function checkParity(
  source: Resource,
  other: Resource,
  names: [string, string] = ["en", "pt-BR"],
): string[] {
  const [sourceName, otherName] = names;
  const sourceFlat = flatten(source);
  const otherFlat = flatten(other);

  const problems = [
    ...compareKeys(sourceName, sourceFlat, otherName, otherFlat),
    ...compareKeys(otherName, otherFlat, sourceName, sourceFlat),
  ];

  for (const [key, text] of sourceFlat) {
    const translated = otherFlat.get(key);
    if (translated === undefined) continue;
    const expected = variablesOf(text).join(", ");
    const actual = variablesOf(translated).join(", ");
    if (expected !== actual) {
      problems.push(
        `"${key}" uses {{${actual}}} in ${otherName} but {{${expected}}} in ${sourceName}`,
      );
    }
  }

  for (const [name, flat] of [
    [sourceName, sourceFlat],
    [otherName, otherFlat],
  ] as const) {
    for (const [base, forms] of pluralForms(flat.keys())) {
      if (!forms.has("other"))
        problems.push(`${name} has plural "${base}" without its _other form`);
    }
  }
  const sourcePlurals = pluralForms(sourceFlat.keys());
  const otherPlurals = pluralForms(otherFlat.keys());
  for (const [base, forms] of sourcePlurals) {
    const otherForms = otherPlurals.get(base);
    if (otherForms === undefined) continue;
    const expected = [...forms].sort().join(", ");
    const actual = [...otherForms].sort().join(", ");
    if (expected !== actual) {
      problems.push(
        `plural "${base}" has the forms ${actual} in ${otherName} but ${expected} in ${sourceName}`,
      );
    }
  }
  return problems;
}

function readResource(name: string): Resource {
  return JSON.parse(
    readFileSync(new URL(`../src/i18n/${name}.json`, import.meta.url), "utf-8"),
  );
}

function main() {
  const problems = checkParity(readResource("en"), readResource("pt-BR"));
  for (const problem of problems) console.error(problem);
  if (problems.length > 0) process.exitCode = 1;
}

// Runs only as `node scripts/translationParity.ts`; the test imports the checker without a report.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
