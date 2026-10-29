package com.lcs.findraco.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Allocates each categorized line item's amount across its transaction's participants (AD-008).
 * <p>
 * A participant's portion of an item is {@code itemAmount * share / sum(shares)}, computed in integer
 * cents by the largest remainder method: every portion is floored, then the leftover cents go one by
 * one to the largest fractional remainders, ties broken by the lower member id. The portions of an
 * item therefore always sum to the item amount exactly. When every share is zero (a zero-amount
 * transaction), the item is split equally with the same rule.
 * <p>
 * Each portion yields two facts per category x member: a B fact removing it from the transaction's
 * own category (only when the transaction is categorized) and an I fact adding it to the item's
 * category. Pure logic, no dependencies.
 */
@Component
public class ItemShareAllocator {

    /** One amount attributed to a member within a category. */
    public record MemberFact(Long categoryId, Long memberId, BigDecimal amount) {}

    /**
     * @param removed B facts: item portions taken out of the transaction's category
     * @param added   I facts: item portions added to the item's category
     */
    public record Allocation(List<MemberFact> removed, List<MemberFact> added) {}

    private record Portion(Long memberId, long shareCents) {}

    private record ItemRow(
            Long itemCategoryId, Long transactionCategoryId, long itemCents, List<Portion> participants) {}

    /**
     * @param rows one row per categorized item x participant:
     *             {@code [Long itemId, Long itemCategoryId, Long transactionCategoryId (nullable),
     *             BigDecimal itemAmount, Long memberId, BigDecimal shareAmount]}
     */
    // SPEC_DEVIATION: design.md lists transactionAmount in the row and divides by it.
    // Reason: dividing by the sum of the shares (equal to the amount under SPLIT-01) keeps the
    // leftover cents within [0, participants) even if the invariant is ever broken, and needs no
    // extra column.
    public Allocation allocate(List<Object[]> rows) {
        Map<Long, ItemRow> items = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long itemId = (Long) row[0];
            ItemRow item = items.computeIfAbsent(
                    itemId,
                    id -> new ItemRow((Long) row[1], (Long) row[2], toCents((BigDecimal) row[3]), new ArrayList<>()));
            item.participants().add(new Portion((Long) row[4], toCents((BigDecimal) row[5])));
        }

        List<MemberFact> removed = new ArrayList<>();
        List<MemberFact> added = new ArrayList<>();
        for (ItemRow item : items.values()) {
            for (Portion portion : split(item.itemCents(), item.participants())) {
                BigDecimal amount = BigDecimal.valueOf(portion.shareCents(), 2);
                added.add(new MemberFact(item.itemCategoryId(), portion.memberId(), amount));
                if (item.transactionCategoryId() != null) {
                    removed.add(new MemberFact(item.transactionCategoryId(), portion.memberId(), amount));
                }
            }
        }
        return new Allocation(removed, added);
    }

    private static List<Portion> split(long itemCents, List<Portion> participants) {
        long totalWeight = participants.stream().mapToLong(Portion::shareCents).sum();
        boolean equalSplit = totalWeight == 0;
        long denominator = equalSplit ? participants.size() : totalWeight;

        long[] floors = new long[participants.size()];
        long[] remainders = new long[participants.size()];
        long allocated = 0;
        for (int i = 0; i < participants.size(); i++) {
            long weight = equalSplit ? 1 : participants.get(i).shareCents();
            long numerator = itemCents * weight;
            floors[i] = numerator / denominator;
            remainders[i] = numerator % denominator;
            allocated += floors[i];
        }

        List<Integer> order = new ArrayList<>();
        for (int i = 0; i < participants.size(); i++) {
            order.add(i);
        }
        order.sort(Comparator.<Integer>comparingLong(i -> remainders[i])
                .reversed()
                .thenComparing(i -> participants.get(i).memberId()));
        long leftover = itemCents - allocated;
        for (int k = 0; k < leftover; k++) {
            floors[order.get(k)]++;
        }

        List<Portion> portions = new ArrayList<>();
        for (int i = 0; i < participants.size(); i++) {
            portions.add(new Portion(participants.get(i).memberId(), floors[i]));
        }
        return portions;
    }

    private static long toCents(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.HALF_UP).unscaledValue().longValueExact();
    }
}
