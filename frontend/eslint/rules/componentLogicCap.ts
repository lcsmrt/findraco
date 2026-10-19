import type { Rule } from "eslint";
import type * as ESTree from "estree";

const DEFAULT_MAX = 60;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;

type FunctionNode =
  | ESTree.FunctionDeclaration
  | ESTree.FunctionExpression
  | ESTree.ArrowFunctionExpression;

type Frame = { node: FunctionNode; containsJsx: boolean };

/** The name a function is known by: its own, or the variable it is assigned to (through `memo(...)`). */
function componentName(node: FunctionNode & Rule.NodeParentExtension): string | null {
  if (node.type !== "ArrowFunctionExpression" && node.id) return node.id.name;
  let parent: Rule.Node = node.parent;
  while (parent.type === "CallExpression") parent = parent.parent;
  if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
    return parent.id.name;
  }
  return null;
}

/**
 * Caps a component's logic: the code lines from the start of its body to its main `return` (the last
 * top-level one, or the end of the body). Blank and comment-only lines do not count, so "why"
 * comments and spacing never push code to be compacted; early returns count, they are logic.
 */
export const componentLogicCap: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Limit the lines of logic a component runs before its main return",
    },
    schema: [
      {
        type: "object",
        properties: { max: { type: "integer", minimum: 0 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooLong:
        "Component `{{name}}` has {{count}} lines of logic before its return (max {{max}}). Extract a hook.",
    },
  },
  create(context) {
    const option: unknown = context.options[0];
    const max =
      typeof option === "object" && option !== null && "max" in option && typeof option.max === "number"
        ? option.max
        : DEFAULT_MAX;
    const { sourceCode } = context;
    const frames: Frame[] = [];

    function enter(node: FunctionNode) {
      frames.push({ node, containsJsx: false });
    }

    function markJsx() {
      for (const frame of frames) frame.containsJsx = true;
    }

    function codeLinesBetween(firstLine: number, lastLine: number): number {
      const lines = new Set<number>();
      // Program tokens exclude comments, so a comment-only line never counts.
      for (const token of sourceCode.ast.tokens) {
        for (let line = token.loc.start.line; line <= token.loc.end.line; line++) {
          if (line >= firstLine && line <= lastLine) lines.add(line);
        }
      }
      return lines.size;
    }

    function exit(node: FunctionNode & Rule.NodeParentExtension) {
      const frame = frames.pop();
      if (!frame?.containsJsx || node.body.type !== "BlockStatement") return;
      const name = componentName(node);
      if (!name || !PASCAL_CASE.test(name)) return;

      const { body } = node;
      const mainReturn = body.body.findLast((statement: ESTree.Statement) => statement.type === "ReturnStatement");
      const bodyStart = body.loc?.start.line ?? 0;
      const end = mainReturn?.loc?.start.line ?? body.loc?.end.line ?? 0;
      const count = codeLinesBetween(bodyStart + 1, end - 1);
      if (count > max) {
        context.report({ node, messageId: "tooLong", data: { name, count: String(count), max: String(max) } });
      }
    }

    return {
      FunctionDeclaration: enter,
      FunctionExpression: enter,
      ArrowFunctionExpression: enter,
      "FunctionDeclaration:exit": exit,
      "FunctionExpression:exit": exit,
      "ArrowFunctionExpression:exit": exit,
      // A function is a component when JSX appears anywhere in it, nested callbacks included, so JSX
      // handed back through a variable (`return content;`) or a local render helper
      // (`return renderRow();`) is recognised as well as a JSX literal in the `return`.
      JSXElement: markJsx,
      JSXFragment: markJsx,
    };
  },
};
