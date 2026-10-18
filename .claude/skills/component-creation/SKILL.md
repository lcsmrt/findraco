---
name: component-creation
description: Write or change a React component (.tsx) in the findraco frontend, and the code-style rules every frontend file follows. Covers function-declaration anatomy, what a component file may export and when logic must leave it (extraction triggers, 60-line logic cap, no IIFE in JSX), container vs presentational and when a story is required, shared component families with editable `base/` primitives, adding a shadcn/Base UI primitive, typography through `Heading`/`Text` (seven-step scale), token-only colours, money display (`Amount`, `formatMoney`), role checks (`usePlanPermissions`), overlay state and container choice, `type` over `interface`, comments that explain why, and the no-bypass lint policy. Use when writing or refactoring any .tsx component, a primitive, a page, a modal/drawer, or when styling text or colour. Triggers on "react component", "create a component", "tsx", "shadcn", "base ui", "primitive", "cva variant", "typography", "Heading", "Text", "colour token", "story needed", "container component", "extract a hook", "eslint-disable", "comment style".
metadata:
  type: reference
---

# Component Creation

Rules here are enforced by lint, the sibling gate script (`scripts/check-siblings.ts`) or review.
Each rule names its enforcement. Where code lives (the colocation ladder, layers, providers) is in
`feature-structure`; forms are in `form-creation`; tests and stories are in `frontend-testing`.

---

## Before writing a component

Check in this order and stop at the first hit:

1. An existing shared component in `src/components/` (see "Use the shared piece" below).
2. The shadcn registry, Base UI flavour. Install it (see "Adding a primitive").
3. Base UI itself. Compose it in a component of ours.
4. Only if neither offers it: write it by hand.

Why: shadcn and Base UI ship accessibility (roles, `aria-*`, keyboard navigation) that hand-built
controls tend to miss. The hand-built toggles never exposed `aria-pressed` or arrow keys.

---

## Anatomy

```tsx
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";

type StatusBadgeProps = {
  label: string;
  active: boolean;
  className?: string;
};

export function StatusBadge({ label, active, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5",
        active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <Text variant="label">{label}</Text>
    </span>
  );
}
```

| Rule | Enforced by |
| --- | --- |
| Components, top-level helpers and handlers declared inside components are `function` declarations. Arrows only as inline callbacks (`onClick={() => …}`, `.map((x) => …)`). | lint `func-style: ["error", "declaration"]` |
| Named exports only. Never `export default` (story files excepted: Storybook needs `export default meta`). Never `React.FC`. | review |
| Props: `type XxxProps = { … }` at module scope, above the component. No inline prop types. | lint `@typescript-eslint/consistent-type-definitions` (for `type`); review |
| A component that renders a root element accepts `className` and merges it with `cn()` from `@/lib/mergeClasses`. Never string concatenation or template literals for classes. | review |
| Visual variants use `cva` + `VariantProps`. | review |
| Files: `PascalCase.tsx`, named after the component. | review |

Why `function`: it matches react.dev and shadcn (generated code and snippets arrive this way),
generics read cleanly in `.tsx`, and overloads are possible.

- You cannot annotate the function as a whole (`const f: UseFormSetValue<T> = …`). Type the parameters instead.
- Hoisting is not a reason. A helper defined below the component is already loaded by render time, so
  helpers may sit below the component either way.

```tsx
// Wrong: arrow assigned to a variable (func-style error)
export const SummaryCard = ({ title }: SummaryCardProps) => { … };
const handleSave = () => mutate(values);

// Right
export function SummaryCard({ title }: SummaryCardProps) { … }
function handleSave() {
  mutate(values);
}
```

---

## What a component file exports

**A `.tsx` component file exports only components.** Enforced by lint
`react-refresh/only-export-components`. Why: Fast Refresh swaps a component in place and keeps its
state only when the file exports nothing else; a mixed file forces a full reload.

Non-exported helpers may stay in the component's file **unless they hit a trigger**. A helper moves
to its own `.ts` module, with a sibling `.test.ts`, when it has any of:

