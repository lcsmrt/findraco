package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.shared.web.LikePatterns;
import com.lcs.findraco.transaction.model.Confirmation;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionKindFilter;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class TransactionSpecification {

    public static Specification<Transaction> belongsToPlan(Plan plan) {
        return (root, query, cb) -> cb.equal(root.get("plan"), plan);
    }

    /** Leaves out what the trash holds. */
    public static Specification<Transaction> isActive() {
        return (root, query, cb) -> cb.isNull(root.get("deletion"));
    }

    public static Specification<Transaction> typeEquals(TransactionType type) {
        if (type == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }

    /**
     * Matches transactions in the category or in any of its children (CAT-09), so filtering by a
     * parent returns the parent's and its children's transactions. LEFT join: a category is never
     * duplicated (many-to-one), and the join does not interfere with the category-name ordering.
     */
    public static Specification<Transaction> categoryInTree(Long categoryId) {
        if (categoryId == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> {
            Join<Object, Object> category = root.join("category", JoinType.LEFT);
            return cb.or(
                    cb.equal(category.get("id"), categoryId),
                    cb.equal(category.get("parent").get("id"), categoryId));
        };
    }

    /** One kind, or with {@code NEUTRAL} every row that has a kind. */
    public static Specification<Transaction> hasKind(TransactionKindFilter kind) {
        if (kind == null) {
            return (root, query, cb) -> null;
        }
        if (kind == TransactionKindFilter.NEUTRAL) {
            return (root, query, cb) -> cb.isNotNull(root.get("kind"));
        }
        return (root, query, cb) -> cb.equal(root.get("kind"), TransactionKind.valueOf(kind.name()));
    }

    /** Only transactions with no category that could take one: a neutral kind never does, so it is left out. */
    public static Specification<Transaction> uncategorized(Boolean uncategorized) {
        if (!Boolean.TRUE.equals(uncategorized)) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.and(
                cb.isNull(root.get("category")),
                cb.or(cb.isNull(root.get("kind")), cb.equal(root.get("kind"), TransactionKind.REFUND)));
    }

    /**
     * The transactions {@link Transaction#status} reports as {@code status} for a reader whose day is {@code today}:
     * the same three-way rule, written as a predicate so the database applies it before paging.
     */
    public static Specification<Transaction> hasStatus(TransactionStatus status, LocalDate today) {
        if (status == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> {
            Predicate byDate = cb.equal(root.get("confirmation"), Confirmation.BY_DATE);
            Predicate required = cb.equal(root.get("confirmation"), Confirmation.REQUIRED);
            Predicate confirmed = cb.equal(root.get("confirmation"), Confirmation.CONFIRMED);
            Predicate afterToday = cb.greaterThan(root.get("startDate"), today);
            Predicate beforeToday = cb.lessThan(root.get("startDate"), today);
            return switch (status) {
                case ACTUAL -> cb.or(confirmed, cb.and(byDate, cb.not(afterToday)));
                case FORECAST -> cb.or(cb.and(byDate, afterToday), cb.and(required, cb.not(beforeToday)));
                case PENDING -> cb.and(required, beforeToday);
            };
        };
    }

    /**
     * Restrict to transactions where the given user is a participant. Implemented as an EXISTS
     * subquery (rather than a join) so it never multiplies rows and the paginated count stays correct.
     */
    public static Specification<Transaction> hasParticipant(Long memberId) {
        if (memberId == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> {
            Subquery<Long> sub = query.subquery(Long.class);
            Root<TransactionParticipant> tp = sub.from(TransactionParticipant.class);
            sub.select(tp.get("id"));
            sub.where(
                    cb.equal(tp.get("transaction"), root),
                    cb.equal(tp.get("member").get("id"), memberId));
            return cb.exists(sub);
        };
    }

    /**
     * Search matches EITHER the transaction description OR a participant member's name
     * (case-insensitive substring). The name match is an EXISTS subquery so a row matching on both
     * still appears exactly once — no join-induced duplicates.
     */
    public static Specification<Transaction> matchesSearchTerm(String term) {
        if (term == null || term.isBlank()) {
            return (root, query, cb) -> null;
        }
        String pattern = LikePatterns.contains(term);
        return (root, query, cb) -> {
            Predicate descriptionMatch = cb.like(cb.lower(root.get("description")), pattern, LikePatterns.ESCAPE);

            Subquery<Long> sub = query.subquery(Long.class);
            Root<TransactionParticipant> tp = sub.from(TransactionParticipant.class);
            sub.select(tp.get("id"));
            sub.where(
                    cb.equal(tp.get("transaction"), root),
                    cb.like(cb.lower(tp.get("member").get("name")), pattern, LikePatterns.ESCAPE));

            return cb.or(descriptionMatch, cb.exists(sub));
        };
    }

    public static Specification<Transaction> startDateFrom(LocalDate date) {
        if (date == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), date);
    }

    public static Specification<Transaction> startDateTo(LocalDate date) {
        if (date == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), date);
    }

    public static Specification<Transaction> amountMin(BigDecimal amount) {
        if (amount == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("amount"), amount);
    }

    public static Specification<Transaction> amountMax(BigDecimal amount) {
        if (amount == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("amount"), amount);
    }

    /**
     * Order by category name (the category's {@code description} field). Uses an explicit LEFT JOIN so
     * uncategorized rows are kept, and a null-rank order key so they always sort last in both
     * directions. This spec owns the ordering — the caller passes an unsorted Pageable for this key.
     */
    public static Specification<Transaction> orderByCategoryName(Sort.Direction direction) {
        return (root, query, cb) -> {
            if (isCountQuery(query.getResultType())) {
                return null;
            }
            Join<Object, Object> category = root.join("category", JoinType.LEFT);
            Expression<Integer> nullRank = cb.<Integer>selectCase()
                    .when(cb.isNull(category.get("id")), 1)
                    .otherwise(0)
                    .as(Integer.class);
            Expression<String> name = cb.lower(category.get("description"));
            Order nameOrder = direction.isAscending() ? cb.asc(name) : cb.desc(name);
            query.orderBy(cb.asc(nullRank), nameOrder, cb.asc(root.get("id")));
            return null;
        };
    }

    /**
     * Order each transaction by the name of its largest-share participant, ties broken deterministically
     * by name (so paging is stable). Implemented as a correlated subquery selecting the least member name
     * among participants whose share equals the transaction's maximum share. This spec owns the ordering —
     * the caller passes an unsorted Pageable for this key.
     */
    public static Specification<Transaction> orderByLargestShareParticipant(Sort.Direction direction) {
        return (root, query, cb) -> {
            if (isCountQuery(query.getResultType())) {
                return null;
            }
            Subquery<String> nameSub = query.subquery(String.class);
            Root<TransactionParticipant> tp = nameSub.from(TransactionParticipant.class);

            Subquery<BigDecimal> maxShareSub = nameSub.subquery(BigDecimal.class);
            Root<TransactionParticipant> tpMax = maxShareSub.from(TransactionParticipant.class);
            Expression<BigDecimal> maxShare = tpMax.get("shareAmount");
            maxShareSub.select(cb.max(maxShare));
            maxShareSub.where(cb.equal(tpMax.get("transaction"), root));

            Expression<String> memberName = tp.get("member").get("name");
            Expression<BigDecimal> tpShare = tp.get("shareAmount");
            nameSub.select(cb.least(memberName));
            nameSub.where(cb.equal(tp.get("transaction"), root), cb.equal(tpShare, maxShareSub));

            query.orderBy(direction.isAscending() ? cb.asc(nameSub) : cb.desc(nameSub), cb.asc(root.get("id")));
            return null;
        };
    }

    private static boolean isCountQuery(Class<?> resultType) {
        return Long.class.equals(resultType) || long.class.equals(resultType);
    }
}
