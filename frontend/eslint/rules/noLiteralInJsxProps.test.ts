import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import { noLiteralInJsxProps } from "./noLiteralInJsxProps.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("local/no-literal-in-jsx-props (I18N-01 AC 6)", noLiteralInJsxProps, {
  valid: [
    { name: "a translated text in render", code: 'const a = <T render={<span>{t("a.b")}</span>} />;' },
    { name: "a class in render", code: 'const a = <T render={<span className="px-2">{t("a.b")}</span>} />;' },
    { name: "text outside any attribute is the plugin's", code: "const a = <p>Text</p>;" },
  ],
  invalid: [
    { name: "JSX text in render", code: "const a = <T render={<span>Select plan</span>} />;", errors: 1 },
    { name: "JSX text in icon", code: "const a = <T icon={<span>Close</span>} />;", errors: 1 },
    { name: "a fallback literal in render", code: 'const a = <T render={<span>{name ?? "Select plan"}</span>} />;', errors: 1 },
    { name: "a literal aria-label in render", code: 'const a = <T render={<button aria-label="Open menu" />} />;', errors: 1 },
  ],
});