1. a branch or loop that computes a value (`if`, ternary, `switch`, `reduce`, `map` with logic). A
   ternary that only picks a className does not count;
2. arithmetic on money, dates or quantities;
3. a business rule, i.e. something the spec defines;
4. more than 10 lines.

What stays in the component file: one-expression formatters, className builders, constants, `cva`
configs used only by this file, and JSX-only sub-components.

- The new module sits **next to the component** (`spendingRows.ts` beside `CategorySpendingList.tsx`).
  It moves up only when a second consumer appears: see the colocation ladder in `feature-structure`.
- Its test is required by the sibling gate (`scripts/check-siblings.ts` fails when a `.ts` holding a
  decision point, arithmetic or an iteration callback has no `.test.ts`). What to test: `frontend-testing`.
- A `cva` config another module needs (a link styled as a button) moves to a sibling
  `buttonVariants.ts`.
- Example: a form's schema and mappers live in `transactionForm.ts` beside `TransactionFormDrawer.tsx`.

A large JSX tree is fine. There is no file-size cap: a file with many small JSX sub-components
(`CategorySpendingList.tsx`, 12 of them) is a legitimately rich screen.

---

## The logic cap: 60 lines before the main `return`

A component (a PascalCase function, or a function assigned to a PascalCase name including inside
`memo(...)`, that returns JSX) may have **at most 60 lines of code from the start of its body to its
main `return`**. Enforced by lint `local/component-logic-cap`; the limit is hard and the same for
everyone.

- Only code lines count. Blank lines and comment-only lines do not, so a component may show more than
  60 physical lines before its `return` and still pass. Do not compact code or delete "why" comments to
  fit.
- The main `return` is the last top-level `return`. Early returns (`if (!plan) return null;`) count as
  logic.
- Over the cap: extract a `useXxx` hook that holds the state, effects and handlers, and returns what the
  JSX needs. Extracting logic into a hook is always possible, so there is no exception. The hook sits
  next to the component until a second consumer lifts it (`feature-structure`); a hook with logic needs
  a sibling test (`frontend-testing`).

**No immediately invoked function in JSX.** Enforced by lint `local/no-jsx-iife`. An IIFE hides logic
from the cap. Compute a variable before the `return`, call a tested helper, or extract a component.

```tsx
// Wrong (local/no-jsx-iife)
{(() => {
  const last = addMonths(startDate, count - 1);
  return <Text variant="caption">Last installment: {formatDate(last, "MMM yyyy")}</Text>;
})()}

// Right: a tested helper in a sibling .ts, a variable before the return
const lastInstallment = lastInstallmentDate(startDate, count);
// …
<Text variant="caption">Last installment: {formatDate(lastInstallment, "MMM yyyy")}</Text>
```

---

## Container vs presentational: every visual gets a story

- **Presentational**: renders only from props plus local UI state (`useState`, `useReducer`, refs for
  open, hover, input drafts). react-hook-form sections (`useFieldArray`, `useWatch` on a passed
  `control`) count as presentational.
- **Container**: takes data or causes effects from outside: service hooks (`@/api/services`), app
  context hooks (`@/app/providers`), router hooks (`react-router-dom`), or our hooks built on them.
- Practical test: can a story render it with props only, with no provider, API or router?

Rules:

1. **A component with its own visual has a sibling `.stories.tsx`.** Enforced by the story report of
   `scripts/check-siblings.ts`: every `.tsx` under `src/` that does not directly import
   `@/api/services`, `@/app/providers` or `react-router-dom` needs one (tests, stories, `src/index.tsx`
   and `src/test/**` excepted).
2. **A container has no visual of its own.** It fetches and passes down. If it renders markup of its
   own, split it: the container keeps the hooks, a presentational view renders from props and gets the
   story.
3. The gate cannot see our hooks that wrap the API, context or router. A component that calls such a
   hook without importing those modules still needs a story. Split it into container and view; never
   look for a way around the gate.
4. Story content follows the story checklist in `frontend-testing`.

