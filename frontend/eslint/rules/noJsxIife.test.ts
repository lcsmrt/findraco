import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import { noJsxIife } from "./noJsxIife.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("local/no-jsx-iife (STD-12 AC 4, 5)", noJsxIife, {
  valid: [
    {
      name: "a normal call in children",
      code: "function Total({ items }) { return <p>{formatTotal(items)}</p>; }",
    },
    {
      name: "a callback passed, not invoked, in an attribute",
      code: "function Save({ onSave }) { return <button onClick={() => onSave()}>Save</button>; }",
    },
    {
      name: "a function invoked before the return",
      code: "function Last() { const last = (() => 1)(); return <p>{last}</p>; }",
    },
  ],
  invalid: [
    {
      name: "an arrow IIFE in children",
      code: "function Last() { return <p>{(() => { const last = 1; return last; })()}</p>; }",
      errors: [{ messageId: "iife" }],
    },
    {
      name: "a function-expression IIFE in children",
      code: "function Last() { return <p>{(function () { return 1; })()}</p>; }",
      errors: [{ messageId: "iife" }],
    },
    {
      name: "an IIFE in an attribute",
      code: "function Box() { return <div className={(() => 'a')()} />; }",
      errors: [{ messageId: "iife" }],
    },
  ],
});
