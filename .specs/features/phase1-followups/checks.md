# Phase 1 follow-ups checks

Build: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -DskipITs -Dsurefire.skip=true; cd frontend && pnpm lint; cd frontend && pnpm build; cd frontend && node scripts/check-siblings.ts
Run unit: cd frontend && pnpm exec vitest run --project=unit --reporter=verbose src/features/transactions/components/TransactionFormDrawer.test.tsx
Run stories: cd frontend && pnpm exec vitest run --project=storybook --reporter=verbose src/features/transactions/components/AttributionFields.stories.tsx
Plan: `.specs/features/phase1-followups/plan.md`

14 checks in 2 slices · 1 one-way door · 0 open, of which 0 block

## Checks

### S1 - Restore survives unrelated series changes

**C1** - In a monthly R$ 80 series, March deleted "only this", then April deleted "only this": restoring March answers 200 and March is listed again (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAfterAnotherOnlyThisDeleteSucceeds' -Dsurefire.skip=true

**C2** - March deleted, then May edited "only this" to R$ 95: restoring March answers 200, March is R$ 80 and May stays R$ 95 (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAfterAnOnlyThisEditSucceeds' -Dsurefire.skip=true

**C3** - March deleted, then the series edited "all" to R$ 90: restoring March answers 409 `trash-series-changed`, and the trash entry and March's absence are unchanged (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAfterAnAmountEditConflicts' -Dsurefire.skip=true

**C4** - March deleted, then "June and following" deleted: restoring March answers 409 `trash-series-changed`; restoring the June deletion answers 200 (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAfterTheEndChangedConflicts' -Dsurefire.skip=true

**C5** - Each pattern field changed by an "all" edit after a deletion - description, category, split, end date - makes the restore answer 409, table-driven over the 4 (AC 2)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoreAfterAnyPatternChangeConflicts' -Dsurefire.skip=true

**C6** - An "all" edit that sends the same amount, description, category, split and end with only `requiresConfirmation` flipped leaves March restorable (200) (AC 3)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#flagOnlyEditKeepsTheDeletionRestorable' -Dsurefire.skip=true

**C7** - After the migration, `recurrence_definitions.rule_revision` exists `not null` with default 0, and a deletion row of an active series inserted before `V28` with `definition_version = 3` has `definition_version = 0` (AC 4)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='MigrationsIT#ruleRevisionResetsExistingDeletions' -Dsurefire.skip=true

**C13** - June and following deleted, then March deleted "only this": restoring June answers 200, then restoring March answers 200 and both are listed again (AC 1)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='TrashRuleRevisionIT#restoringOneDeletionKeepsAnotherRestorable' -Dsurefire.skip=true

### S2 - Rows shared with a former member stay editable

**C8** - A R$ 100.00 equal split between the owner and Ana; Ana leaves; the owner edits the amount to 120.00 keeping Ana: 200, Ana's share is 60.00 and the owner's 60.00 (AC 5)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#editKeepingAFormerMemberRecalculatesTheirShare' -Dsurefire.skip=true

**C9** - A monthly series split with Ana; Ana leaves; the owner edits the series "all" to a new amount keeping Ana: 200 and every occurrence still lists Ana (AC 6)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#seriesEditKeepingAFormerMemberSucceeds' -Dsurefire.skip=true

**C10** - Adding Ana (left) to a row she is not on, by edit and by create, both answer 422 `participant-not-member` and the row is unchanged (AC 7)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='FormerMemberEditIT#formerMemberCannotJoinANewRow' -Dsurefire.skip=true

**C11** - MCP `update_transaction` with a new description on a row split equally with Ana (left) succeeds; the row has the new description and Ana keeps her share (AC 8)
Proof: cd backend && JAVA_HOME=$HOME/.jdks/jdk-25.0.5+8 ./mvnw -B -q verify -Dit.test='McpCaptureHubIT#updateOfARowSharedWithAFormerMemberKeepsTheirShare' -Dsurefire.skip=true

**C12** - The edit form of a row split with Ana (left) shows "Ana (fora do plano)" with a checked checkbox, and saving without touching the split sends Ana's `memberId` in `participants` (AC 9)
Proof: run stories | ✓ src/features/transactions/components/AttributionFields.stories.tsx > Former Participant
Proof: run unit | ✓ TransactionFormDrawer > keeps a former member's share when saving

**C14** - In a plan whose only current member is the owner, the edit form of a row split 50/50 with Ana (left) shows the split with "Ana Lima (fora do plano)", and saving it with the amount changed to 120.00 sends both participants (AC 9)
Proof: run unit | ✓ TransactionFormDrawer > shows the split of a row shared with a former member in a one-member plan

## Coverage

| Set (size) | Member -> proof | Unproven |
| --- | --- | --- |
| later series changes that keep a deletion restorable (4) | other "only this" delete C1 · "only this" edit C2 · flag-only edit C6 · another deletion restored C13 | - |
| later series changes that block it (6) | amount C3 · end by tail delete C4 · description C5 · category C5 · split C5 · end date C5 | - |
| door 1: `V28` (2 statements) | column C7 · reset C7 | - |
| participant sources on an edit (3) | current member C8 · former member already on the row C8 · former member not on the row C10 | - |
| edit channels for a former member's row (3) | app row C8 · app series C9 · Claude C11 | - |
| form states of a former participant (3) | shown C12 · kept on save C12 · one-member plan C14 | - |

## Swept

- validation: C10
- failure modes: C3 - a refused restore changes nothing
- idempotency: existing - a restored deletion is gone, so a second restore is 404 (transaction-trash C10)
- authorization: existing - `requireCanModifyTransaction` on edit and restore, unchanged
- concurrency: existing - restore and series edit lock the definition (`findByIdAndPlanForUpdate`); the lock version still guards concurrent edits
- data lifecycle: C7
- dependency failure: n/a - no external call
- state transitions: C1-C6
- observability: n/a - no logging requirement

## Handoff

- **Settled mid-build:** none
- **Dispatched:** build worker (Sonnet) at f21a7229; returned (C1-C14 built)
- **Boundary:** C1-C14 closed at 3df93fd7
- **Abandoned:** none
- **Walked:** local stack (Postgres 5434, jar on 3000, vite preview 5173) at 60530618: Lucas and Ana in one plan, R$ 100 "Pizza dois" split 50/50, Ana left (`POST /plan/{id}/leave`); Lucas opened the row's edit button on Transações - the split shows "Ana Lima (fora do plano)" checked; changed Valor to 120,00 and saved - the API returns Lucas 60.00, Ana 60.00. The first walk at e7a97997 found the split hidden in a one-member plan and Ana's share dropped on save (fixed in 3df93fd7, C14).
