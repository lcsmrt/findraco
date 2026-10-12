package com.lcs.findraco.services;

import com.lcs.findraco.services.ItemShareAllocator.Allocation;
import com.lcs.findraco.services.ItemShareAllocator.MemberFact;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Spec P2 AC 5 / AD-008 / CAT-12: an item's amount is attributed to the transaction's participants in
 * proportion to their shares, allocated in integer cents by largest remainder (ties by member id).
 */
class ItemShareAllocatorTest {

    private static final Long PARENT_CATEGORY = 1L;
    private static final Long ITEM_CATEGORY = 2L;

    private final ItemShareAllocator allocator = new ItemShareAllocator();

    @Test
    void sixtyFortySplitOnThirtyItemAllocatesEighteenAndTwelve() {
        // R$ 100 transaction, shares 60/40, one R$ 30 item.
        List<Object[]> rows = List.of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "30.00", 10L, "60.00"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "30.00", 20L, "40.00"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(
                fact(ITEM_CATEGORY, 10L, "18.00"),
                fact(ITEM_CATEGORY, 20L, "12.00"));
        assertThat(allocation.removed()).containsExactly(
                fact(PARENT_CATEGORY, 10L, "18.00"),
                fact(PARENT_CATEGORY, 20L, "12.00"));
    }

    @Test
    void tenOverThreeUnevenSharesSumsToExactlyTen() {
        // R$ 100 transaction, shares 33.34/33.33/33.33, one R$ 10 item:
        // exact portions 3.334/3.333/3.333 → floors 3.33 each, the leftover cent goes to the largest remainder.
        List<Object[]> rows = List.of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "10.00", 10L, "33.34"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "10.00", 20L, "33.33"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "10.00", 30L, "33.33"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(
                fact(ITEM_CATEGORY, 10L, "3.34"),
                fact(ITEM_CATEGORY, 20L, "3.33"),
                fact(ITEM_CATEGORY, 30L, "3.33"));
        assertThat(sum(allocation.added())).isEqualByComparingTo("10.00");
        assertThat(sum(allocation.removed())).isEqualByComparingTo("10.00");
    }

    @Test
    void tieInRemaindersIsBrokenByLowerMemberId() {
        // 50/50 shares, R$ 0.01 item: both remainders are equal; the cent goes to member 3, not to
        // member 7 that comes first in the rows.
        List<Object[]> rows = List.of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "0.01", 7L, "0.50"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "0.01", 3L, "0.50"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(
                fact(ITEM_CATEGORY, 7L, "0.00"),
                fact(ITEM_CATEGORY, 3L, "0.01"));
    }

    @Test
    void singleParticipantGetsTheWholeItem() {
        List<Object[]> rows = List.<Object[]>of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "42.37", 10L, "150.00"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(fact(ITEM_CATEGORY, 10L, "42.37"));
        assertThat(allocation.removed()).containsExactly(fact(PARENT_CATEGORY, 10L, "42.37"));
    }

    @Test
    void zeroAmountTransactionSplitsTheItemEquallyWithoutLosingCents() {
        // All shares zero: no proportion exists, so the item is split equally (largest remainder,
        // ties by member id) and still sums to the item amount.
        List<Object[]> rows = List.of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "1.01", 20L, "0.00"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "1.01", 10L, "0.00"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(
                fact(ITEM_CATEGORY, 20L, "0.50"),
                fact(ITEM_CATEGORY, 10L, "0.51"));
    }

    @Test
    void uncategorizedTransactionProducesOnlyItemCategoryFacts() {
        // AD-007: B removes item portions from the transaction's category; an uncategorized
        // transaction has nothing to remove from.
        List<Object[]> rows = List.<Object[]>of(
                row(100L, ITEM_CATEGORY, null, "25.00", 10L, "80.00"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(fact(ITEM_CATEGORY, 10L, "25.00"));
        assertThat(allocation.removed()).isEmpty();
    }

    @Test
    void eachItemIsAllocatedOnItsOwn() {
        // Two items of the same transaction, different categories: each item's portions sum to that item.
        Long otherItemCategory = 3L;
        List<Object[]> rows = List.of(
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "30.00", 10L, "60.00"),
                row(100L, ITEM_CATEGORY, PARENT_CATEGORY, "30.00", 20L, "40.00"),
                row(101L, otherItemCategory, PARENT_CATEGORY, "5.00", 10L, "60.00"),
                row(101L, otherItemCategory, PARENT_CATEGORY, "5.00", 20L, "40.00"));

        Allocation allocation = allocator.allocate(rows);

        assertThat(allocation.added()).containsExactly(
                fact(ITEM_CATEGORY, 10L, "18.00"),
                fact(ITEM_CATEGORY, 20L, "12.00"),
                fact(otherItemCategory, 10L, "3.00"),
                fact(otherItemCategory, 20L, "2.00"));
        assertThat(sum(allocation.removed())).isEqualByComparingTo("35.00");
    }

    private static Object[] row(Long itemId, Long itemCategoryId, Long transactionCategoryId,
                                String itemAmount, Long memberId, String shareAmount) {
        return new Object[]{itemId, itemCategoryId, transactionCategoryId,
                new BigDecimal(itemAmount), memberId, new BigDecimal(shareAmount)};
    }

    private static MemberFact fact(Long categoryId, Long memberId, String amount) {
        return new MemberFact(categoryId, memberId, new BigDecimal(amount));
    }

    private static BigDecimal sum(List<MemberFact> facts) {
        return facts.stream().map(MemberFact::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
