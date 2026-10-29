package com.lcs.findraco.category.service;

import com.lcs.findraco.category.exception.CategoryExceptions;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import com.lcs.findraco.category.repository.CategoryMemberLimitRepository;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.category.repository.CategorySpecification;
import com.lcs.findraco.category.request.CategoryFilter;
import com.lcs.findraco.category.request.CategoryMemberLimitRequest;
import com.lcs.findraco.category.request.CreateCategoryRequest;
import com.lcs.findraco.category.request.UpdateCategoryRequest;
import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.category.response.CategoryUsageResponse;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.CategoryReferenceCounts;
import com.lcs.findraco.transaction.service.TransactionCategoryService;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionCategoryService transactionCategoryService;
    private final CategoryMemberLimitRepository memberLimitRepository;
    private final PlanService planService;
    private final PlanAuthorization planAuthorization;
    private final EntityManager entityManager;

    public CategoryService(
            CategoryRepository categoryRepository,
            TransactionCategoryService transactionCategoryService,
            CategoryMemberLimitRepository memberLimitRepository,
            PlanService planService,
            PlanAuthorization planAuthorization,
            EntityManager entityManager) {
        this.categoryRepository = categoryRepository;
        this.transactionCategoryService = transactionCategoryService;
        this.memberLimitRepository = memberLimitRepository;
        this.planService = planService;
        this.planAuthorization = planAuthorization;
        this.entityManager = entityManager;
    }

    private Plan plan(PlanContext ctx) {
        return entityManager.getReference(Plan.class, ctx.planId());
    }

    @Transactional(readOnly = true)
    public Category findById(Long id, PlanContext ctx) {
        return categoryRepository
                .findByIdAndPlan(id, plan(ctx))
                .orElseThrow(() -> new CategoryExceptions.CategoryNotFoundException(id));
    }

    /** Usage counts of a category of the plan (CAT-10, P1 Sub AC 18); not in the plan → 404. Any member may read it. */
    @Transactional(readOnly = true)
    public CategoryUsageResponse getUsage(Long id, PlanContext ctx) {
        return usageOf(findById(id, ctx));
    }

    private CategoryUsageResponse usageOf(Category category) {
        CategoryReferenceCounts counts = transactionCategoryService.countReferences(category.getId());
        return new CategoryUsageResponse(counts.transactions(), counts.items(), counts.recurrenceDefinitions());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id, PlanContext ctx) {
        return CategoryResponse.from(findById(id, ctx), activeMembers(plan(ctx)).keySet());
    }

    @Transactional(readOnly = true)
    public List<Category> findAllByPlan(PlanContext ctx) {
        return categoryRepository.findAllByPlan(plan(ctx));
    }

    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAllByPlanPaged(CategoryFilter filter, PlanContext ctx) {
        PageRequest pageable = filter.toPageable();

        Specification<Category> spec = Specification.allOf(
                CategorySpecification.belongsToPlan(plan(ctx)),
                CategorySpecification.descriptionContains(filter.description()),
                CategorySpecification.typeEquals(filter.type()));

        Set<Long> activeMemberIds = activeMembers(plan(ctx)).keySet();
        Page<Category> page = categoryRepository.findAll(spec, pageable);
        if (page.hasContent()) {
            categoryRepository.fetchMemberLimits(page.getContent());
        }
        return page.map(category -> CategoryResponse.from(category, activeMemberIds));
    }

    @Transactional
    public CategoryResponse create(CreateCategoryRequest dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.role());

        Category category = new Category();

        category.setPlan(plan(ctx));
        category.setType(dto.type());
        category.setDescription(dto.description());
        category.setParent(resolveParent(null, dto.parentId(), dto.type(), ctx));
        Map<Long, User> activeMembers = activeMembers(plan(ctx));
        category.setOwner(resolveOwner(category, dto.ownerId(), activeMembers));
        applyLimits(category, dto.spendingLimit(), dto.memberLimits(), activeMembers);

        return CategoryResponse.from(categoryRepository.save(category), activeMembers.keySet());
    }

    @Transactional
    public CategoryResponse update(Long id, UpdateCategoryRequest dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.role());

        Category existingCategory = findById(id, ctx);
        boolean hasChildren = categoryRepository.existsByParent(existingCategory);
        if (hasChildren && dto.type() != existingCategory.getType()) {
            throw new CategoryExceptions.CategoryWithChildrenTypeChangeException();
        }

        Category parent = resolveParent(existingCategory, dto.parentId(), dto.type(), ctx);
        if (parent != null && hasChildren) {
            throw new CategoryExceptions.CategoryWithChildrenCannotHaveParentException();
        }

        existingCategory.setType(dto.type());
        existingCategory.setDescription(dto.description());
        existingCategory.setParent(parent);
        Map<Long, User> activeMembers = activeMembers(plan(ctx));
        existingCategory.setOwner(resolveOwner(existingCategory, dto.ownerId(), activeMembers));
        if (existingCategory.getOwner() != null
                && hasChildren
                && memberLimitRepository.existsByCategory_Parent(existingCategory)) {
            // Children inherit the owner, and an owned category cannot have per-member limits.
            throw new CategoryExceptions.CategoryMemberLimitsOnOwnedException();
        }
        applyLimits(existingCategory, dto.spendingLimit(), dto.memberLimits(), activeMembers);

        return CategoryResponse.from(categoryRepository.save(existingCategory), activeMembers.keySet());
    }

    /**
     * Resolves the requested owner (CAT-15): roots only, and an active member. The stored owner is
     * kept when sent back after they left the plan, so a former member's ownership stays dormant
     * until the OWNER clears or changes it (CAT-14). Parent must already be set.
     */
    private User resolveOwner(Category category, Long ownerId, Map<Long, User> activeMembers) {
        if (ownerId == null) {
            return null;
        }
        if (category.getParent() != null) {
            throw new CategoryExceptions.CategoryOwnerOnChildException();
        }
        User owner = activeMembers.get(ownerId);
        if (owner != null) {
            return owner;
        }
        User stored = category.getOwner();
        if (stored != null && stored.getId().equals(ownerId)) {
            return stored;
        }
        throw new CategoryExceptions.CategoryOwnerInactiveMemberException(ownerId);
    }

    /** Active members of the plan by user id. A user without a membership row is a former member (CAT-14). */
    private Map<Long, User> activeMembers(Plan plan) {
        return planService.findMemberships(plan.getId()).stream()
                .map(PlanMembership::getUser)
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    /**
     * Applies the plain limit and the per-member limits (CAT-11, CAT-13, CAT-14). Type, parent and
     * owner must already be set. While per-member entries exist the plain limit sent is ignored and
     * the stored one cleared, so the category limit is always the sum of the active entries.
     */
    private void applyLimits(
            Category category,
            BigDecimal spendingLimit,
            List<CategoryMemberLimitRequest> memberLimits,
            Map<Long, User> activeMembers) {
        if (memberLimits != null) {
            replaceMemberLimits(category, memberLimits, activeMembers);
        }
        if (category.getMemberLimits().isEmpty()) {
            category.setSpendingLimit(category.getType() == TransactionType.CREDIT ? null : spendingLimit);
            return;
        }
        if (category.getType() == TransactionType.CREDIT) {
            throw new CategoryExceptions.CategoryMemberLimitsOnCreditException();
        }
        if (effectiveOwner(category) != null) {
            throw new CategoryExceptions.CategoryMemberLimitsOnOwnedException();
        }
        category.setSpendingLimit(null);
    }

    /**
     * Replaces the per-member entries as a set. Entries are updated in place (never deleted and
     * re-inserted) so the unique (category, member) constraint holds within one flush. A former
     * member's stored entry is kept when sent back unchanged and deleted when omitted; it can never be
     * created or changed (CAT-13 AC 7, CAT-14).
     */
    private void replaceMemberLimits(
            Category category, List<CategoryMemberLimitRequest> requested, Map<Long, User> activeMembers) {
        Map<Long, CategoryMemberLimit> stored = category.getMemberLimits().stream()
                .collect(Collectors.toMap(entry -> entry.getMember().getId(), Function.identity()));
        Set<Long> kept = new HashSet<>();
        for (CategoryMemberLimitRequest request : requested) {
            Long memberId = request.memberId();
            if (!kept.add(memberId)) {
                throw new CategoryExceptions.CategoryMemberLimitDuplicateMemberException(memberId);
            }
            CategoryMemberLimit existing = stored.get(memberId);
            User member = activeMembers.get(memberId);
            if (member == null) {
                if (existing == null || existing.getAmount().compareTo(request.amount()) != 0) {
                    throw new CategoryExceptions.CategoryMemberLimitInactiveMemberException(memberId);
                }
                continue;
            }
            if (existing != null) {
                existing.setAmount(request.amount());
                continue;
            }
            CategoryMemberLimit entry = new CategoryMemberLimit();
            entry.setCategory(category);
            entry.setMember(member);
            entry.setAmount(request.amount());
            category.getMemberLimits().add(entry);
        }
        category.getMemberLimits()
                .removeIf(entry -> !kept.contains(entry.getMember().getId()));
    }

    /** A child has its parent's owner (CAT-15 AC 2). */
    private static User effectiveOwner(Category category) {
        return category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
    }

    /**
     * Resolves and validates the requested parent (two-level hierarchy, CAT-06). Returns null when no
     * parent is requested. {@code self} is null on create.
     */
    private Category resolveParent(Category self, Long parentId, TransactionType type, PlanContext ctx) {
        if (parentId == null) {
            return null;
        }
        Category parent = findById(parentId, ctx);
        if (self != null && parent.getId().equals(self.getId())) {
            throw new CategoryExceptions.CategoryParentIsItselfException();
        }
        if (parent.getParent() != null) {
            throw new CategoryExceptions.CategoryParentIsChildException(parent.getId());
        }
        if (parent.getType() != type) {
            throw new CategoryExceptions.CategoryParentTypeMismatchException();
        }
        return parent;
    }

    /**
     * Deletes a category (CAT-10). A given target is validated first (not in the plan → 404; itself,
     * one of its children or another type → 400). A category with children is never deleted (409).
     * A category still referenced by transactions, items or recurrence definitions needs a target
     * (409 without one); every reference is moved to the target and the category deleted in this
     * one transaction, so a failure midway leaves every reference unchanged.
     */
    @Transactional
    public void delete(Long id, Long reassignToId, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.role());

        Category category = findById(id, ctx);
        Category target = reassignToId == null ? null : resolveReassignTarget(category, reassignToId, ctx);

        if (categoryRepository.existsByParent(category)) {
            throw new CategoryExceptions.CategoryHasChildrenException(id);
        }

        CategoryUsageResponse usage = usageOf(category);

        if (usage.inUse() && target == null) {
            throw new CategoryExceptions.CategoryInUseException(
                    id, usage.transactions(), usage.items(), usage.recurrenceDefinitions());
        }
        if (usage.inUse()) {
            transactionCategoryService.reassignCategory(category.getId(), target.getId());
        }

        categoryRepository.delete(category);
    }

    private Category resolveReassignTarget(Category category, Long reassignToId, PlanContext ctx) {
        Category target = findById(reassignToId, ctx);
        if (target.getId().equals(category.getId())) {
            throw new CategoryExceptions.CategoryInvalidReassignTargetException(
                    "a category cannot be moved into itself.");
        }
        if (target.getParent() != null && target.getParent().getId().equals(category.getId())) {
            throw new CategoryExceptions.CategoryInvalidReassignTargetException(
                    "a category cannot be moved into one of its subcategories.");
        }
        if (target.getType() != category.getType()) {
            throw new CategoryExceptions.CategoryInvalidReassignTargetException("the target must have the same type.");
        }
        return target;
    }
}
