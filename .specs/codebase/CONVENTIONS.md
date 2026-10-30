# Code Conventions

Two codebases with distinct but internally-consistent conventions. Frontend conventions are prescribed by the `CLAUDE.md` Frontend section and the frontend skills in `.claude/skills/` (`component-creation`, `feature-structure`, `form-creation`, `api-integration`, `frontend-testing`), which are the source of truth; this file describes them. Backend conventions are inferred from the source.

Some frontend conventions below are still being rolled out by the frontend-standards feature (`.specs/features/frontend-standards/tasks.md`); until a rule's slice lands, existing code may not follow it yet, but new code does.

## Naming Conventions

**Frontend files:**

- Components: `PascalCase.tsx`, named after the component (`SectionHeader.tsx`, `Field.tsx`)
- Pages: `PascalCasePage.tsx` (`PlansPage.tsx`, `LoginPage.tsx`)
- Hooks: `useXxx.ts` (`usePlanPermissions.ts`, `useDebounce.ts`)
- Providers: `XxxProvider.tsx` + `useXxx.ts` (`PlanProvider.tsx` + `usePlanContext.ts`)
- Service hooks: `useXxxService.ts` (`useTransactionService.ts`), with `xxx.handlers.ts` beside them (`dashboard.handlers.ts`)
- Modules: `camelCase.ts` (`buildPagedQuery.ts`, `spendingRows.ts`, `transactionForm.ts`, `buttonVariants.ts`)
- Tests and stories: siblings of their subject (`spendingRows.test.ts`, `Button.stories.tsx`)

**Frontend types:** `type` aliases only, never `interface`. Props `<ComponentName>Props`. Request types `CreateXxxRequest` / `UpdateXxxRequest` (holding `params` and/or `body`); `XxxResponse` is the API wire shape when it differs from the entity. Form types: `XxxFormValues` (field values while editing) and `XxxFormOutput` (validated values). Entity types plain PascalCase (`Transaction`).

**Backend files/classes:** PascalCase classes suffixed by role: `XxxController`, `XxxService`, `XxxRepository`, `XxxSpecification`, `XxxExceptions`, `XxxRoutes`, `XxxProperties`. Entities in `model/` are unsuffixed (`Transaction`, `User`), as are enums (`TransactionType`). DTOs are records without a `Dto` suffix: `CreateXxxRequest` / `UpdateXxxRequest` / `XxxFilter` in `request/`, `XxxResponse` / `XxxSummaryResponse` in `response/`. The full naming, package and ArchUnit rules are in the `backend-structure` and `backend-endpoint` skills.

**Backend methods/fields:** camelCase (`findAllByPlanPaged`, `transactionRepository`). Route constants UPPER_SNAKE in the feature's `controller/XxxRoutes` (`TransactionRoutes.TRANSACTION`), built from `ApiRoutes.PLAN`.

## Function Style and Exports (Frontend)

- Components, top-level helpers and handlers declared inside components are `function` declarations; arrows appear only as inline callbacks (`onClick={() => …}`, `.map((x) => …)`). Lint: `func-style: ["error", "declaration"]`.
- Named exports only; never default (story files excepted, for `export default meta`); never `React.FC`.
- A component `.tsx` exports only components (lint: `react-refresh/only-export-components`). Helpers that hit an extraction trigger (a branch or loop computing a value, arithmetic on money/dates/quantities, a business rule, more than 10 lines) live in a `.ts` module: a business rule or pure computation in the feature's `utils/` with a test, glue beside the component with none (test table, `frontend-testing`).
- A component has at most 60 code lines (blank and comment lines excluded) before its main `return`; above that, logic moves to a `useXxx` hook. No IIFE inside JSX. Lint: `local/component-logic-cap`, `local/no-jsx-iife`. There is no file-size cap.

## Code Organization

**Frontend imports:** `@/` for cross-folder imports; relative (`./`, `../`) only within the same feature. Features never import each other; only `src/app/` imports features; code outside `app/` imports only `@/app/providers/*` and `@/app/routing/paths` from it. Lint (`no-restricted-imports`) enforces the layers; the table is in the `feature-structure` skill. Example from `Field.tsx`:

```ts
import { Label } from "@/components/input/base/Label";
import { cn } from "@/lib/mergeClasses";
import { cva, type VariantProps } from "class-variance-authority";
```

