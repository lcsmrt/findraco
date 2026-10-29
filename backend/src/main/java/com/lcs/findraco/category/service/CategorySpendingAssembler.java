package com.lcs.findraco.category.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import com.lcs.findraco.category.response.CategorySpendingDto;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.ItemShareAllocator;
import com.lcs.findraco.transaction.service.ItemShareAllocator.MemberFact;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;

/**
 * Pure assembler for the category spending tree (AD-007, AD-008).
 * <p>
 * Leaf spend per category x member follows the item-aware partition {@code leaf = A - B + I}: A is the
 * member's participation share of transactions in the category, B the item portions taken out of it,
 * I the item portions of items in the category (B and I come from {@link ItemShareAllocator}).
 * A child's spend is its own leaf spend; a root's spend is its own plus all its children's (CAT-07).
 * Each row's limit is evaluated against that row's spend, so a child limit is independent of the
 * parent's. A row's limit is the sum of its active per-member entries, or its plain limit when there
 * are none. Every member with spend in the row or with a limit entry gets a per-member row (sorted by
 * member id) with their (rolled-up) spend and their own amount, or no limit without an entry (UX-04 AC 1). Entries of users who are not active members are dormant: listed, but left out of
 * the sum and of evaluation (CAT-11, CAT-12, CAT-14). With a member filter, a row with an active entry
 * for that member shows the member's own limit. An owned category (a child inherits its parent's owner)
 * counts the owner's spend only, even after the owner left the plan (the row then reports
 * {@code ownerActive=false}, inherited by the children); every member's share, the owner's included, is
 * listed as a per-member row without a limit (CAT-14, CAT-16). No Spring context or repository is needed;
 * inputs are plain query rows and entities.
 */
@Component
public class CategorySpendingAssembler {

