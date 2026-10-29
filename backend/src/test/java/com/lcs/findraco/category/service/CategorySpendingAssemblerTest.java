package com.lcs.findraco.category.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.MemberLimit;
import com.lcs.findraco.category.response.CategoryMemberSpendingResponse;
import com.lcs.findraco.category.response.CategorySpendingResponse;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.ItemShareAllocator.MemberFact;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class CategorySpendingAssemblerTest {

    private static final Long MEMBER = 100L;
    private static final Long OTHER_MEMBER = 200L;
    private static final Set<Long> NO_MEMBERS = Set.of();
    private static final Set<Long> BOTH_MEMBERS = Set.of(MEMBER, OTHER_MEMBER);
    private static final Map<Long, String> NAMES = Map.of(MEMBER, "Lucas", OTHER_MEMBER, "Livia");

    private final CategorySpendingAssembler assembler = new CategorySpendingAssembler();

    // ---- Ported from CategoryBreakdownAssemblerTest (AD-007 partition, Overview breakdown) ----

    @Test
    void workedExampleSplitsGroceryTransactionAcrossItemCategories() {
        Category groceries = debit(1L, "Groceries", "500", null);
        Category food = debit(2L, "Food", null, null);
        Category cleaning = debit(3L, "Cleaning", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(1L, MEMBER, "150"));
        List<MemberFact> removed = List.of(fact(1L, MEMBER, "130"));
        List<MemberFact> added = List.of(fact(2L, MEMBER, "90"), fact(3L, MEMBER, "40"));

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                rowsA, removed, added, List.of(groceries, food, cleaning), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(3);
        assertThat(byName(result, "Groceries").spent()).isEqualByComparingTo("20");
        assertThat(byName(result, "Food").spent()).isEqualByComparingTo("90");
        assertThat(byName(result, "Cleaning").spent()).isEqualByComparingTo("40");
        assertThat(result).extracting(CategorySpendingResponse::name).containsExactly("Food", "Cleaning", "Groceries");
    }

    @Test
    void nonItemizedTransactionSpendEqualsRawAmount() {
        Category utilities = debit(10L, "Utilities", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(10L, MEMBER, "75"));

        List<CategorySpendingResponse> result =
                assembler.assembleOverview(rowsA, List.of(), List.of(), List.of(utilities), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(1);
        CategorySpendingResponse row = result.get(0);
        assertThat(row.name()).isEqualTo("Utilities");
        assertThat(row.spent()).isEqualByComparingTo("75");
    }

    @Test
    void categoryPresentOnlyViaItemsStillAppearsWithItsItemSum() {
        Category subscriptions = debit(5L, "Subscriptions", "100", null);
        List<MemberFact> added = List.of(fact(5L, MEMBER, "25"));

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                List.of(), List.of(), added, List.of(subscriptions), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(1);
        CategorySpendingResponse row = result.get(0);
        assertThat(row.name()).isEqualTo("Subscriptions");
        assertThat(row.spent()).isEqualByComparingTo("25");
        assertThat(row.limit()).isEqualByComparingTo("100");
    }

    @Test
    void fullyItemizedTransactionLeavesParentCategoryNetZero() {
        Category entertainment = debit(6L, "Entertainment", null, null);
        Category movies = debit(7L, "Movies", null, null);
        Category snacks = debit(8L, "Snacks", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(6L, MEMBER, "200"));
        List<MemberFact> removed = List.of(fact(6L, MEMBER, "200"));
        List<MemberFact> added = List.of(fact(7L, MEMBER, "120"), fact(8L, MEMBER, "80"));

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                rowsA, removed, added, List.of(entertainment, movies, snacks), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(3);
        assertThat(byName(result, "Entertainment").spent()).isEqualByComparingTo("0");
        assertThat(byName(result, "Movies").spent()).isEqualByComparingTo("120");
        assertThat(byName(result, "Snacks").spent()).isEqualByComparingTo("80");
    }

    @Test
    void multipleItemRowsForSameCategoryAreSummedNotOverwritten() {
        Category fuel = debit(11L, "Fuel", null, null);
        List<MemberFact> added = List.of(fact(11L, MEMBER, "30"), fact(11L, MEMBER, "45"));

        List<CategorySpendingResponse> result =
                assembler.assembleOverview(List.of(), List.of(), added, List.of(fuel), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).spent()).isEqualByComparingTo("75");
    }

    @Test
    void zeroSpendCategoryWithLimitIsBackfilledWhenAbsentFromAllRows() {
        Category emergencyFund = debit(20L, "Emergency Fund", "1000", null);
        Category noLimit = debit(21L, "No Limit Category", null, null);
        Category income = category(22L, TransactionType.CREDIT, "Salary", "2000", null);

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                List.of(), List.of(), List.of(), List.of(emergencyFund, noLimit, income), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(1);
        CategorySpendingResponse backfilled = result.get(0);
        assertThat(backfilled.name()).isEqualTo("Emergency Fund");
        assertThat(backfilled.spent()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(backfilled.limit()).isEqualByComparingTo("1000");
    }

    // ---- New cases: hierarchy rollup and plain limits (CAT-02, CAT-07) ----

    /** P1 Sub AC 7 + 9: a parent's spend is its direct spend plus its children's, against the parent limit. */
    @Test
    void parentRollsUpItsDirectSpendAndAllChildrenAcrossMembers() {
        Category food = debit(1L, "Food", "400", null);
        Category delivery = debit(2L, "Delivery", "200", food);
        Category diningOut = debit(3L, "Dining out", null, food);
        List<Object[]> rowsA =
                List.of(a(1L, MEMBER, "50"), a(2L, MEMBER, "60"), a(2L, OTHER_MEMBER, "40"), a(3L, OTHER_MEMBER, "30"));

        List<CategorySpendingResponse> result = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(food, delivery, diningOut), NO_MEMBERS, NAMES, null);

        assertThat(result).hasSize(1);
        CategorySpendingResponse foodRow = result.get(0);
        assertThat(foodRow.categoryId()).isEqualTo(1L);
        assertThat(foodRow.parentId()).isNull();
        assertThat(foodRow.spent()).isEqualByComparingTo("180");
        assertThat(foodRow.limit()).isEqualByComparingTo("400");
        assertThat(foodRow.remaining()).isEqualByComparingTo("220");
        assertThat(foodRow.percentUsed()).isEqualByComparingTo("45.00");
        assertThat(foodRow.overLimit()).isFalse();
        assertThat(foodRow.children())
                .extracting(CategorySpendingResponse::name)
                .containsExactly("Delivery", "Dining out");
        assertThat(foodRow.children())
                .extracting(CategorySpendingResponse::parentId)
                .containsOnly(1L);
    }

    /** P1 Sub AC 8 + 10: a child's spend is its own, and its limit is evaluated independently of the parent's. */
    @Test
    void childIsEvaluatedAloneAgainstItsOwnLimit() {
        Category food = debit(1L, "Food", "400", null);
        Category delivery = debit(2L, "Delivery", "200", food);
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "10"), a(2L, MEMBER, "250"));

        CategorySpendingResponse foodRow = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(food, delivery), NO_MEMBERS, NAMES, null)
                .get(0);
        CategorySpendingResponse deliveryRow = foodRow.children().get(0);

        assertThat(deliveryRow.spent()).isEqualByComparingTo("250");
        assertThat(deliveryRow.limit()).isEqualByComparingTo("200");
        assertThat(deliveryRow.remaining()).isEqualByComparingTo("-50");
        assertThat(deliveryRow.percentUsed()).isEqualByComparingTo("125.00");
        assertThat(deliveryRow.overLimit()).isTrue();
        assertThat(foodRow.spent()).isEqualByComparingTo("260");
        assertThat(foodRow.overLimit()).isFalse();
    }

    /** P1 Sub AC 7 with items (AD-007): item portions move spend between children of one parent. */
    @Test
    void itemPartitionAppliesPerLeafBeforeRollup() {
        Category food = debit(1L, "Food", null, null);
        Category groceries = debit(2L, "Groceries", null, food);
        Category cleaning = debit(3L, "Cleaning", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(2L, MEMBER, "150"));
        List<MemberFact> removed = List.of(fact(2L, MEMBER, "40"));
        List<MemberFact> added = List.of(fact(3L, MEMBER, "40"));

        List<CategorySpendingResponse> result =
                assembler.assemble(rowsA, removed, added, List.of(food, groceries, cleaning), NO_MEMBERS, NAMES, null);

        assertThat(byName(result, "Food").spent()).isEqualByComparingTo("110");
        assertThat(byName(result, "Food").children().get(0).spent()).isEqualByComparingTo("110");
        assertThat(byName(result, "Cleaning").spent()).isEqualByComparingTo("40");
    }

    /** Edge case: a parent without a limit shows no limit while its child is evaluated on its own. */
    @Test
    void parentWithoutLimitAndChildWithLimit() {
        Category shopping = debit(1L, "Shopping", null, null);
        Category home = debit(2L, "Home", "100", shopping);
        List<Object[]> rowsA = List.<Object[]>of(a(2L, MEMBER, "80"));

        CategorySpendingResponse shoppingRow = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(shopping, home), NO_MEMBERS, NAMES, null)
                .get(0);
        CategorySpendingResponse homeRow = shoppingRow.children().get(0);

        assertThat(shoppingRow.spent()).isEqualByComparingTo("80");
        assertThat(shoppingRow.limit()).isNull();
        assertThat(shoppingRow.remaining()).isNull();
        assertThat(shoppingRow.percentUsed()).isNull();
        assertThat(shoppingRow.overLimit()).isNull();
        assertThat(homeRow.limit()).isEqualByComparingTo("100");
        assertThat(homeRow.percentUsed()).isEqualByComparingTo("80.00");
        assertThat(homeRow.overLimit()).isFalse();
    }

    /** Edge case + CAT-01: every category is present with R$ 0 when it has no spend; DEBIT before CREDIT. */
    @Test
    void everyCategoryIsPresentWithZeroSpendGroupedByType() {
        Category salary = category(1L, TransactionType.CREDIT, "Salary", null, null);
        Category bonus = category(2L, TransactionType.CREDIT, "Bonus", null, salary);
        Category rent = debit(3L, "Rent", null, null);
        Category food = debit(4L, "food", null, null);
        Category delivery = debit(5L, "Delivery", null, food);

        List<CategorySpendingResponse> result = assembler.assemble(
                List.of(), List.of(), List.of(), List.of(salary, bonus, rent, food, delivery), NO_MEMBERS, NAMES, null);

        assertThat(result).extracting(CategorySpendingResponse::name).containsExactly("food", "Rent", "Salary");
        assertThat(result)
                .extracting(CategorySpendingResponse::type)
                .containsExactly(TransactionType.DEBIT, TransactionType.DEBIT, TransactionType.CREDIT);
        assertThat(result).allSatisfy(row -> assertThat(row.spent()).isEqualByComparingTo("0"));
        assertThat(result).allSatisfy(row -> {
            assertThat(row.ownerId()).isNull();
            assertThat(row.ownerActive()).isNull();
        });
        assertThat(byName(result, "food").children()).singleElement().satisfies(child -> {
            assertThat(child.name()).isEqualTo("Delivery");
            assertThat(child.spent()).isEqualByComparingTo("0");
        });
        assertThat(byName(result, "Salary").children())
                .extracting(CategorySpendingResponse::name)
                .containsExactly("Bonus");
    }

    /** Edge case: a R$ 0 limit with R$ 0 spend is 0 percent used and not over limit. */
    @Test
    void zeroLimitWithZeroSpendIsNotOverLimit() {
        Category savings = debit(1L, "Savings", "0", null);

        CategorySpendingResponse row = assembler
                .assemble(List.of(), List.of(), List.of(), List.of(savings), NO_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.spent()).isEqualByComparingTo("0");
        assertThat(row.percentUsed()).isEqualByComparingTo("0");
        assertThat(row.overLimit()).isFalse();
        assertThat(row.remaining()).isEqualByComparingTo("0");
    }

    /** P1 Sub AC 11: the Overview lists roots with rolled-up spend; only children with activity or a limit are nested. */
    @Test
    void overviewListsRootsWithRolledUpSpendAndTheirActiveChildren() {
        Category food = debit(1L, "Food", null, null);
        Category delivery = debit(2L, "Delivery", null, food);
        Category diningOut = debit(3L, "Dining out", null, food);
        Category snacks = debit(4L, "Snacks", "50", food);
        Category idle = debit(5L, "Idle", null, null);
        List<Object[]> rowsA = List.of(a(2L, MEMBER, "30"), a(3L, MEMBER, "70"));

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                rowsA, List.of(), List.of(), List.of(food, delivery, diningOut, snacks, idle), NO_MEMBERS, NAMES, null);

        assertThat(result).extracting(CategorySpendingResponse::name).containsExactly("Food");
        assertThat(result.get(0).spent()).isEqualByComparingTo("100");
        assertThat(result.get(0).children())
                .extracting(CategorySpendingResponse::name)
                .containsExactly("Dining out", "Delivery", "Snacks");
    }

    // ---- Per-member limits and dormancy (CAT-11, CAT-12, CAT-14) ----

    /** P2 AC 2 + Independent Test: 260 / 140 entries make a 400 limit; each member row carries its own amount. */
    @Test
    void categoryLimitIsTheSumOfActiveEntriesAndEachMemberGetsARow() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingResponse row = assembler
                .assemble(List.of(), List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.limit()).isEqualByComparingTo("400");
        assertThat(row.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, MEMBER).name()).isEqualTo("Lucas");
        assertThat(member(row, MEMBER).limit()).isEqualByComparingTo("260");
        assertThat(member(row, OTHER_MEMBER).limit()).isEqualByComparingTo("140");
        assertThat(row.members()).allSatisfy(m -> assertThat(m.active()).isTrue());
    }

    /** P2 AC 5 + 6 + Independent Test: a 50/50 R$ 100 transaction adds R$ 50 to each member, each against their own limit. */
    @Test
    void eachMembersSpendIsTheirShareAgainstTheirOwnLimit() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "40");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "50"), a(1L, OTHER_MEMBER, "50"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.spent()).isEqualByComparingTo("100");
        assertThat(row.limit()).isEqualByComparingTo("300");
        CategoryMemberSpendingResponse lucas = member(row, MEMBER);
        assertThat(lucas.spent()).isEqualByComparingTo("50");
        assertThat(lucas.remaining()).isEqualByComparingTo("210");
        assertThat(lucas.percentUsed()).isEqualByComparingTo("19.23");
        assertThat(lucas.overLimit()).isFalse();
        CategoryMemberSpendingResponse livia = member(row, OTHER_MEMBER);
        assertThat(livia.spent()).isEqualByComparingTo("50");
        assertThat(livia.remaining()).isEqualByComparingTo("-10");
        assertThat(livia.percentUsed()).isEqualByComparingTo("125.00");
        assertThat(livia.overLimit()).isTrue();
    }

    /** P2 AC 5 with items (AD-008): a member's spend is their A - B + I. */
    @Test
    void membersSpendFollowsTheItemPartition() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "100");
        List<Object[]> rowsA = List.<Object[]>of(a(1L, MEMBER, "60"));
        List<MemberFact> removed = List.of(fact(1L, MEMBER, "18"));
        List<MemberFact> added = List.of(fact(1L, MEMBER, "5"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, removed, added, List.of(groceries), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(member(row, MEMBER).spent()).isEqualByComparingTo("47");
    }

    /** UX-04 AC 1 (supersedes "members without a per-member limit get no row"): listed with spend and no limit. */
    @Test
    void memberWithoutAnEntryCountsInTheTotalOnly() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "100"), a(1L, OTHER_MEMBER, "30"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.spent()).isEqualByComparingTo("130");
        assertThat(row.limit()).isEqualByComparingTo("260");
        assertThat(row.percentUsed()).isEqualByComparingTo("50.00");
        assertThat(row.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, OTHER_MEMBER).spent()).isEqualByComparingTo("30");
        assertThat(member(row, OTHER_MEMBER).limit()).isNull();
        assertThat(member(row, OTHER_MEMBER).overLimit()).isNull();
    }

    /** P2 AC 11: a former member's entry is listed inactive, left out of the sum and not evaluated. */
    @Test
    void dormantEntryIsListedButExcludedFromTheSumAndEvaluation() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "100"), a(1L, OTHER_MEMBER, "200"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(groceries), Set.of(MEMBER), NAMES, null)
                .get(0);

        assertThat(row.limit()).isEqualByComparingTo("260");
        assertThat(row.spent()).isEqualByComparingTo("300");
        assertThat(row.overLimit()).isTrue();
        CategoryMemberSpendingResponse former = member(row, OTHER_MEMBER);
        assertThat(former.active()).isFalse();
        assertThat(former.limit()).isEqualByComparingTo("140");
        assertThat(former.spent()).isEqualByComparingTo("200");
        assertThat(former.remaining()).isNull();
        assertThat(former.percentUsed()).isNull();
        assertThat(former.overLimit()).isNull();
    }

    /** P2 AC 11: when every entry is dormant, the category falls back to its plain limit (none here). */
    @Test
    void onlyDormantEntriesLeaveThePlainLimit() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingResponse row = assembler
                .assemble(List.of(), List.of(), List.of(), List.of(groceries), Set.of(MEMBER), NAMES, null)
                .get(0);

        assertThat(row.limit()).isNull();
        assertThat(row.overLimit()).isNull();
    }

    /** Design "member filter": a row with an active entry for the filtered member shows that member's limit. */
    @Test
    void memberFilteredRowUsesTheMembersOwnLimit() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");
        Category rent = debit(2L, "Rent", "1000", null);
        List<Object[]> rowsA = List.of(a(1L, OTHER_MEMBER, "70"), a(2L, OTHER_MEMBER, "500"));

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                rowsA, List.of(), List.of(), List.of(groceries, rent), BOTH_MEMBERS, NAMES, OTHER_MEMBER);

        CategorySpendingResponse groceriesRow = byName(result, "Groceries");
        assertThat(groceriesRow.limit()).isEqualByComparingTo("140");
        assertThat(groceriesRow.percentUsed()).isEqualByComparingTo("50.00");
        assertThat(byName(result, "Rent").limit()).isEqualByComparingTo("1000");
    }

    /** Design "member filter": a dormant entry for the filtered member is not used as the row limit. */
    @Test
    void memberFilterIgnoresTheMembersDormantEntry() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingResponse row = assembler
                .assemble(List.of(), List.of(), List.of(), List.of(groceries), Set.of(MEMBER), NAMES, OTHER_MEMBER)
                .get(0);

        assertThat(row.limit()).isEqualByComparingTo("260");
    }

    /** P2 AC 6 on a parent (CAT-07): a member's row on a parent compares their rolled-up spend with their amount. */
    @Test
    void parentMemberRowsRollUpTheChildrensSpend() {
        Category food = debit(1L, "Food", null, null);
        Category delivery = debit(2L, "Delivery", null, food);
        limit(food, MEMBER, "Lucas", "200");
        limit(food, OTHER_MEMBER, "Livia", "100");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "40"), a(2L, MEMBER, "60"), a(2L, OTHER_MEMBER, "30"));

        CategorySpendingResponse foodRow = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(food, delivery), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(foodRow.spent()).isEqualByComparingTo("130");
        assertThat(foodRow.limit()).isEqualByComparingTo("300");
        assertThat(member(foodRow, MEMBER).spent()).isEqualByComparingTo("100");
        assertThat(member(foodRow, MEMBER).percentUsed()).isEqualByComparingTo("50.00");
        assertThat(member(foodRow, OTHER_MEMBER).spent()).isEqualByComparingTo("30");
        CategorySpendingResponse deliveryRow = foodRow.children().get(0);
        assertThat(deliveryRow.spent()).isEqualByComparingTo("90");
        assertThat(deliveryRow.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(deliveryRow, MEMBER).spent()).isEqualByComparingTo("60");
        assertThat(member(deliveryRow, MEMBER).limit()).isNull();
        assertThat(member(deliveryRow, OTHER_MEMBER).spent()).isEqualByComparingTo("30");
    }

    /** CAT-08 with per-member limits: a category whose only limit is per member is listed in the Overview. */
    @Test
    void overviewListsACategoryWhoseOnlyLimitIsPerMember() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");

        List<CategorySpendingResponse> result = assembler.assembleOverview(
                List.of(), List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, NAMES, null);

        assertThat(result)
                .singleElement()
                .satisfies(row -> assertThat(row.limit()).isEqualByComparingTo("260"));
    }

    // ---- Owned categories (CAT-16) ----

    /** P3 AC 5: an owned category's spend is the owner's share, evaluated against its limit. */
    @Test
    void ownedCategoryCountsTheOwnersSpendOnly() {
        Category professional = debit(1L, "Professional", "100", null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "120"), a(1L, OTHER_MEMBER, "30"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.ownerId()).isEqualTo(MEMBER);
        assertThat(row.ownerName()).isEqualTo("Lucas");
        assertThat(row.ownerActive()).isTrue();
        assertThat(row.spent()).isEqualByComparingTo("120");
        assertThat(row.limit()).isEqualByComparingTo("100");
        assertThat(row.remaining()).isEqualByComparingTo("-20");
        assertThat(row.percentUsed()).isEqualByComparingTo("120.00");
        assertThat(row.overLimit()).isTrue();
    }

    /** UX-04 AC 1: every share in an owned category, owner's included, is listed without a limit; only the owner's counts. */
    @Test
    void nonOwnerSharesAreListedWithoutALimit() {
        Category professional = debit(1L, "Professional", "100", null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "50"), a(1L, OTHER_MEMBER, "30"), a(1L, 300L, "0"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.spent()).isEqualByComparingTo("50");
        assertThat(row.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, MEMBER).spent()).isEqualByComparingTo("50");
        assertThat(member(row, MEMBER).limit()).isNull();
        assertThat(member(row, MEMBER).overLimit()).isNull();
        assertThat(member(row, MEMBER).active()).isTrue();
        assertThat(member(row, OTHER_MEMBER)).satisfies(other -> {
            assertThat(other.memberId()).isEqualTo(OTHER_MEMBER);
            assertThat(other.name()).isEqualTo("Livia");
            assertThat(other.spent()).isEqualByComparingTo("30");
            assertThat(other.limit()).isNull();
            assertThat(other.remaining()).isNull();
            assertThat(other.percentUsed()).isNull();
            assertThat(other.overLimit()).isNull();
            assertThat(other.active()).isTrue();
        });
    }

    /** P3 AC 2 + 5: children inherit the owner; each row and the rollup count the owner's spend only. */
    @Test
    void childrenOfAnOwnedRootCountTheOwnersSpendOnly() {
        Category professional = debit(1L, "Professional", null, null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        Category courses = debit(2L, "Courses", "50", professional);
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "10"), a(2L, MEMBER, "40"), a(2L, OTHER_MEMBER, "25"));

        CategorySpendingResponse root = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional, courses), BOTH_MEMBERS, NAMES, null)
                .get(0);
        CategorySpendingResponse child = root.children().get(0);

        assertThat(root.spent()).isEqualByComparingTo("50");
        assertThat(child.ownerId()).isEqualTo(MEMBER);
        assertThat(child.ownerActive()).isTrue();
        assertThat(child.spent()).isEqualByComparingTo("40");
        assertThat(child.percentUsed()).isEqualByComparingTo("80.00");
        assertThat(child.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(child, MEMBER).spent()).isEqualByComparingTo("40");
        assertThat(root.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(root, MEMBER).spent()).isEqualByComparingTo("50");
        assertThat(member(root, OTHER_MEMBER).spent()).isEqualByComparingTo("25");
    }

    /** P3 AC 7: a former owner's ownership is dormant, but their historic spend still counts as the row's. */
    @Test
    void dormantOwnerStillAttributesTheirSpend() {
        Category professional = debit(1L, "Professional", "100", null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "70"), a(1L, OTHER_MEMBER, "10"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional), Set.of(OTHER_MEMBER), NAMES, null)
                .get(0);

        assertThat(row.ownerId()).isEqualTo(MEMBER);
        assertThat(row.ownerActive()).isFalse();
        assertThat(row.spent()).isEqualByComparingTo("70");
        assertThat(row.percentUsed()).isEqualByComparingTo("70.00");
    }

    /** P3 AC 7: a former owner is reported inactive on the root and on the children that inherit the owner. */
    @Test
    void formerOwnerIsReportedInactiveOnTheRootAndItsChildren() {
        Category professional = debit(1L, "Professional", null, null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        Category courses = debit(2L, "Courses", null, professional);

        CategorySpendingResponse root = assembler
                .assemble(
                        List.of(),
                        List.of(),
                        List.of(),
                        List.of(professional, courses),
                        Set.of(OTHER_MEMBER),
                        NAMES,
                        null)
                .get(0);

        assertThat(root.ownerActive()).isFalse();
        assertThat(root.children()).singleElement().satisfies(child -> {
            assertThat(child.ownerId()).isEqualTo(MEMBER);
            assertThat(child.ownerName()).isEqualTo("Lucas");
            assertThat(child.ownerActive()).isFalse();
        });
    }

    /** CAT-16 + AD-008: a former member's share in an owned category is listed as inactive. */
    @Test
    void formerMembersShareInAnOwnedCategoryIsListedInactive() {
        Category professional = debit(1L, "Professional", null, null);
        professional.assignOwner(user(MEMBER, "Lucas"));
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "70"), a(1L, OTHER_MEMBER, "10"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional), Set.of(MEMBER), NAMES, null)
                .get(0);

        assertThat(member(row, OTHER_MEMBER).active()).isFalse();
        assertThat(member(row, MEMBER).active()).isTrue();
    }

    // ---- Members on every row (UX-04 AC 1) ----

    /** UX-04 AC 1: a category without limit entries lists every member with spend; Σ members == row spend (root and child). */
    @Test
    void plainCategoriesListEveryMemberWithSpendSummingToTheRow() {
        Category food = debit(1L, "Food", "500", null);
        Category delivery = debit(2L, "Delivery", null, food);
        List<Object[]> rowsA =
                List.of(a(1L, MEMBER, "40"), a(1L, OTHER_MEMBER, "15"), a(2L, MEMBER, "60"), a(2L, OTHER_MEMBER, "30"));
        List<MemberFact> removed = List.of(fact(2L, OTHER_MEMBER, "10"));

        CategorySpendingResponse foodRow = assembler
                .assemble(rowsA, removed, List.of(), List.of(food, delivery), BOTH_MEMBERS, NAMES, null)
                .get(0);
        CategorySpendingResponse deliveryRow = foodRow.children().get(0);

        assertThat(foodRow.spent()).isEqualByComparingTo("135");
        assertThat(foodRow.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(foodRow, MEMBER).name()).isEqualTo("Lucas");
        assertThat(member(foodRow, MEMBER).spent()).isEqualByComparingTo("100");
        assertThat(member(foodRow, OTHER_MEMBER).name()).isEqualTo("Livia");
        assertThat(member(foodRow, OTHER_MEMBER).spent()).isEqualByComparingTo("35");
        assertThat(foodRow.members()).allSatisfy(m -> {
            assertThat(m.limit()).isNull();
            assertThat(m.active()).isTrue();
        });
        assertThat(sumOfMembers(foodRow)).isEqualByComparingTo(foodRow.spent());
        assertThat(deliveryRow.spent()).isEqualByComparingTo("80");
        assertThat(member(deliveryRow, MEMBER).spent()).isEqualByComparingTo("60");
        assertThat(member(deliveryRow, OTHER_MEMBER).spent()).isEqualByComparingTo("20");
        assertThat(sumOfMembers(deliveryRow)).isEqualByComparingTo(deliveryRow.spent());
    }

    /** UX-04 AC 1: a member with a limit entry and no spend is listed with spent 0; a spend-only member has no limit. */
    @Test
    void memberWithAnEntryAndNoSpendIsListedWithZero() {
        Category groceries = debit(1L, "Groceries", null, null);
        limit(groceries, OTHER_MEMBER, "Livia", "140");
        List<Object[]> rowsA = List.<Object[]>of(a(1L, MEMBER, "90"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, OTHER_MEMBER).spent()).isEqualByComparingTo("0");
        assertThat(member(row, OTHER_MEMBER).limit()).isEqualByComparingTo("140");
        assertThat(member(row, OTHER_MEMBER).remaining()).isEqualByComparingTo("140");
        assertThat(member(row, MEMBER).spent()).isEqualByComparingTo("90");
        assertThat(member(row, MEMBER).limit()).isNull();
        assertThat(sumOfMembers(row)).isEqualByComparingTo(row.spent());
    }

    /** UX-04 AC 1: a former member with spend and no limit entry is listed inactive on a plain row. */
    @Test
    void formerMembersSpendOnAPlainCategoryIsListedInactive() {
        Category groceries = debit(1L, "Groceries", "300", null);
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "90"), a(1L, OTHER_MEMBER, "40"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(groceries), Set.of(MEMBER), NAMES, null)
                .get(0);

        assertThat(member(row, OTHER_MEMBER).spent()).isEqualByComparingTo("40");
        assertThat(member(row, OTHER_MEMBER).limit()).isNull();
        assertThat(member(row, OTHER_MEMBER).active()).isFalse();
        assertThat(member(row, MEMBER).active()).isTrue();
    }

    /** UX-04 AC 1: an owned row lists the owner and the others with limit null; the row's spend stays the owner's. */
    @Test
    void ownedRowListsOwnerAndOthersWithoutLimits() {
        Category professional = debit(1L, "Professional", "100", null);
        professional.assignOwner(user(OTHER_MEMBER, "Livia"));
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "20"), a(1L, OTHER_MEMBER, "70"));

        CategorySpendingResponse row = assembler
                .assemble(rowsA, List.of(), List.of(), List.of(professional), BOTH_MEMBERS, NAMES, null)
                .get(0);

        assertThat(row.spent()).isEqualByComparingTo("70");
        assertThat(row.members())
                .extracting(CategoryMemberSpendingResponse::memberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, OTHER_MEMBER).spent()).isEqualByComparingTo("70");
        assertThat(member(row, MEMBER).spent()).isEqualByComparingTo("20");
        assertThat(row.members()).allSatisfy(m -> assertThat(m.limit()).isNull());
    }

    private static BigDecimal sumOfMembers(CategorySpendingResponse row) {
        return row.members().stream()
                .map(CategoryMemberSpendingResponse::spent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static CategoryMemberSpendingResponse member(CategorySpendingResponse row, Long memberId) {
        return row.members().stream()
                .filter(m -> m.memberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No member row for " + memberId));
    }

    private static void limit(Category category, Long memberId, String name, String amount) {
        List<MemberLimit> limits = new ArrayList<>();
        category.getMemberLimits().forEach(entry -> limits.add(new MemberLimit(entry.getMember(), entry.getAmount())));
        limits.add(new MemberLimit(user(memberId, name), new BigDecimal(amount)));
        category.changeLimits(category.getSpendingLimit(), limits);
    }

    private static User user(Long id, String name) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setName(name);
        return user;
    }

    private static CategorySpendingResponse byName(List<CategorySpendingResponse> result, String name) {
        return result.stream()
                .filter(dto -> dto.name().equals(name))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No category named " + name + " in result: " + result));
    }

    private static Category debit(Long id, String name, String limit, Category parent) {
        return category(id, TransactionType.DEBIT, name, limit, parent);
    }

    private static Category category(Long id, TransactionType type, String name, String limit, Category parent) {
        Category category = Category.create(null, type, name, parent);
        ReflectionTestUtils.setField(category, "id", id);
        category.changeLimits(limit == null ? null : new BigDecimal(limit), null);
        return category;
    }

    private static Object[] a(Long categoryId, Long memberId, String amount) {
        return new Object[] {categoryId, memberId, new BigDecimal(amount)};
    }

    private static MemberFact fact(Long categoryId, Long memberId, String amount) {
        return new MemberFact(categoryId, memberId, new BigDecimal(amount));
    }
}