**Colocation:** code is born where it is used and moves up one level per wider consumer (component file → next to the component → the feature's `hooks/`/`utils/` or `components/` → `src/`). The folder states scope, not kind, so feature `components/` folders mix `.tsx` and `.ts`.

Components never call `findracoApi` directly — always through a service hook in `src/api/services/`. Service hooks split each operation into a raw async function (HTTP only) plus an exported `useGetXxx` / `useCreateXxx` hook wrapping it; plan-scoped hooks put the active plan in the URL and the query key.

**Backend imports:** sorted and formatted by Spotless (palantir-java-format). Dependencies injected via constructor (no field `@Autowired`, no Lombok). Layer boundary is strict and checked by `ArchitectureTest`: the controller resolves identity (`PlanContext` or `AuthenticatedUser`), delegates one call to the service and returns the response it built.

## Styling, Tokens and Typography (Frontend)

- `className` accepted and merged via `cn()` from `@/lib/mergeClasses` whenever a component renders a root element — never string concatenation or template literals. Visual variants use `cva` + `VariantProps` (see `fieldVariants` in `Field.tsx`).
- Primitives from shadcn/Base UI live in `src/components/<family>/base/`. They are ours and editable for app-wide changes (tokens, variants, loading state, accessibility); domain or screen behaviour goes into a composition outside `base/`. New primitives are checked for in shadcn and Base UI first, installed with the shadcn CLI, moved into `base/` and converted to the project style.
- Colour that carries meaning comes from theme tokens (`text-destructive`, `text-success`, `text-warning`, `text-muted-foreground`, …), defined for both themes in `src/index.css`. Raw palette classes (`text-amber-600`) are a lint error (`no-restricted-syntax`), `base/` included.
- Text is sized and weighted only through `Heading` (`level` for the tag) and `Text` (`as` for the tag, default `span`) from `src/components/typography/base/`, sharing one seven-step scale: `display`, `headline`, `title`, `label`, `body`, `secondary`, `caption`. Outside `base/`, raw `<p>`/`<h1>`–`<h6>` and font-size/weight classes are lint errors; alignment, `font-mono` and `tabular-nums` stay allowed. Page titles use `PageHeader`, section titles `SectionHeader`, field help `FieldDescription`.
- Money is displayed through `Amount` or `formatMoney` (`src/utils/money.ts`, the single locale/currency source), entered through `CurrencyInput`, and compared or summed through `toCents`. Screens never call `Intl` or name a locale or currency.

## Type Safety / Documentation

**Frontend:** Strict TypeScript. No `any`, no forced `as T`. No bypass of any kind: `eslint-disable` comments are ignored (`linterOptions.noInlineConfig`), and `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` are lint errors (`@typescript-eslint/ban-ts-comment`); a wrong rule changes for the whole codebase. Multi-mode overlays are modeled as discriminated unions declared at module scope. Role-dependent UI reads `usePlanPermissions()` capabilities, never `myRole`.

**Backend:** Plain Java, no Lombok or MapStruct (maven-enforcer). Requests and responses are records; a response is built by `static from(entity)` inside the service transaction. Guarded entities have a single creation method and no public setters. Bean Validation annotations on request records, enforced by `@Valid` at the controller, with every string and list bounded by `@Size`.

## Error Handling

**Backend:** One `application/problem+json` format built by `shared.error.Problems`. A rule is a `DomainException` nested in the feature's `XxxExceptions` with its own `ProblemType` slug and a semantic status (400 unreadable, 422 invalid, 409 clashes with state, 404 outside scope); `GlobalExceptionHandler` answers it, so a new rule needs no handler. The frontend maps the slug to copy in `api/utils/problems.ts`. Ownership and scope mismatches answer 404. `@Transactional` on service methods (`readOnly = true` for reads). See the `backend-exceptions` skill.

**Frontend:** Mutation success/error toasts handled centrally by `buildMutationOptions` inside service hooks; per-call overrides (`showSuccessToast`, `onSuccess`) supported. List-affecting mutations call `queryClient.invalidateQueries({ queryKey: ["transactions"] })` in `onSuccess`. Conditional queries use `enabled`, not `useEffect`.

## Forms (Frontend)

react-hook-form + zod + `@hookform/resolvers/zod`. Schema, `XxxFormValues`/`XxxFormOutput` and the boundary mappers (`toFormValues` from the API, `toPayload` to the API, converting shape and type only) live in a sibling `xxxForm.ts` with a test. Form values hold domain types: money `number | null`, dates `Date`, empty `null`. Every field binds through `Controller`, written via `FormField` (raw `Controller` for special layouts); other fields are read with `useWatch` in the section that needs them, never root `watch()` + `setValue()`. Dynamic lists use `useFieldArray`. `FieldError` always takes `errors={[…]}`. Sheet forms render through `FormSheet`. Container chosen by complexity: **Dialog** (confirm/auxiliary/small forms), **Sheet** (simple/moderate create-edit), **Page** (complex), **Popover** (filters/pickers). Multi-operation forms take a **required** `mode` prop; labels derive from it. Submits that choose between mutations or run multi-step flows live in `useXxxFormSubmit`.

## API Hooks (Frontend)

Live **globally** in `src/api/services/` (one `useXxxService.ts` per domain), not inside features, each with typed MSW handler factories in a sibling `xxx.handlers.ts` (imported only by tests and stories). Query key format `["entityName", activePlanId, params]` for plan-scoped lists — always an array, single item as `["entity", id]`. Mutations built with `buildMutationOptions`. Paginated GETs use `buildPagedQuery` to serialize `PagedRequest`, and `toPagination` to map a `PagedResponse` to table pagination.

## Comments / Documentation

Frontend: JSDoc documents exported contracts. `//` comments explain **why** (a constraint, a non-obvious consequence, a decision someone might "simplify" and break), with enough context to stand alone; a comment that narrates what the code does is replaced by a better name or an extraction. No spec or requirement IDs in comments or JSDoc — traceability lives in test names. Not lint-enforceable; checked in review. English only. Backend: minimal comments; Swagger `@Operation` / `@Tag` annotations document endpoints instead of prose.