    private static final Comparator<CategorySpendingDto> BY_NAME =
            Comparator.comparing(CategorySpendingDto::getName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));

    private static final Comparator<CategorySpendingDto> BY_SPENT_DESC =
            Comparator.comparing(CategorySpendingDto::getSpent).reversed().thenComparing(BY_NAME);

    /**
     * Every category of the plan, zero-spend included: DEBIT roots then CREDIT roots, each by name,
     * children nested by name (Categories tab, CAT-01/02).
     *
     * @param rowsA      query A rows: {@code [Long categoryId, Long memberId, BigDecimal shareSum]}
     * @param removed    B facts (item portions removed from the transaction's category)
     * @param added      I facts (item portions added to the item's category)
     * @param categories      every category of the plan
     * @param activeMemberIds user ids of the plan's current members
     * @param memberNames     display name by user id, for every member that has spend facts
     * @param memberId        the member filter, or null for the whole plan
     */
    public List<CategorySpendingDto> assemble(
            List<Object[]> rowsA,
            List<MemberFact> removed,
            List<MemberFact> added,
            List<Category> categories,
            Set<Long> activeMemberIds,
            Map<Long, String> memberNames,
            Long memberId) {
        Facts facts = Facts.of(rowsA, removed, added);
        Limits limits = new Limits(activeMemberIds, memberNames, memberId);
        List<CategorySpendingDto> roots = buildTree(facts, limits, categories, category -> true, BY_NAME);

        List<CategorySpendingDto> result = new ArrayList<>();
        roots.stream().filter(root -> root.getType() == TransactionType.DEBIT).forEach(result::add);
        roots.stream().filter(root -> root.getType() != TransactionType.DEBIT).forEach(result::add);
        return result;
    }

    /**
     * The Overview breakdown (CAT-08): DEBIT roots with rolled-up spend, sorted by spend descending.
     * As before the hierarchy, a category is listed when it has spend facts in the period or a limit;
     * a root is also listed when one of its children is.
     */
    public List<CategorySpendingDto> assembleOverview(
            List<Object[]> rowsA,
            List<MemberFact> removed,
            List<MemberFact> added,
            List<Category> categories,
            Set<Long> activeMemberIds,
            Map<Long, String> memberNames,
            Long memberId) {
        Facts facts = Facts.of(rowsA, removed, added);
        Limits limits = new Limits(activeMemberIds, memberNames, memberId);
        Predicate<Category> listed =
                category -> facts.hasActivity(category.getId()) || limits.effective(category) != null;
        List<Category> debit = categories.stream()
                .filter(category -> category.getType() == TransactionType.DEBIT)
                .toList();
        return buildTree(facts, limits, debit, listed, BY_SPENT_DESC);
    }

    private static List<CategorySpendingDto> buildTree(
            Facts facts,
            Limits limits,
            List<Category> categories,
            Predicate<Category> listed,
            Comparator<CategorySpendingDto> order) {
        Set<Long> ids = new HashSet<>();
        categories.forEach(category -> ids.add(category.getId()));

        Map<Long, List<Category>> childrenByParent = new HashMap<>();
        List<Category> roots = new ArrayList<>();
        for (Category category : categories) {
            Category parent = category.getParent();
            if (parent != null && ids.contains(parent.getId())) {
                childrenByParent
                        .computeIfAbsent(parent.getId(), id -> new ArrayList<>())
                        .add(category);
            } else {
                roots.add(category);
            }
        }

        List<CategorySpendingDto> rootNodes = new ArrayList<>();
        for (Category root : roots) {
            List<CategorySpendingDto> childNodes = new ArrayList<>();
            Map<Long, BigDecimal> rolledUp = new LinkedHashMap<>(facts.byMember(root.getId()));
            for (Category child : childrenByParent.getOrDefault(root.getId(), List.of())) {
                Map<Long, BigDecimal> childSpent = facts.byMember(child.getId());
                childSpent.forEach((member, amount) -> rolledUp.merge(member, amount, BigDecimal::add));
                if (listed.test(child)) {
                    childNodes.add(node(child, childSpent, limits, List.of()));
                }
            }
            if (listed.test(root) || !childNodes.isEmpty()) {
                childNodes.sort(order);
                rootNodes.add(node(root, rolledUp, limits, childNodes));
            }
        }
        rootNodes.sort(order);
        return rootNodes;
    }

    /** One row from its spend per member (own for a child, rolled up for a root). */
    private static CategorySpendingDto node(
            Category category, Map<Long, BigDecimal> spentByMember, Limits limits, List<CategorySpendingDto> children) {
        User owner = category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
        if (owner != null) {
            return ownedNode(category, owner, spentByMember, limits, children);
        }
        BigDecimal spent = spentByMember.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<Long, CategoryMemberLimit> entries = new HashMap<>();
        category.getMemberLimits()
                .forEach(entry -> entries.put(entry.getMember().getId(), entry));
        Set<Long> memberIds = new TreeSet<>(entries.keySet());
        spentByMember.forEach((member, amount) -> {
            if (amount.signum() != 0) {
                memberIds.add(member);
            }
        });
        List<CategorySpendingDto.Member> members = memberIds.stream()
                .map(member -> {
                    CategoryMemberLimit entry = entries.get(member);
                    BigDecimal memberSpent = spentByMember.getOrDefault(member, BigDecimal.ZERO);
                    return entry == null
                            ? new CategorySpendingDto.Member(
                                    member,
                                    limits.memberNames().get(member),
                                    memberSpent,
                                    null,
                                    limits.activeMemberIds().contains(member))
                            : new CategorySpendingDto.Member(
                                    member,
                                    entry.getMember().getName(),
                                    memberSpent,
                                    entry.getAmount(),
                                    limits.isActive(entry));
                })
                .toList();
        return new CategorySpendingDto(category, null, spent, limits.forRow(category), members, children);
    }

    /**
     * An owned row (CAT-16): the owner's spend against the category limit; every member with a share,
     * owner included, is listed without a limit, so nothing is hidden (UX-04 AC 1).
     */
    private static CategorySpendingDto ownedNode(
            Category category,
            User owner,
            Map<Long, BigDecimal> spentByMember,
            Limits limits,
            List<CategorySpendingDto> children) {
        BigDecimal spent = spentByMember.getOrDefault(owner.getId(), BigDecimal.ZERO);
        List<CategorySpendingDto.Member> members = spentByMember.entrySet().stream()
                .filter(share -> share.getValue().signum() != 0)
                .sorted(Map.Entry.comparingByKey())
                .map(share -> new CategorySpendingDto.Member(
                        share.getKey(),
                        limits.memberNames().get(share.getKey()),
                        share.getValue(),
                        null,
                        limits.activeMemberIds().contains(share.getKey())))
                .toList();
        boolean ownerActive = limits.activeMemberIds().contains(owner.getId());
        return new CategorySpendingDto(category, ownerActive, spent, limits.forRow(category), members, children);
    }

    /** Limit rules shared by every row: effective limit, dormancy and the member filter. */
    private record Limits(Set<Long> activeMemberIds, Map<Long, String> memberNames, Long memberId) {

        boolean isActive(CategoryMemberLimit entry) {
            return activeMemberIds.contains(entry.getMember().getId());
        }

        /** Sum of the active per-member entries, or the plain limit when there are none (CAT-11). */
        BigDecimal effective(Category category) {
            List<CategoryMemberLimit> active =
                    category.getMemberLimits().stream().filter(this::isActive).toList();
            if (active.isEmpty()) {
                return category.getSpendingLimit();
            }
            return active.stream().map(CategoryMemberLimit::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        /** The row's limit: the filtered member's own active entry when there is one, else the effective limit. */
        BigDecimal forRow(Category category) {
            if (memberId != null) {
                for (CategoryMemberLimit entry : category.getMemberLimits()) {
                    if (entry.getMember().getId().equals(memberId) && isActive(entry)) {
                        return entry.getAmount();
                    }
                }
            }
            return effective(category);
        }
    }

    /** Leaf spend per category x member ({@code A - B + I}). */
    private record Facts(Map<Long, Map<Long, BigDecimal>> leaf, Set<Long> active) {

        static Facts of(List<Object[]> rowsA, List<MemberFact> removed, List<MemberFact> added) {
            Facts facts = new Facts(new LinkedHashMap<>(), new HashSet<>());
            for (Object[] row : rowsA) {
                facts.add((Long) row[0], (Long) row[1], (BigDecimal) row[2]);
                facts.active().add((Long) row[0]);
            }
            for (MemberFact fact : removed) {
                facts.add(fact.categoryId(), fact.memberId(), fact.amount().negate());
            }
            for (MemberFact fact : added) {
                facts.add(fact.categoryId(), fact.memberId(), fact.amount());
                facts.active().add(fact.categoryId());
            }
            return facts;
        }

        private void add(Long categoryId, Long memberId, BigDecimal amount) {
            leaf.computeIfAbsent(categoryId, id -> new LinkedHashMap<>())
                    .merge(memberId, amount == null ? BigDecimal.ZERO : amount, BigDecimal::add);
        }

        Map<Long, BigDecimal> byMember(Long categoryId) {
            return leaf.getOrDefault(categoryId, Map.of());
        }

        boolean hasActivity(Long categoryId) {
            return active.contains(categoryId);
        }
    }
}
