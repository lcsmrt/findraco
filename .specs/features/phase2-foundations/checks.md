# Phase 2 foundations checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/utils/percent.test.ts src/app/layout/MainLayout.test.tsx
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/transactions/components/TransactionCells.stories.tsx src/features/transactions/components/TransactionMobileList.stories.tsx src/features/transactions/components/TransactionBadges.stories.tsx src/features/transactions/components/EndDateField.stories.tsx src/features/transactions/components/TransactionFilterPopoverView.stories.tsx src/features/transactions/TransactionsPageView.stories.tsx src/features/plans/PlansPageView.stories.tsx src/features/plans/components/PlanTrashListView.stories.tsx src/features/plans/components/PlanInvitationsListView.stories.tsx src/features/overview/OverviewPageView.stories.tsx src/features/overview/components/CategorySpendingList.stories.tsx src/features/categories/CategoriesPageView.stories.tsx src/features/categories/components/CategoryTreeRow.stories.tsx src/features/categories/components/CategoryLimitFields.stories.tsx src/components/input/StandardMultiCombobox.stories.tsx src/components/input/StandardCombobox.stories.tsx src/app/layout/MainLayoutView.stories.tsx
Plan: `.specs/features/phase2-foundations/plan.md`

39 checks in 6 slices · 3 one-way doors · 0 open, of which 0 block

Story rules for every check below:
- The storybook project runs at Vitest's default browser viewport, 414 × 896, which is below 640 px. A check about 640 px or wider sets the viewport inside its story (`page.viewport` from `vitest/browser`).
- Sizes, colours and alignment are read with `getComputedStyle` or `getBoundingClientRect`, never from class names.
- A badge's family is read from the `data-variant` attribute that `Badge` renders (`status`, `tag` or `meta`), and its tone from `data-tone`.
- Stories render in English, so their labels are the `en` copy.

## Checks

### S1 - Badges say what they mark

**C1** - In the table, a forecast transaction shows "Forecast" as `data-variant="status"` `data-tone="neutral"`, with an svg icon and a computed border width of 0, and its background differs from the card's (AC 1)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Forecast Badge

**C2** - The phone list shows the same forecast badge the same way (AC 1)
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Forecast Badge

**C3** - In the table, a pending transaction shows "Pending" as `data-variant="status"` `data-tone="warning"` with an svg icon (AC 2)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Pending Badge

**C4** - The phone list shows the same pending badge the same way (AC 2)
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Pending Badge

**C5** - In the table, the category shows as `data-variant="tag"` with no svg icon (AC 3)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Category Tag

**C6** - Only the category cell renders a `tag` badge: in production `.tsx` files, `variant="tag"` appears in `TransactionCells.tsx` and nowhere else (AC 3)
Proof: cd frontend && test "$(grep -rl --include=*.tsx 'variant="tag"' src | grep -v -E '\.stories\.|\.test\.|/base/')" = "src/features/transactions/components/TransactionCells.tsx"

**C7** - The badge row shows a `meta` badge "1 item" for one item and "3 items" for three, and no items badge for none (AC 4)
Proof: run stories | ✓ src/features/transactions/components/TransactionBadges.stories.tsx > Items Count

**C8** - The badge row puts a forecast, a transfer kind, a series and 3 items in the order status, kind, series, items (AC 5)
Proof: run stories | ✓ src/features/transactions/components/TransactionBadges.stories.tsx > Order

**C9** - The table cell and the phone list both render `TransactionBadges`: a row with all four shows the same four labels in the same order in each (AC 5)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Badge Row
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Badge Row

**C10** - The series, kind and participants badges in the table are `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/transactions/components/TransactionCells.stories.tsx > Meta Badges

**C11** - The role and default-plan badges on the plans page are `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/plans/PlansPageView.stories.tsx > Meta Badges

**C12** - The "ongoing" badge of the end date field is `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/transactions/components/EndDateField.stories.tsx > Meta Badges

**C13** - The series badge in the trash list is `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/plans/components/PlanTrashListView.stories.tsx > Meta Badges

**C14** - The member owner badge in the category spending list is `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Meta Badges

**C15** - The active filter count badge is `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Meta Badges

**C16** - The "+N" overflow badge of the multi combobox is `data-variant="meta"` (AC 6)
Proof: run stories | ✓ src/components/input/StandardMultiCombobox.stories.tsx > Meta Badges

**C17** - The invitations list shows `PENDING` as status neutral with an svg, `ACCEPTED` as status success with an svg, `EXPIRED` as status neutral with no svg, and `REVOKED` as status destructive with an svg (AC 7)
Proof: run stories | ✓ src/features/plans/components/PlanInvitationsListView.stories.tsx > Status Badges

**C18** - `index.css` defines no `--chart-`, `--sidebar` or `--font-serif` token, and the badge primitive has no `secondary`, `outline`, `success`, `destructive` or `default` variant left (AC 8; door 1)
Proof: cd frontend && ! grep -nE -- '--(chart-[0-9]|sidebar|font-serif)' src/index.css && ! grep -nE '^\s*(default|secondary|outline|success|destructive):' src/components/badge/base/badgeVariants.ts

