import type { Rule } from "eslint";

// An immediately invoked function inside JSX runs logic in the middle of the markup, where the
// component logic cap cannot see it. Any call whose callee is a function written in place, anywhere
// inside a JSX expression container (children or attributes), is reported.
const IIFE_IN_JSX =
  "JSXExpressionContainer CallExpression[callee.type=/^(ArrowFunctionExpression|FunctionExpression)$/]";

export const noJsxIife: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow immediately invoked functions inside JSX",
    },
    schema: [],
    messages: {
      iife: "Immediately invoked function in JSX. Compute a variable before the return, call a tested helper, or extract a component.",
    },
  },
  create(context) {
    return {
      [IIFE_IN_JSX](node: Rule.Node) {
        context.report({ node, messageId: "iife" });
      },
    };
  },
};
