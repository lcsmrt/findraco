// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

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
// imports inside a feature are relative, so any @/features/ import here crosses a feature boundary.
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
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
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
...importLayer(['src/**/*.{ts,tsx}'], [...appInternalsImports], ['src/app/**']),
...importLayer(['src/app/**/*.{ts,tsx}'], []),
...importLayer(['src/features/**/*.{ts,tsx}'], [...appInternalsImports, ...crossFeatureImports]),
...importLayer(['src/components/**/*.{ts,tsx}'], [...appInternalsImports, ...crossFeatureImports]),
...importLayer(
  ['src/components/**/base/**/*.{ts,tsx}'],
  [...appInternalsImports, ...crossFeatureImports, ...appAnyImports, ...apiImports],
),
storybook.configs["flat/recommended"]);
