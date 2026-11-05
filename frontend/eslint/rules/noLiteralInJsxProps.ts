import type { Rule } from "eslint";

// `eslint-plugin-i18next` skips the whole subtree of an attribute it does not list, so a text written
// in JSX handed through `render=`, `icon=` and the like escapes it. This rule looks only inside those
// subtrees: JSX text, a literal child (`{name ?? "Select"}`) and the user-facing attributes.
const TEXT_ATTRIBUTES = "/^(placeholder|title|aria-label|alt)$/";
const NESTED = "JSXAttribute JSXElement";
const SELECTORS = [
  `${NESTED} > JSXText`,
  `${NESTED} > JSXExpressionContainer > Literal`,
  `${NESTED} > JSXExpressionContainer > LogicalExpression > Literal`,
  `${NESTED} > JSXExpressionContainer > ConditionalExpression > Literal`,
  `JSXAttribute JSXAttribute[name.name=${TEXT_ATTRIBUTES}] > Literal`,
];

function hasLetters(node: Rule.Node): boolean {
  const value = node.type === "JSXText" || node.type === "Literal" ? node.value : null;
  return typeof value === "string" && /\p{L}/u.test(value);
}

export const noLiteralInJsxProps: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow literal interface texts in JSX passed through an attribute",
    },
    schema: [],
    messages: {
      literal: "Literal interface text in JSX passed through an attribute: use t() and a key in src/i18n.",
    },
  },
  create(context) {
    const rules: Rule.RuleListener = {};
    for (const selector of SELECTORS) {
      rules[selector] = (node: Rule.Node) => {
        if (hasLetters(node)) context.report({ node, messageId: "literal" });
      };
    }
    return rules;
  },
};