```tsx
// SummaryCards.tsx: presentational, story required
export function SummaryCards({ summary }: SummaryCardsProps) {
  return (…);
}

// OverviewTab.tsx: container, fetches and passes down
export function OverviewTab() {
  const { data: summary } = useGetDashboardSummary(filter);
  return <SummaryCards summary={summary} />;
}
```

---

## Shared components: families and `base/`

`src/components/` is organised by family. A family folder holds its primitives and the compositions
built on them:

```
src/components/
  button/
    base/Button.tsx           primitive (from shadcn/Base UI)
    base/buttonVariants.ts
  input/
    base/Input.tsx, Field.tsx, InputGroup.tsx, …
    CurrencyInput.tsx         composition over Input
  typography/
    base/Heading.tsx, Text.tsx, typographyVariants.ts
  form/
    FormField.tsx, FormSheet.tsx
```

- The primitive pieces of a family (code that came from shadcn or Base UI) live in `<family>/base/`.
- **Primitives are ours and editable, for changes that apply to the whole app only**: tokens, variants,
  loading state, accessibility fixes (`Button` `isLoading` and `Badge` `success` are such changes).
  Domain or screen behaviour goes into a composition outside `base/`. Review enforces the split.
- `base/` files never import `@/features/*`, `@/app/*` or `@/api/*`, and no file in `src/components/`
  imports `@/features/*`. Enforced by lint `no-restricted-imports`; the full layer table is in
  `feature-structure`.
- Primitives in `base/` keep their own built-in text styles (see Typography).

### Adding a primitive

1. Check the shadcn registry (Base UI flavour), then Base UI (see "Before writing a component").
2. Install with the CLI from `frontend/`: `pnpm dlx shadcn@latest add <name>`. `components.json` points
   `utils` at `@/lib/mergeClasses`, `css` at `src/index.css` and `ui` at `@/components`, so generated
   imports resolve. A snippet pasted from the shadcn docs instead needs its `cn` import changed to
   `@/lib/mergeClasses` by hand.
3. Move the files into `<family>/base/` (the CLI writes flat files), e.g. `toggleGroup/base/ToggleGroup.tsx`,
   and fix the imports.
4. Convert to the project's style: `function` declarations, `type` instead of `interface`, PascalCase
   file names, non-component exports (variants) in a sibling `.ts`, raw palette colours replaced by
   tokens. Lint fails until this is done.
5. Add a story (`frontend-testing`).

---

## Use the shared piece

| Need | Use | Not |
| --- | --- | --- |
| Single-choice segmented control | `ToggleGroup` (`tone`: primary, destructive, success; `chip` variant) | hand-built buttons with an active class |
| Debit/credit choice | `TransactionTypeToggle` (composition of `ToggleGroup`) | a new toggle |
| Integer input | Base UI `NumberField` (`min`, `step`) | a text input filtering digits |
| Money input | `CurrencyInput` (see `form-creation`) | `maskCurrency`, parsing strings |
| Money display | `Amount` or `formatMoney` (see Money) | `Intl.NumberFormat`, `toLocaleString` |
| Page title | `PageHeader` | a styled `<h1>` |
| Section title | `SectionHeader` | a styled `<span>` |
| Field help text | `FieldDescription` | `<p className="text-muted-foreground text-xs">` |
| Sheet form skeleton | `FormSheet` (see `form-creation`) | Sheet + footer rebuilt per form |
| Empty state, bottom sheet, list row | shadcn `Empty`, `Drawer`, `Item` (install first) | hand-built equivalents |

**Repeated patterns: two occurrences are enough to extract.** When the same visual pattern or
skeleton appears a second time, extract one composition and use it in both places; split it later if
the cases diverge. Why: a later change (a sheet becoming a bottom drawer on mobile) then happens once.
Keep the shared piece to what the cases share; per-case props piling up is the signal to stop.

---

## Typography

Text is sized and weighted only through `Heading` and `Text` (`src/components/typography/base/`).
Enforced outside `**/base/**` by lint `no-restricted-syntax`:

