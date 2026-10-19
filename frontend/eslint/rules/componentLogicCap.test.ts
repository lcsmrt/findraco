import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import { componentLogicCap } from "./componentLogicCap.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

/** `count` lines of code, one statement each. */
function logic(count: number): string {
  return Array.from({ length: count }, (_, i) => `  const v${i} = ${i};`).join("\n");
}

function component(name: string, body: string): string {
  return `function ${name}() {\n${body}\n  return <div />;\n}`;
}

/** A component that hands its JSX back through a variable instead of a literal in the `return`. */
function returnsVariable(body: string): string {
  return `function Summary() {\n${body}\n  const content = <span />;\n  return content;\n}`;
}

/** A component that hands its JSX back through a local render helper. */
function returnsCall(body: string): string {
  return `function Summary() {\n  function renderContent() {\n    return <span />;\n  }\n${body}\n  return renderContent();\n}`;
}

/** A component whose JSX comes from a render helper defined outside it, so its own body has none. */
function returnsModuleHelper(body: string): string {
  return `function renderSummary() {\n  return <span />;\n}\nfunction Summary() {\n${body}\n  return renderSummary();\n}`;
}

/** A component whose only JSX is a fragment. */
function returnsFragment(body: string): string {
  return `function Summary() {\n${body}\n  return <>{v0}</>;\n}`;
}

function tooLong(name: string, count: number) {
  return [{ messageId: "tooLong", data: { name, count: String(count), max: "60" } }];
}

ruleTester.run("local/component-logic-cap (STD-12 AC 3, 5)", componentLogicCap, {
  valid: [
    { name: "a component at 60 lines", code: component("Summary", logic(60)) },
    {
      name: "a non-component function over 60 lines",
      code: component("buildSummary", logic(80)),
    },
    {
      name: "a PascalCase function that returns no JSX, outside a .tsx file",
      code: `function Summary() {\n${logic(80)}\n  return null;\n}`,
    },
    {
      name: "blank and comment-only lines do not count",
      code: component(
        "Summary",
        `${logic(30)}\n\n  // Why the next block exists.\n  /* A block comment\n     over two lines. */\n\n${logic(30).replaceAll("const v", "const w")}`,
      ),
    },
    {
      name: "an expression-bodied arrow component counts 0",
      code: "const Summary = () => <div />;",
    },
    {
      name: "a component returning a JSX variable at 60 lines",
      code: returnsVariable(logic(59)),
    },
    {
      name: "a component returning a render call at 60 lines",
      code: returnsCall(logic(57)),
    },
    {
      name: "a component whose only JSX is a fragment, at 60 lines",
      code: returnsFragment(logic(60)),
    },
    {
      name: "a PascalCase function returning a call, with no JSX anywhere, outside a .tsx file",
      code: `function Summary() {\n${logic(80)}\n  return build();\n}`,
    },
    {
      name: "a component returning a module-level render helper at 60 lines, in a .tsx file",
      code: returnsModuleHelper(logic(60)),
      filename: "Summary.tsx",
    },
    {
      name: "a non-component function over 60 lines, in a .tsx file",
      code: `function buildSummary() {\n${logic(80)}\n  return null;\n}`,
      filename: "Summary.tsx",
    },
    {
      name: "the max is an option",
      code: component("Summary", logic(10)),
      options: [{ max: 10 }],
    },
  ],
  invalid: [
    {
      name: "a component returning a module-level render helper at 61 lines, in a .tsx file",
      code: returnsModuleHelper(logic(61)),
      filename: "Summary.tsx",
      errors: tooLong("Summary", 61),
    },
    {
      name: "a PascalCase function that returns no JSX, in a .tsx file",
      code: `function Summary() {\n${logic(61)}\n  return null;\n}`,
      filename: "Summary.tsx",
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component whose only JSX is a fragment, at 61 lines",
      code: returnsFragment(logic(61)),
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component returning a JSX variable at 61 lines",
      code: returnsVariable(logic(60)),
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component returning a render call at 61 lines",
      code: returnsCall(logic(58)),
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component at 61 lines",
      code: component("Summary", logic(61)),
      errors: tooLong("Summary", 61),
    },
    {
      name: "an early return counts as logic",
      code: component("Summary", `  if (!plan) return null;\n${logic(60)}`),
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component inside memo, named by its variable",
      code: `const Row = memo(() => {\n${logic(61)}\n  return <tr />;\n});`,
      errors: tooLong("Row", 61),
    },
    {
      name: "an arrow assigned to a PascalCase name",
      code: `const Summary = () => {\n${logic(61)}\n  return <div />;\n};`,
      errors: tooLong("Summary", 61),
    },
    {
      name: "a component returning JSX conditionally, counted to its last top-level return",
      code: `function Summary({ open }) {\n${logic(61)}\n  return open ? <div /> : null;\n}`,
      errors: tooLong("Summary", 61),
    },
    {
      name: "without a final return, counting runs to the end of the body",
      code: `function Summary({ open }) {\n  if (open) {\n    return <div />;\n  }\n${logic(58)}\n}`,
      errors: tooLong("Summary", 61),
    },
    {
      name: "a multi-line statement counts each of its lines",
      code: component("Summary", `${logic(59)}\n  const total = add(\n    1,\n  );`),
      errors: tooLong("Summary", 62),
    },
  ],
});