### S2 - Focus, fields and motion

**C19** - `--ring` is `#a14a07` in the light theme and `#f59e0b` in the dark one. Each ring and `--input` value reaches 3:1 or more against that theme's `--card` and `--background` (AC 9, AC 11)
Proof: cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const block=(sel)=>css.slice(css.indexOf(sel+' {'),css.indexOf('}',css.indexOf(sel+' {')));const tok=(b,n)=>{const m=b.match(new RegExp('--'+n+':\\\\s*(#[0-9a-fA-F]{6});'));if(!m)throw new Error(n+' missing');return m[1]};const lum=(h)=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};const cr=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05)};const a=require('assert');for(const [sel,ring] of [[':root','#a14a07'],['.dark','#f59e0b']]){const b=block(sel);a.strictEqual(tok(b,'ring').toLowerCase(),ring);for(const fg of ['ring','input'])for(const bg of ['card','background'])a.ok(cr(tok(b,fg),tok(b,bg))>=3,sel+' '+fg+' on '+bg+' '+cr(tok(b,fg),tok(b,bg)).toFixed(2))}"

**C20** - No production file draws the focus ring at partial opacity: no `ring-ring/` remains in `src` outside stories and tests (AC 9)
Proof: cd frontend && ! grep -rn --include=*.ts --include=*.tsx 'ring-ring/' src | grep -v -E '\.stories\.|\.test\.'

**C21** - Tabbing to the search field and to a header button on the transactions page gives each a computed `box-shadow` containing rgb(161, 74, 7) (AC 9)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Focus Ring

**C22** - A transaction row in the phone list draws the ring, rgb(161, 74, 7) in its computed `box-shadow` or `outline-color`, when focused with the keyboard (AC 10)
Proof: run stories | ✓ src/features/transactions/components/TransactionMobileList.stories.tsx > Row Focus

**C23** - A category row and a category spending row each draw the same ring when focused with the keyboard (AC 10)
Proof: run stories | ✓ src/features/categories/components/CategoryTreeRow.stories.tsx > Row Focus
Proof: run stories | ✓ src/features/overview/components/CategorySpendingList.stories.tsx > Row Focus

**C24** - `index.css` has a `prefers-reduced-motion: reduce` block that sets `animation-duration` and `transition-duration` to `0.01ms` on every element (AC 12)
Proof: cd frontend && node -e "const css=require('fs').readFileSync('src/index.css','utf8');const i=css.indexOf('prefers-reduced-motion: reduce');if(i<0)process.exit(1);const b=css.slice(i,i+600);for(const p of ['animation-duration: 0.01ms','transition-duration: 0.01ms','*'])if(!b.includes(p))process.exit(1)"

### S3 - Phone controls are 44 px targets

**C25** - At 414 px, on the transactions page, every button (icon buttons included), the search field and every filter chip measure 44 px tall, and every icon button measures 44 × 44 (AC 13, AC 14)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Touch Targets

**C26** - At 414 px, the category limit fields' number inputs, toggles and buttons measure 44 px tall (AC 14)
Proof: run stories | ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Touch Targets

**C27** - At 414 px, the filter popover's select trigger, combobox input and buttons measure 44 px tall (AC 14)
Proof: run stories | ✓ src/features/transactions/components/TransactionFilterPopoverView.stories.tsx > Touch Targets

**C28** - At 414 px, the standard combobox input measures 44 px tall (AC 14)
Proof: run stories | ✓ src/components/input/StandardCombobox.stories.tsx > Touch Target

**C29** - At a 1280 px viewport, the transactions page's default buttons measure 36 px, `sm` buttons 28 px and icon buttons 32 × 32 (AC 15)
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Desktop Sizes

### S4 - One page shell

**C30** - Each page view renders one `h1`, visible, reading "Overview", "Transactions", "Categories" and "Plans" (AC 16)
Proof: run stories | ✓ src/features/overview/OverviewPageView.stories.tsx > Page Title
Proof: run stories | ✓ src/features/transactions/TransactionsPageView.stories.tsx > Page Title
Proof: run stories | ✓ src/features/categories/CategoriesPageView.stories.tsx > Page Title
Proof: run stories | ✓ src/features/plans/PlansPageView.stories.tsx > Page Title

**C31** - At a 1440 px viewport, the layout's content box measures 1280 px or less and is centred: its left and right gaps differ by at most 1 px (AC 17)
Proof: run stories | ✓ src/app/layout/MainLayoutView.stories.tsx > Content Width

**C32** - "New category" on Categories and "New plan" on Plans sit inside the page header, are outline buttons (transparent background, visible border) and no button in either page view has the primary fill (AC 18)
Proof: run stories | ✓ src/features/categories/CategoriesPageView.stories.tsx > Header Actions
Proof: run stories | ✓ src/features/plans/PlansPageView.stories.tsx > Header Actions

**C33** - On the Categories route, using the global add opens the new transaction form (AC 19)
Proof: run unit | ✓ src/app/layout/MainLayout.test.tsx > opens the new transaction form from the Categories page

