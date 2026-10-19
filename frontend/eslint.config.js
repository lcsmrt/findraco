// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { noJsxIife } from './eslint/rules/noJsxIife.ts'

// Rules we own, in TypeScript under eslint/rules/: Node's type stripping loads them, so they need
// neither a build step nor a package.
const local = {
  rules: {
    'no-jsx-iife': noJsxIife,
  },
}

// Named `no-restricted-imports` fragments. Flat config replaces a rule's options when a later block
// matching the same file sets it again, so every block that sets the rule spreads the complete list
// for its files; `eslint.config.test.ts` asserts each fragment per path.

// Handler factories and `src/test/` exist for tests. Outside tests they would hide application code
// behind the sibling-test exemption, and stories render from props, so they never need the network.
const testSupportImports = [
  {
    group: ['**/*.handlers', '@/test/*'],
    message: 'Handler factories and src/test/ are test support: import them only from *.test.ts(x).',
  },
]

// Outside app/, only the global context hooks and the route paths: layouts, the router and app/home
// assemble features, so importing them from below would make the layers depend on each other.
const appInternalsImports = [
  {
    regex: '^@/app/(?!providers/|routing/paths$)',
    message: 'Outside app/, import only @/app/providers/* and @/app/routing/paths.',
  },
]

// Only app/ composes features. What two features need is lifted one rung (colocation ladder), and
// imports inside a feature are relative, so any @/features/ import outside app/ crosses a boundary:
// from a feature into another, or from a lower layer (hooks, utils, api, components) up into one.
const crossFeatureImports = [
  {
    group: ['@/features/*'],
    message: 'Only app/ imports features: lift the shared piece up the colocation ladder.',
  },
]

// base/ primitives are app-wide building blocks: they know no context, route or endpoint.
const appAnyImports = [
  {
    group: ['@/app/*'],
    message: 'base/ primitives never import @/app/*: take the value through props.',
  },
]

const apiImports = [
  {
    group: ['@/api/*'],
    message: 'base/ primitives never import @/api/*: take the data through props.',
  },
]

// Named `no-restricted-syntax` fragments, composed per layer like the import fragments above.

// Colour that carries meaning comes from a theme token, defined once for both themes. A raw palette
// class (`text-amber-600`) bypasses that: it misses dark mode and the contrast the tokens were
// tuned for. The pattern catches class strings in JSX, `cn()` arguments and template literals.
const PALETTE_CLASS =
  String.raw`(^|[\s:!])(text|bg|border(-[xytrbl])?|ring|fill|stroke|outline|decoration|from|via|to|divide|placeholder|caret|accent|shadow)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d`
const PALETTE_MESSAGE =
  'Raw palette colour: use a theme token (text-destructive, text-success, text-warning, bg-primary, text-muted-foreground, border-border, or their -foreground pairs). A missing meaning gets a new token in src/index.css, in both themes.'
const paletteSelectors = [
  { selector: `Literal[value=/${PALETTE_CLASS}/]`, message: PALETTE_MESSAGE },
  { selector: `TemplateElement[value.raw=/${PALETTE_CLASS}/]`, message: PALETTE_MESSAGE },
]

// Text is sized and weighted only through `Heading`/`Text` (one seven-step scale in
// typography/base/). A size or weight class elsewhere starts a new look outside the scale, so it is
// banned in every string; alignment (`text-center`), family (`font-mono`) and colour stay free.
// Arbitrary sizes (`text-[10rem]`) and undefined ones (`text-md`, which renders the inherited size)
// count as sizes. esquery regexes cannot contain `/`, hence the lookahead instead of a delimiter list.
const TYPOGRAPHY_CLASS =
  String.raw`(^|[\s:!])(text-(2?xs|sm|md|base|lg|xl|[2-9]xl|\[[^\]]*\])|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black))(?![\w-])`
const TYPOGRAPHY_MESSAGE =
  'Size or weight class: render text through Heading/Text (src/components/typography/base/) with a variant. A case no variant fits gets a new role variant in typographyVariants, never a class.'
