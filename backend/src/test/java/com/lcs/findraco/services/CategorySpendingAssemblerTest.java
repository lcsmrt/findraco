package com.lcs.findraco.services;

import com.lcs.findraco.dtos.response.CategorySpendingDto;
import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.User;
import com.lcs.findraco.services.ItemShareAllocator.MemberFact;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class CategorySpendingAssemblerTest {

    private static final Long MEMBER = 100L;
    private static final Long OTHER_MEMBER = 200L;
    private static final Set<Long> NO_MEMBERS = Set.of();
    private static final Set<Long> BOTH_MEMBERS = Set.of(MEMBER, OTHER_MEMBER);

    private final CategorySpendingAssembler assembler = new CategorySpendingAssembler();

    // ---- Ported from CategoryBreakdownAssemblerTest (AD-007 partition, Overview breakdown) ----

    @Test
    void workedExampleSplitsGroceryTransactionAcrossItemCategories() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", "500", null);
        FinancialTransactionCategory food = debit(2L, "Food", null, null);
        FinancialTransactionCategory cleaning = debit(3L, "Cleaning", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(1L, MEMBER, "150"));
        List<MemberFact> removed = List.of(fact(1L, MEMBER, "130"));
        List<MemberFact> added = List.of(fact(2L, MEMBER, "90"), fact(3L, MEMBER, "40"));

        List<CategorySpendingDto> result = assembler.assembleOverview(
                rowsA, removed, added, List.of(groceries, food, cleaning), NO_MEMBERS, null);

        assertThat(result).hasSize(3);
        assertThat(byName(result, "Groceries").getSpent()).isEqualByComparingTo("20");
        assertThat(byName(result, "Food").getSpent()).isEqualByComparingTo("90");
        assertThat(byName(result, "Cleaning").getSpent()).isEqualByComparingTo("40");
        assertThat(result).extracting(CategorySpendingDto::getName)
                .containsExactly("Food", "Cleaning", "Groceries");
    }

    @Test
    void nonItemizedTransactionSpendEqualsRawAmount() {
        FinancialTransactionCategory utilities = debit(10L, "Utilities", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(10L, MEMBER, "75"));

        List<CategorySpendingDto> result = assembler.assembleOverview(rowsA, List.of(), List.of(), List.of(utilities), NO_MEMBERS, null);

        assertThat(result).hasSize(1);
        CategorySpendingDto row = result.get(0);
        assertThat(row.getName()).isEqualTo("Utilities");
        assertThat(row.getSpent()).isEqualByComparingTo("75");
    }

    @Test
    void categoryPresentOnlyViaItemsStillAppearsWithItsItemSum() {
        FinancialTransactionCategory subscriptions = debit(5L, "Subscriptions", "100", null);
        List<MemberFact> added = List.of(fact(5L, MEMBER, "25"));

        List<CategorySpendingDto> result = assembler.assembleOverview(List.of(), List.of(), added, List.of(subscriptions), NO_MEMBERS, null);

        assertThat(result).hasSize(1);
        CategorySpendingDto row = result.get(0);
        assertThat(row.getName()).isEqualTo("Subscriptions");
        assertThat(row.getSpent()).isEqualByComparingTo("25");
        assertThat(row.getLimit()).isEqualByComparingTo("100");
    }

    @Test
    void fullyItemizedTransactionLeavesParentCategoryNetZero() {
        FinancialTransactionCategory entertainment = debit(6L, "Entertainment", null, null);
        FinancialTransactionCategory movies = debit(7L, "Movies", null, null);
        FinancialTransactionCategory snacks = debit(8L, "Snacks", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(6L, MEMBER, "200"));
        List<MemberFact> removed = List.of(fact(6L, MEMBER, "200"));
        List<MemberFact> added = List.of(fact(7L, MEMBER, "120"), fact(8L, MEMBER, "80"));

        List<CategorySpendingDto> result = assembler.assembleOverview(
                rowsA, removed, added, List.of(entertainment, movies, snacks), NO_MEMBERS, null);

        assertThat(result).hasSize(3);
        assertThat(byName(result, "Entertainment").getSpent()).isEqualByComparingTo("0");
        assertThat(byName(result, "Movies").getSpent()).isEqualByComparingTo("120");
        assertThat(byName(result, "Snacks").getSpent()).isEqualByComparingTo("80");
    }

    @Test
    void multipleItemRowsForSameCategoryAreSummedNotOverwritten() {
        FinancialTransactionCategory fuel = debit(11L, "Fuel", null, null);
        List<MemberFact> added = List.of(fact(11L, MEMBER, "30"), fact(11L, MEMBER, "45"));

        List<CategorySpendingDto> result = assembler.assembleOverview(List.of(), List.of(), added, List.of(fuel), NO_MEMBERS, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSpent()).isEqualByComparingTo("75");
    }

    @Test
    void zeroSpendCategoryWithLimitIsBackfilledWhenAbsentFromAllRows() {
        FinancialTransactionCategory emergencyFund = debit(20L, "Emergency Fund", "1000", null);
        FinancialTransactionCategory noLimit = debit(21L, "No Limit Category", null, null);
        FinancialTransactionCategory income = category(22L, FinancialTransactionType.CREDIT, "Salary", "2000", null);

        List<CategorySpendingDto> result = assembler.assembleOverview(
                List.of(), List.of(), List.of(), List.of(emergencyFund, noLimit, income), NO_MEMBERS, null);

        assertThat(result).hasSize(1);
        CategorySpendingDto backfilled = result.get(0);
        assertThat(backfilled.getName()).isEqualTo("Emergency Fund");
        assertThat(backfilled.getSpent()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(backfilled.getLimit()).isEqualByComparingTo("1000");
    }

    // ---- New cases: hierarchy rollup and plain limits (CAT-02, CAT-07) ----

    /** P1 Sub AC 7 + 9: a parent's spend is its direct spend plus its children's, against the parent limit. */
    @Test
    void parentRollsUpItsDirectSpendAndAllChildrenAcrossMembers() {
        FinancialTransactionCategory food = debit(1L, "Food", "400", null);
        FinancialTransactionCategory delivery = debit(2L, "Delivery", "200", food);
        FinancialTransactionCategory diningOut = debit(3L, "Dining out", null, food);
        List<Object[]> rowsA = List.of(
                a(1L, MEMBER, "50"),
                a(2L, MEMBER, "60"),
                a(2L, OTHER_MEMBER, "40"),
                a(3L, OTHER_MEMBER, "30"));

        List<CategorySpendingDto> result = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(food, delivery, diningOut), NO_MEMBERS, null);

        assertThat(result).hasSize(1);
        CategorySpendingDto foodRow = result.get(0);
        assertThat(foodRow.getCategoryId()).isEqualTo(1L);
        assertThat(foodRow.getParentId()).isNull();
        assertThat(foodRow.getSpent()).isEqualByComparingTo("180");
        assertThat(foodRow.getLimit()).isEqualByComparingTo("400");
        assertThat(foodRow.getRemaining()).isEqualByComparingTo("220");
        assertThat(foodRow.getPercentUsed()).isEqualByComparingTo("45.00");
        assertThat(foodRow.getOverLimit()).isFalse();
        assertThat(foodRow.getChildren()).extracting(CategorySpendingDto::getName)
                .containsExactly("Delivery", "Dining out");
        assertThat(foodRow.getChildren()).extracting(CategorySpendingDto::getParentId).containsOnly(1L);
    }

    /** P1 Sub AC 8 + 10: a child's spend is its own, and its limit is evaluated independently of the parent's. */
    @Test
    void childIsEvaluatedAloneAgainstItsOwnLimit() {
        FinancialTransactionCategory food = debit(1L, "Food", "400", null);
        FinancialTransactionCategory delivery = debit(2L, "Delivery", "200", food);
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "10"), a(2L, MEMBER, "250"));

        CategorySpendingDto foodRow = assembler.assemble(rowsA, List.of(), List.of(), List.of(food, delivery), NO_MEMBERS, null).get(0);
        CategorySpendingDto deliveryRow = foodRow.getChildren().get(0);

        assertThat(deliveryRow.getSpent()).isEqualByComparingTo("250");
        assertThat(deliveryRow.getLimit()).isEqualByComparingTo("200");
        assertThat(deliveryRow.getRemaining()).isEqualByComparingTo("-50");
        assertThat(deliveryRow.getPercentUsed()).isEqualByComparingTo("125.00");
        assertThat(deliveryRow.getOverLimit()).isTrue();
        assertThat(foodRow.getSpent()).isEqualByComparingTo("260");
        assertThat(foodRow.getOverLimit()).isFalse();
    }

    /** P1 Sub AC 7 with items (AD-007): item portions move spend between children of one parent. */
    @Test
    void itemPartitionAppliesPerLeafBeforeRollup() {
        FinancialTransactionCategory food = debit(1L, "Food", null, null);
        FinancialTransactionCategory groceries = debit(2L, "Groceries", null, food);
        FinancialTransactionCategory cleaning = debit(3L, "Cleaning", null, null);
        List<Object[]> rowsA = List.<Object[]>of(a(2L, MEMBER, "150"));
        List<MemberFact> removed = List.of(fact(2L, MEMBER, "40"));
        List<MemberFact> added = List.of(fact(3L, MEMBER, "40"));

        List<CategorySpendingDto> result = assembler.assemble(rowsA, removed, added, List.of(food, groceries, cleaning), NO_MEMBERS, null);

        assertThat(byName(result, "Food").getSpent()).isEqualByComparingTo("110");
        assertThat(byName(result, "Food").getChildren().get(0).getSpent()).isEqualByComparingTo("110");
        assertThat(byName(result, "Cleaning").getSpent()).isEqualByComparingTo("40");
    }

    /** Edge case: a parent without a limit shows no limit while its child is evaluated on its own. */
    @Test
    void parentWithoutLimitAndChildWithLimit() {
        FinancialTransactionCategory shopping = debit(1L, "Shopping", null, null);
        FinancialTransactionCategory home = debit(2L, "Home", "100", shopping);
        List<Object[]> rowsA = List.<Object[]>of(a(2L, MEMBER, "80"));

        CategorySpendingDto shoppingRow = assembler.assemble(rowsA, List.of(), List.of(), List.of(shopping, home), NO_MEMBERS, null).get(0);
        CategorySpendingDto homeRow = shoppingRow.getChildren().get(0);

        assertThat(shoppingRow.getSpent()).isEqualByComparingTo("80");
        assertThat(shoppingRow.getLimit()).isNull();
        assertThat(shoppingRow.getRemaining()).isNull();
        assertThat(shoppingRow.getPercentUsed()).isNull();
        assertThat(shoppingRow.getOverLimit()).isNull();
        assertThat(homeRow.getLimit()).isEqualByComparingTo("100");
        assertThat(homeRow.getPercentUsed()).isEqualByComparingTo("80.00");
        assertThat(homeRow.getOverLimit()).isFalse();
    }

    /** Edge case + CAT-01: every category is present with R$ 0 when it has no spend; DEBIT before CREDIT. */
    @Test
    void everyCategoryIsPresentWithZeroSpendGroupedByType() {
        FinancialTransactionCategory salary = category(1L, FinancialTransactionType.CREDIT, "Salary", null, null);
        FinancialTransactionCategory bonus = category(2L, FinancialTransactionType.CREDIT, "Bonus", null, salary);
        FinancialTransactionCategory rent = debit(3L, "Rent", null, null);
        FinancialTransactionCategory food = debit(4L, "food", null, null);
        FinancialTransactionCategory delivery = debit(5L, "Delivery", null, food);

        List<CategorySpendingDto> result = assembler.assemble(
                List.of(), List.of(), List.of(), List.of(salary, bonus, rent, food, delivery), NO_MEMBERS, null);

        assertThat(result).extracting(CategorySpendingDto::getName).containsExactly("food", "Rent", "Salary");
        assertThat(result).extracting(CategorySpendingDto::getType).containsExactly(
                FinancialTransactionType.DEBIT, FinancialTransactionType.DEBIT, FinancialTransactionType.CREDIT);
        assertThat(result).allSatisfy(row -> assertThat(row.getSpent()).isEqualByComparingTo("0"));
        assertThat(byName(result, "food").getChildren()).singleElement()
                .satisfies(child -> {
                    assertThat(child.getName()).isEqualTo("Delivery");
                    assertThat(child.getSpent()).isEqualByComparingTo("0");
                });
        assertThat(byName(result, "Salary").getChildren()).extracting(CategorySpendingDto::getName).containsExactly("Bonus");
    }

    /** Edge case: a R$ 0 limit with R$ 0 spend is 0 percent used and not over limit. */
    @Test
    void zeroLimitWithZeroSpendIsNotOverLimit() {
        FinancialTransactionCategory savings = debit(1L, "Savings", "0", null);

        CategorySpendingDto row = assembler.assemble(List.of(), List.of(), List.of(), List.of(savings), NO_MEMBERS, null).get(0);

        assertThat(row.getSpent()).isEqualByComparingTo("0");
        assertThat(row.getPercentUsed()).isEqualByComparingTo("0");
        assertThat(row.getOverLimit()).isFalse();
        assertThat(row.getRemaining()).isEqualByComparingTo("0");
    }

    /** P1 Sub AC 11: the Overview lists roots with rolled-up spend; only children with activity or a limit are nested. */
    @Test
    void overviewListsRootsWithRolledUpSpendAndTheirActiveChildren() {
        FinancialTransactionCategory food = debit(1L, "Food", null, null);
        FinancialTransactionCategory delivery = debit(2L, "Delivery", null, food);
        FinancialTransactionCategory diningOut = debit(3L, "Dining out", null, food);
        FinancialTransactionCategory snacks = debit(4L, "Snacks", "50", food);
        FinancialTransactionCategory idle = debit(5L, "Idle", null, null);
        List<Object[]> rowsA = List.of(a(2L, MEMBER, "30"), a(3L, MEMBER, "70"));

        List<CategorySpendingDto> result = assembler.assembleOverview(
                rowsA, List.of(), List.of(), List.of(food, delivery, diningOut, snacks, idle), NO_MEMBERS, null);

        assertThat(result).extracting(CategorySpendingDto::getName).containsExactly("Food");
        assertThat(result.get(0).getSpent()).isEqualByComparingTo("100");
        assertThat(result.get(0).getChildren()).extracting(CategorySpendingDto::getName)
                .containsExactly("Dining out", "Delivery", "Snacks");
    }

    // ---- Per-member limits and dormancy (CAT-11, CAT-12, CAT-14) ----

    /** P2 AC 2 + Independent Test: 260 / 140 entries make a 400 limit; each member row carries its own amount. */
    @Test
    void categoryLimitIsTheSumOfActiveEntriesAndEachMemberGetsARow() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingDto row = assembler.assemble(
                List.of(), List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, null).get(0);

        assertThat(row.getLimit()).isEqualByComparingTo("400");
        assertThat(row.getMembers()).extracting(CategorySpendingDto.Member::getMemberId)
                .containsExactly(MEMBER, OTHER_MEMBER);
        assertThat(member(row, MEMBER).getName()).isEqualTo("Lucas");
        assertThat(member(row, MEMBER).getLimit()).isEqualByComparingTo("260");
        assertThat(member(row, OTHER_MEMBER).getLimit()).isEqualByComparingTo("140");
        assertThat(row.getMembers()).allSatisfy(m -> assertThat(m.isActive()).isTrue());
    }

    /** P2 AC 5 + 6 + Independent Test: a 50/50 R$ 100 transaction adds R$ 50 to each member, each against their own limit. */
    @Test
    void eachMembersSpendIsTheirShareAgainstTheirOwnLimit() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "40");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "50"), a(1L, OTHER_MEMBER, "50"));

        CategorySpendingDto row = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, null).get(0);

        assertThat(row.getSpent()).isEqualByComparingTo("100");
        assertThat(row.getLimit()).isEqualByComparingTo("300");
        CategorySpendingDto.Member lucas = member(row, MEMBER);
        assertThat(lucas.getSpent()).isEqualByComparingTo("50");
        assertThat(lucas.getRemaining()).isEqualByComparingTo("210");
        assertThat(lucas.getPercentUsed()).isEqualByComparingTo("19.23");
        assertThat(lucas.getOverLimit()).isFalse();
        CategorySpendingDto.Member livia = member(row, OTHER_MEMBER);
        assertThat(livia.getSpent()).isEqualByComparingTo("50");
        assertThat(livia.getRemaining()).isEqualByComparingTo("-10");
        assertThat(livia.getPercentUsed()).isEqualByComparingTo("125.00");
        assertThat(livia.getOverLimit()).isTrue();
    }

    /** P2 AC 5 with items (AD-008): a member's spend is their A - B + I. */
    @Test
    void membersSpendFollowsTheItemPartition() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "100");
        List<Object[]> rowsA = List.<Object[]>of(a(1L, MEMBER, "60"));
        List<MemberFact> removed = List.of(fact(1L, MEMBER, "18"));
        List<MemberFact> added = List.of(fact(1L, MEMBER, "5"));

        CategorySpendingDto row = assembler.assemble(rowsA, removed, added, List.of(groceries), BOTH_MEMBERS, null).get(0);

        assertThat(member(row, MEMBER).getSpent()).isEqualByComparingTo("47");
    }

    /** Assumption "members without a per-member limit": their spend counts in the total, they get no row. */
    @Test
    void memberWithoutAnEntryCountsInTheTotalOnly() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "100"), a(1L, OTHER_MEMBER, "30"));

        CategorySpendingDto row = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, null).get(0);

        assertThat(row.getSpent()).isEqualByComparingTo("130");
        assertThat(row.getLimit()).isEqualByComparingTo("260");
        assertThat(row.getPercentUsed()).isEqualByComparingTo("50.00");
        assertThat(row.getMembers()).extracting(CategorySpendingDto.Member::getMemberId).containsExactly(MEMBER);
    }

    /** P2 AC 11: a former member's entry is listed inactive, left out of the sum and not evaluated. */
    @Test
    void dormantEntryIsListedButExcludedFromTheSumAndEvaluation() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "100"), a(1L, OTHER_MEMBER, "200"));

        CategorySpendingDto row = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(groceries), Set.of(MEMBER), null).get(0);

        assertThat(row.getLimit()).isEqualByComparingTo("260");
        assertThat(row.getSpent()).isEqualByComparingTo("300");
        assertThat(row.getOverLimit()).isTrue();
        CategorySpendingDto.Member former = member(row, OTHER_MEMBER);
        assertThat(former.isActive()).isFalse();
        assertThat(former.getLimit()).isEqualByComparingTo("140");
        assertThat(former.getSpent()).isEqualByComparingTo("200");
        assertThat(former.getRemaining()).isNull();
        assertThat(former.getPercentUsed()).isNull();
        assertThat(former.getOverLimit()).isNull();
    }

    /** P2 AC 11: when every entry is dormant, the category falls back to its plain limit (none here). */
    @Test
    void onlyDormantEntriesLeaveThePlainLimit() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingDto row = assembler.assemble(
                List.of(), List.of(), List.of(), List.of(groceries), Set.of(MEMBER), null).get(0);

        assertThat(row.getLimit()).isNull();
        assertThat(row.getOverLimit()).isNull();
    }

    /** Design "member filter": a row with an active entry for the filtered member shows that member's limit. */
    @Test
    void memberFilteredRowUsesTheMembersOwnLimit() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");
        FinancialTransactionCategory rent = debit(2L, "Rent", "1000", null);
        List<Object[]> rowsA = List.of(a(1L, OTHER_MEMBER, "70"), a(2L, OTHER_MEMBER, "500"));

        List<CategorySpendingDto> result = assembler.assembleOverview(
                rowsA, List.of(), List.of(), List.of(groceries, rent), BOTH_MEMBERS, OTHER_MEMBER);

        CategorySpendingDto groceriesRow = byName(result, "Groceries");
        assertThat(groceriesRow.getLimit()).isEqualByComparingTo("140");
        assertThat(groceriesRow.getPercentUsed()).isEqualByComparingTo("50.00");
        assertThat(byName(result, "Rent").getLimit()).isEqualByComparingTo("1000");
    }

    /** Design "member filter": a dormant entry for the filtered member is not used as the row limit. */
    @Test
    void memberFilterIgnoresTheMembersDormantEntry() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");
        limit(groceries, OTHER_MEMBER, "Livia", "140");

        CategorySpendingDto row = assembler.assemble(
                List.of(), List.of(), List.of(), List.of(groceries), Set.of(MEMBER), OTHER_MEMBER).get(0);

        assertThat(row.getLimit()).isEqualByComparingTo("260");
    }

    /** P2 AC 6 on a parent (CAT-07): a member's row on a parent compares their rolled-up spend with their amount. */
    @Test
    void parentMemberRowsRollUpTheChildrensSpend() {
        FinancialTransactionCategory food = debit(1L, "Food", null, null);
        FinancialTransactionCategory delivery = debit(2L, "Delivery", null, food);
        limit(food, MEMBER, "Lucas", "200");
        limit(food, OTHER_MEMBER, "Livia", "100");
        List<Object[]> rowsA = List.of(a(1L, MEMBER, "40"), a(2L, MEMBER, "60"), a(2L, OTHER_MEMBER, "30"));

        CategorySpendingDto foodRow = assembler.assemble(
                rowsA, List.of(), List.of(), List.of(food, delivery), BOTH_MEMBERS, null).get(0);

        assertThat(foodRow.getSpent()).isEqualByComparingTo("130");
        assertThat(foodRow.getLimit()).isEqualByComparingTo("300");
        assertThat(member(foodRow, MEMBER).getSpent()).isEqualByComparingTo("100");
        assertThat(member(foodRow, MEMBER).getPercentUsed()).isEqualByComparingTo("50.00");
        assertThat(member(foodRow, OTHER_MEMBER).getSpent()).isEqualByComparingTo("30");
        CategorySpendingDto deliveryRow = foodRow.getChildren().get(0);
        assertThat(deliveryRow.getSpent()).isEqualByComparingTo("90");
        assertThat(deliveryRow.getMembers()).isEmpty();
    }

    /** CAT-08 with per-member limits: a category whose only limit is per member is listed in the Overview. */
    @Test
    void overviewListsACategoryWhoseOnlyLimitIsPerMember() {
        FinancialTransactionCategory groceries = debit(1L, "Groceries", null, null);
        limit(groceries, MEMBER, "Lucas", "260");

        List<CategorySpendingDto> result = assembler.assembleOverview(
                List.of(), List.of(), List.of(), List.of(groceries), BOTH_MEMBERS, null);

        assertThat(result).singleElement().satisfies(row -> assertThat(row.getLimit()).isEqualByComparingTo("260"));
    }

    private static CategorySpendingDto.Member member(CategorySpendingDto row, Long memberId) {
        return row.getMembers().stream()
                .filter(m -> m.getMemberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No member row for " + memberId));
    }

    private static void limit(FinancialTransactionCategory category, Long memberId, String name, String amount) {
        CategoryMemberLimit entry = new CategoryMemberLimit();
        entry.setCategory(category);
        entry.setMember(user(memberId, name));
        entry.setAmount(new BigDecimal(amount));
        category.getMemberLimits().add(entry);
    }

    private static User user(Long id, String name) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setName(name);
        return user;
    }

    private static CategorySpendingDto byName(List<CategorySpendingDto> result, String name) {
        return result.stream()
                .filter(dto -> dto.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No category named " + name + " in result: " + result));
    }

    private static FinancialTransactionCategory debit(Long id, String name, String limit,
                                                      FinancialTransactionCategory parent) {
        return category(id, FinancialTransactionType.DEBIT, name, limit, parent);
    }

    private static FinancialTransactionCategory category(Long id, FinancialTransactionType type, String name,
                                                         String limit, FinancialTransactionCategory parent) {
        FinancialTransactionCategory category = new FinancialTransactionCategory();
        ReflectionTestUtils.setField(category, "id", id);
        category.setType(type);
        category.setDescription(name);
        category.setSpendingLimit(limit == null ? null : new BigDecimal(limit));
        category.setParent(parent);
        return category;
    }

    private static Object[] a(Long categoryId, Long memberId, String amount) {
        return new Object[]{categoryId, memberId, new BigDecimal(amount)};
    }

    private static MemberFact fact(Long categoryId, Long memberId, String amount) {
        return new MemberFact(categoryId, memberId, new BigDecimal(amount));
    }
}
