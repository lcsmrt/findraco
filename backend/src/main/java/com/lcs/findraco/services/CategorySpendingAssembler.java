package com.lcs.findraco.services;

import com.lcs.findraco.dtos.response.CategorySpendingDto;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.services.ItemShareAllocator.MemberFact;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;

/**
 * Pure assembler for the category spending tree (AD-007, AD-008).
 * <p>
 * Leaf spend per category x member follows the item-aware partition {@code leaf = A - B + I}: A is the
 * member's participation share of transactions in the category, B the item portions taken out of it,
 * I the item portions of items in the category (B and I come from {@link ItemShareAllocator}).
 * A child's spend is its own leaf spend; a root's spend is its own plus all its children's (CAT-07).
 * Each row's limit is evaluated against that row's spend, so a child limit is independent of the
 * parent's. No Spring context or repository is needed; inputs are plain query rows and entities.
 */
@Component
public class CategorySpendingAssembler {

    private static final Comparator<CategorySpendingDto> BY_NAME = Comparator.comparing(
            CategorySpendingDto::getName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));

    private static final Comparator<CategorySpendingDto> BY_SPENT_DESC =
            Comparator.comparing(CategorySpendingDto::getSpent).reversed().thenComparing(BY_NAME);

    /**
     * Every category of the plan, zero-spend included: DEBIT roots then CREDIT roots, each by name,
     * children nested by name (Categories tab, CAT-01/02).
     *
     * @param rowsA      query A rows: {@code [Long categoryId, Long memberId, BigDecimal shareSum]}
     * @param removed    B facts (item portions removed from the transaction's category)
     * @param added      I facts (item portions added to the item's category)
     * @param categories every category of the plan
     */
    public List<CategorySpendingDto> assemble(List<Object[]> rowsA,
                                              List<MemberFact> removed,
                                              List<MemberFact> added,
                                              List<FinancialTransactionCategory> categories) {
        Facts facts = Facts.of(rowsA, removed, added);
        List<CategorySpendingDto> roots = buildTree(facts, categories, category -> true, BY_NAME);

        List<CategorySpendingDto> result = new ArrayList<>();
        roots.stream().filter(root -> root.getType() == FinancialTransactionType.DEBIT).forEach(result::add);
        roots.stream().filter(root -> root.getType() != FinancialTransactionType.DEBIT).forEach(result::add);
        return result;
    }

    /**
     * The Overview breakdown (CAT-08): DEBIT roots with rolled-up spend, sorted by spend descending.
     * As before the hierarchy, a category is listed when it has spend facts in the period or a limit;
     * a root is also listed when one of its children is.
     */
    public List<CategorySpendingDto> assembleOverview(List<Object[]> rowsA,
                                                      List<MemberFact> removed,
                                                      List<MemberFact> added,
                                                      List<FinancialTransactionCategory> categories) {
        Facts facts = Facts.of(rowsA, removed, added);
        Predicate<FinancialTransactionCategory> listed =
                category -> facts.hasActivity(category.getId()) || category.getSpendingLimit() != null;
        List<FinancialTransactionCategory> debit = categories.stream()
                .filter(category -> category.getType() == FinancialTransactionType.DEBIT)
                .toList();
        return buildTree(facts, debit, listed, BY_SPENT_DESC);
    }

    private static List<CategorySpendingDto> buildTree(Facts facts,
                                                       List<FinancialTransactionCategory> categories,
                                                       Predicate<FinancialTransactionCategory> listed,
                                                       Comparator<CategorySpendingDto> order) {
        Set<Long> ids = new HashSet<>();
        categories.forEach(category -> ids.add(category.getId()));

        Map<Long, List<FinancialTransactionCategory>> childrenByParent = new HashMap<>();
        List<FinancialTransactionCategory> roots = new ArrayList<>();
        for (FinancialTransactionCategory category : categories) {
            FinancialTransactionCategory parent = category.getParent();
            if (parent != null && ids.contains(parent.getId())) {
                childrenByParent.computeIfAbsent(parent.getId(), id -> new ArrayList<>()).add(category);
            } else {
                roots.add(category);
            }
        }

        List<CategorySpendingDto> rootNodes = new ArrayList<>();
        for (FinancialTransactionCategory root : roots) {
            List<CategorySpendingDto> childNodes = new ArrayList<>();
            BigDecimal rolledUp = facts.spent(root.getId());
            for (FinancialTransactionCategory child : childrenByParent.getOrDefault(root.getId(), List.of())) {
                BigDecimal childSpent = facts.spent(child.getId());
                rolledUp = rolledUp.add(childSpent);
                if (listed.test(child)) {
                    childNodes.add(node(child, childSpent, List.of()));
                }
            }
            if (listed.test(root) || !childNodes.isEmpty()) {
                childNodes.sort(order);
                rootNodes.add(node(root, rolledUp, childNodes));
            }
        }
        rootNodes.sort(order);
        return rootNodes;
    }

    private static CategorySpendingDto node(FinancialTransactionCategory category, BigDecimal spent,
                                            List<CategorySpendingDto> children) {
        return new CategorySpendingDto(category, spent, category.getSpendingLimit(), List.of(), children);
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

        BigDecimal spent(Long categoryId) {
            return leaf.getOrDefault(categoryId, Map.of()).values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        boolean hasActivity(Long categoryId) {
            return active.contains(categoryId);
        }
    }
}