- no raw `<p>` or `<h1>`–`<h6>`;
- no font-size classes (`text-xs`…`text-9xl`, arbitrary `text-[…]`, undefined ones like `text-md`) and
  no font-weight classes (`font-thin`…`font-black`) in any string, `cn()` arguments included.

Alignment (`text-left`, `text-center`, `text-right`), family (`font-mono`) and `tabular-nums` stay
allowed. Colour stays free but token-only (see Colour).

- `<Heading level={1..6} variant="…">`: `level` picks the tag from the document outline, `variant`
  picks the look from the design role. They are separate on purpose; never pick a level for its size.
- `<Text variant="…" as="p">`: `as` picks the tag, default `span` (a `p` default would break HTML inside
  buttons, labels and other paragraphs).

| Variant | Classes | Used for |
| --- | --- | --- |
| `display` | decorative large numeral (`text-[10rem]`, responsive) | the 404 numeral |
| `headline` | `text-2xl font-bold` | page titles, wordmark, metric figures |
| `title` | `text-base font-semibold` | section titles, compact figures, period label |
| `label` | `text-sm font-medium` | row titles, option labels |
| `body` | `text-sm` | default text |
| `secondary` | `text-sm text-muted-foreground` | descriptions, metric labels |
| `caption` | `text-xs text-muted-foreground` | metadata, subtitles, group and column headers |

```tsx
// Wrong: raw tag, size and weight classes (lint error)
<p className="text-sm font-medium text-muted-foreground">{subtitle}</p>

// Right
<Text variant="secondary" as="p">{subtitle}</Text>
<Heading level={2} variant="title">Spending by category</Heading>
```

- Variants carry the tone their role implies (`secondary` and `caption` are muted). Override colour with
  a token class when needed (`<Text variant="label" className="text-destructive">`).
- **A variant names a role, never a screen** (no `summaryCardBigNumberMobile`). A case that fits no
  variant gets a new role variant in `typographyVariants`, never a one-off class. Review enforces it.
- Non-HTML targets (an SVG `<text>` tick in a chart) use the exported scale:
  `className={typographyVariants({ variant: "label" })}`.
- Page titles go through `PageHeader`, section titles through `SectionHeader`, field help text through
  `FieldDescription`.
- Primitives in `base/` (`Label`, `Button`, `Badge`, `FieldDescription`, inputs, `Sheet`/`Dialog`
  titles) keep their own text styles. Never nest `<Text>` in them. A button label is plain text, not a
  `<p>`; a different weight comes from a `Button` variant.
- Text rendered by libraries (Recharts labels, toast content) is out of the linter's reach: pass tokens
  or `typographyVariants` there.

---

## Colour

**Colour that carries meaning comes from a theme token, never from the raw palette.** Tokens define
each meaning once, for both themes: `text-destructive`, `text-success`, `text-warning`, `bg-primary`,
`text-muted-foreground`, `border-border`, and their `-foreground` pairs.

Enforced everywhere, `base/` included, by lint `no-restricted-syntax`: a class such as
`text-amber-600`, `bg-green-100` or `border-red-500` in a string or `cn()` argument is an error whose
message points to the tokens. A missing meaning gets a new token in `src/index.css` (both themes), never
a palette class.

---

## Money

- Display a transaction value with `Amount` (`value`, `type`): signed (debit "- "), toned (debit
  destructive, credit success), tabular figures.
- Format any other money value with `formatMoney(value)` from `@/utils/money`, or
  `formatMoney(value, { compact: true })` for chart axes.
- Never call `Intl.NumberFormat` or `toLocaleString`, and never write a locale or currency code, in a
  screen. Why: locale and currency come from one source in `money.ts`, so internationalisation changes
  that module and no screen.
- Compare or sum money through `toCents(value)` from the same module. Why: reais as floats can be off by
  0.00000001, which breaks comparisons such as "items ≤ total".

Enforced by review; `money.ts` and the components built on it carry the tests.

---

## Role checks