const typographySelectors = [
  { selector: `Literal[value=/${TYPOGRAPHY_CLASS}/]`, message: TYPOGRAPHY_MESSAGE },
  { selector: `TemplateElement[value.raw=/${TYPOGRAPHY_CLASS}/]`, message: TYPOGRAPHY_MESSAGE },
]

// A raw paragraph or heading carries the browser's look, not the scale's.
const rawTextTagSelectors = [
  {
    selector: 'JSXOpeningElement[name.name=/^(p|h[1-6])$/]',
    message: 'Raw <p>/<hN>: use <Text as="p" variant="…"> or <Heading level={n} variant="…"> (PageHeader, SectionHeader and FieldDescription for their roles).',
  },
]

const testFiles = ['**/*.test.{ts,tsx}', 'src/test/**']

// One layer of the import table: its files get exactly `patterns`, plus the test-support ban
// everywhere except in tests (which still obey the layer).
function importLayer(files, patterns, ignores = []) {
  const layer = [
    {
      files,
      ignores: [...ignores, ...testFiles],
      rules: {
        'no-restricted-imports': ['error', { patterns: [...testSupportImports, ...patterns] }],
      },
    },
  ]
  if (patterns.length === 0) return layer
  return [
    ...layer,
    {
      // A nested array matches files that satisfy every glob in it: tests inside this layer.
      files: files.flatMap((glob) => testFiles.map((testGlob) => [glob, testGlob])),
      ignores,
      rules: {
        'no-restricted-imports': ['error', { patterns }],
      },
    },
  ]
}

// One layer of the syntax table: its files, tests and stories included, get exactly `selectors`.
function syntaxLayer(files, selectors, ignores = []) {
  return {
    files,
    ignores,
    rules: {
      'no-restricted-syntax': ['error', ...selectors],
    },
  }
}

export default defineConfig({ ignores: ['dist'] }, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.{ts,tsx}'],
  // Lint is a signal only without exceptions: a wrong rule changes here for everyone,
  // so `eslint-disable` comments are ignored and the rule still reports.
  linterOptions: {
    noInlineConfig: true,
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    local,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'local/no-jsx-iife': 'error',
    'react-refresh/only-export-components': [
      'error',
      { allowConstantExport: true },
    ],
    // A description does not make a type bypass acceptable: fix the type instead.
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': true, 'ts-expect-error': true, 'ts-nocheck': true },
    ],
    // Interfaces merge silently with any same-named declaration; `type` also covers the unions the code relies on.
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    // One way to write a named function, the one react.dev and shadcn snippets arrive in; arrows stay
    // for inline callbacks. No escape through a type annotation (`const f: Handler = () => …`):
    // type the parameters instead. Arrows that use the enclosing `this` are never reported.
    'func-style': [
      'error',
      'declaration',
      { allowArrowFunctions: false, allowTypeAnnotation: false, overrides: { namedExports: 'declaration' } },
    ],
  },
}, {
  // Augmenting a library's types (`declare module "axios" { interface … }`) needs declaration
  // merging, which only an interface does; augmentations live in `*.d.ts` files for that reason.
  files: ['**/*.d.ts'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
  },
},
// Import layers, from the widest to the narrowest; each spreads its parents' fragments.
...importLayer(['src/**/*.{ts,tsx}'], [...appInternalsImports, ...crossFeatureImports], ['src/app/**']),
...importLayer(['src/app/**/*.{ts,tsx}'], []),
...importLayer(
  ['src/components/**/base/**/*.{ts,tsx}'],
  [...appInternalsImports, ...crossFeatureImports, ...appAnyImports, ...apiImports],
),
// Syntax layers, from the widest to the narrowest; each spreads its complete list.
// base/ primitives keep their own built-in text styles, so they get the palette ban only.
syntaxLayer(
  ['src/**/*.{ts,tsx}'],
  [...paletteSelectors, ...typographySelectors, ...rawTextTagSelectors],
  ['src/app/**'],
),
syntaxLayer(['src/app/**/*.{ts,tsx}'], [...paletteSelectors, ...typographySelectors, ...rawTextTagSelectors]),
syntaxLayer(['src/components/**/base/**/*.{ts,tsx}'], [...paletteSelectors]),
storybook.configs["flat/recommended"]);