### S5 - Sign-up defaults

**C34** - Sign-up names the first plan from `Accept-Language`, table-driven over 5 examples: "pt-BR,pt;q=0.9" → "Meu plano", "pt-PT" → "Meu plano", "en-US" → "My plan", "fr-FR" → "My plan", none → "My plan" (AC 20)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesFirstPlanFromDeviceLanguage' -Dsurefire.skip=true

**C35** - Sign-up stores the `Time-Zone` header when valid, table-driven: "Europe/Lisbon" → "Europe/Lisbon", "Mars/Base" → "America/Sao_Paulo", none → "America/Sao_Paulo", and still answers 201 (AC 21)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#storesDeviceTimeZone' -Dsurefire.skip=true

**C36** - A user who loses their last plan gets a personal plan named from their saved language: "pt-BR" → "Meu plano", "en" → "My plan", none → "My plan" (AC 22)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='SignUpDefaultsIT#namesRecoveredPlanFromSavedLanguage' -Dsurefire.skip=true

### S6 - Locale fix

**C37** - `formatPercent` writes 61.8 as "61,8%" in pt-BR, as "61.8%" in en, and 50 as "50%" in pt-BR (AC 23)
Proof: run unit | ✓ src/utils/percent.test.ts > formatPercent > writes 61.8 as "61,8%" in pt-BR
Proof: run unit | ✓ src/utils/percent.test.ts > formatPercent > writes 61.8 as "61.8%" in en
Proof: run unit | ✓ src/utils/percent.test.ts > formatPercent > writes 50 as "50%" in pt-BR

**C38** - The category limit fields render the member share through `formatPercent` in the interface language (AC 23)
Proof: run stories | ✓ src/features/categories/components/CategoryLimitFields.stories.tsx > Share Percent

**C39** - The local stack at 390 × 844 and 1280 × 800 shows the new badges, the focus ring, 44 px phone controls, the page titles and shared edges, with nothing clipped or overflowing; a pt-BR sign-up gets "Meu plano" (AC 1, 9, 13, 16, 17, 20)
Proof: walk - Overview, Transactions, Categories and Plans at both widths, plus a sign-up with a pt-BR browser

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| badge families, door 1 (3) | `status` C1 C3 C17 · `tag` C5 C6 · `meta` C7 C10-C16 | - |
| AC 6 meta badges (10) | series C10 · kind C10 · participants C10 · role C11 · default plan C11 · ongoing C12 · trash series C13 · member owner C14 · filter count C15 · "+N" C16 | - |
| invitation statuses, AC 7 (4) | `PENDING` C17 · `ACCEPTED` C17 · `EXPIRED` C17 · `REVOKED` C17 | - |
| items examples, AC 4 (3) | 1 C7 · 3 C7 · 0 C7 | - |
| dead tokens, AC 8 (3) | chart C18 · sidebar C18 · serif C18 | - |
| themes × surfaces, AC 9 and AC 11 (8) | light and dark × ring and input × card and background, C19 table-driven over all 8 | - |
| focusable rows, AC 10 (3) | phone transaction row C22 · category row C23 · category spending row C23 | - |
| primitives, AC 13 and AC 14 (7) | `Button` C25 C26 C27 · icon `Button` C25 · `Toggle` chip C25 · `Toggle` C26 · `InputGroup` C25 · `NumberField` C26 · `Select` C27 · `Combobox` C27 C28 | - |
| pages, AC 16 (4) | Overview C30 · Transactions C30 · Categories C30 · Plans C30 | - |
| page creates, AC 18 (2) | "New category" C32 · "New plan" C32 | - |
| `POST /api/user` statuses (1) | 201 with any header C35 | - |
| AC 20 examples (5) | C34, table-driven over all 5 | - |
| AC 21 examples (3) | C35, table-driven over all 3 | - |
| AC 22 examples (3) | C36, table-driven over all 3 | - |
| AC 23 examples (3) | pt-BR 61.8 C37 · en 61.8 C37 · pt-BR 50 C37 | - |
| Landing doors (3) | badge families C18 C1-C17 · touch tier C25-C29 · page shell C30 C31 | - |

## Swept

- validation: C35 - an invalid `Time-Zone` falls back, never 4xx; `Accept-Language` parsing C34
- failure modes: n/a - presentation, and a sign-up that already commits user and plan in one transaction
- idempotency: existing - a second sign-up with the same email is refused (`EmailAlreadyExistsException`)
- authorization: existing - sign-up stays public and rate limited (`RateLimit.REGISTER_IP`); page creates keep their role gates
- concurrency: n/a - nothing new is written concurrently
- data lifecycle: C36 - the recovered plan path; existing plans are untouched (plan: Out of scope)
- dependency failure: n/a - no external call
- state transitions: n/a - no states change
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** none
- **Dispatched:** frontend build worker (Sonnet), S1-S4 and S6, from the plan commit
- **Boundary:** C1-C33, C37-C38 closed at `b9ea759f`
- **Abandoned:** none
- **Walked:** none yet