Role-dependent UI reads capabilities from `usePlanPermissions()` (`@/hooks/usePlanPermissions`):
`canCreateTransactions`, `canAttributeToOthers`, `canManageCategories`, `canManagePlan`. Never compare
`myRole` in a component. Why: the rules mirror `PlanAuthorization.java` in one tested place, and every
capability is `false` while the plan or role is loading, so no screen handles that state itself.
Enforced by review.

---

## Compound components

**Static siblings**, when parts share no state:

```tsx
type CardProps = React.ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("bg-card rounded-lg border p-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("pt-2", className)} {...props} />;
}
```

**Context-based**, only when children need the root's data: follow the provider pattern in
`feature-structure` (context object and throwing hook in `useXxx.ts`, components in `Xxx.tsx`). Parts
are individual named exports (`TableRow`), not `Table.Row`.

---

## Multi-mode overlay state

When a Sheet/Dialog/Drawer opens in several modes (create, edit, duplicate), hold its state in one
discriminated union declared at module scope, not in separate `useState` calls. Why: separate states
(`isOpen`, `mode`, `editingItem`) can diverge (`mode === "edit"` with no item) and TypeScript will not
notice; the union makes that state unrepresentable.

```tsx
type DrawerState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit" | "duplicate"; item: Item };

export function ItemsPage() {
  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false });

  function handleEdit(item: Item) {
    setDrawerState({ open: true, mode: "edit", item });
  }
  // …
}
```

Use it when the overlay has 2+ modes that differ in title, submit label, initial values or mutations.
A single-purpose overlay (a confirm dialog) keeps a plain `useState`. The form side (required `mode`
prop) is in `form-creation`.

---

## Container choice

Pick by the form's size, nesting and flow, not by whether the action is create or edit:

| Container | When |
| --- | --- |
| **Dialog** | Confirmations, small auxiliary actions, small forms (a couple of fields, no nested data) |
| **Sheet** | Create/edit forms with simple to moderate fields (through `FormSheet`) |
| **Page** | Forms with many fields, nested data or steps |
| **Popover** | Anchored contextual overlays (filter panels, pickers, quick actions) |

A one-field "create plan" form is correct as a Dialog.

---

## Code style for every frontend file

These apply to `.ts` modules and hooks as much as to components.

- **`type`, never `interface`**, DTOs included. Enforced by lint
  `@typescript-eslint/consistent-type-definitions: "type"`. Why: interfaces merge silently, and `type`
  covers objects, unions, intersections and the discriminated unions the code relies on.
- **No `any`, no forced `as`.** Enforced by lint (`@typescript-eslint/no-explicit-any`) and review. Use
  generics or narrowing.
- **Comments explain why.** Enforced by review (the Verifier), since lint cannot judge content.
  - JSDoc documents what is exported: the contract.
  - `//` only for a reason: a constraint, a non-obvious consequence, a decision someone might
    "simplify" and break. Write the context ("if this changes, X breaks"), not a label.
  - A comment that narrates what the code does is replaced by a better name or an extraction.
  - No spec or requirement IDs (`CAT-15`, `UX-02 AC 5`) in comments or JSDoc. Traceability lives in test
    names: the colocated test cites the AC and breaks when behaviour changes; a comment never does.

```ts
// Wrong: narrates what, cites an ID
// Show the error toast (AUTH-07)
if (showErrorToast) toast.error(message);

// Right: explains why the condition exists
// A failed renewal already showed the session-expired message.
if (showErrorToast && !(error instanceof SessionExpiredError)) toast.error(message);
```

### Lint policy: no bypass, rules change for everyone

- Lint is green on every commit of `main`.
- `eslint-disable` comments do nothing: `linterOptions.noInlineConfig: true` makes ESLint ignore them.
- `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck` are lint errors (`@typescript-eslint/ban-ts-comment`).
- If a rule is wrong, change it in `eslint.config.js` for the whole codebase, in the same commit that
  fixes every violation it creates. No per-file exception. Why: lint is a signal only without
  exceptions; before this policy it was red with 66 errors and ignored.
