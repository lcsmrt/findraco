package com.lcs.findraco.category.service;

import com.lcs.findraco.category.exception.CategoryExceptions;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import com.lcs.findraco.category.repository.CategoryMemberLimitRepository;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.category.repository.CategorySpecification;
import com.lcs.findraco.category.request.CategoryFilterDto;
import com.lcs.findraco.category.request.CategoryRequestDto;
import com.lcs.findraco.category.request.MemberLimitDto;
import com.lcs.findraco.category.response.CategoryResponseDto;
import com.lcs.findraco.category.response.CategoryUsageDto;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionItemRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
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
    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final CategoryMemberLimitRepository memberLimitRepository;
    private final PlanMembershipRepository planMembershipRepository;
    private final PlanAuthorization planAuthorization;

    public CategoryService(
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository,
            TransactionItemRepository transactionItemRepository,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            CategoryMemberLimitRepository memberLimitRepository,
            PlanMembershipRepository planMembershipRepository,
            PlanAuthorization planAuthorization) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.memberLimitRepository = memberLimitRepository;
        this.planMembershipRepository = planMembershipRepository;
        this.planAuthorization = planAuthorization;
    }

    @Transactional(readOnly = true)
    public Category findById(Long id, PlanContext ctx) {
        return categoryRepository
                .findByIdAndPlan(id, ctx.getPlan())
                .orElseThrow(() -> new CategoryExceptions.CategoryNotFoundException(id));
    }

    /** Usage counts of a category of the plan (CAT-10, P1 Sub AC 18); not in the plan → 404. Any member may read it. */
    @Transactional(readOnly = true)
    public CategoryUsageDto getUsage(Long id, PlanContext ctx) {
        return usageOf(findById(id, ctx));
    }

    private CategoryUsageDto usageOf(Category category) {
        return new CategoryUsageDto(
                transactionRepository.countByCategory(category),
                transactionItemRepository.countByCategory(category),
                recurrenceDefinitionRepository.countByCategory(category));
    }

    @Transactional(readOnly = true)
    public CategoryResponseDto getById(Long id, PlanContext ctx) {
        return new CategoryResponseDto(
                findById(id, ctx), activeMembers(ctx.getPlan()).keySet());
    }

    private static final Set<String> SORTABLE_FIELDS = Set.of("description", "spendingLimit");

    @Transactional(readOnly = true)
    public List<Category> findAllByPlan(PlanContext ctx) {
        return categoryRepository.findAllByPlan(ctx.getPlan());
    }

    @Transactional(readOnly = true)
    public Page<CategoryResponseDto> findAllByPlanPaged(CategoryFilterDto filter, PlanContext ctx) {
        PageRequest pageable = filter.toPageable(SORTABLE_FIELDS);

        Specification<Category> spec = Specification.allOf(
                CategorySpecification.belongsToPlan(ctx.getPlan()),
                CategorySpecification.descriptionContains(filter.getDescription()),
                CategorySpecification.typeEquals(filter.getType()));

        Set<Long> activeMemberIds = activeMembers(ctx.getPlan()).keySet();
        return categoryRepository
                .findAll(spec, pageable)
                .map(category -> new CategoryResponseDto(category, activeMemberIds));
    }

    @Transactional
    public CategoryResponseDto create(CategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        Category category = new Category();

        category.setPlan(ctx.getPlan());
        category.setType(dto.getType());
        category.setDescription(dto.getDescription());
        category.setParent(resolveParent(null, dto, ctx));
        Map<Long, User> activeMembers = activeMembers(ctx.getPlan());
        category.setOwner(resolveOwner(category, dto, activeMembers));
        applyLimits(category, dto, activeMembers);

        return new CategoryResponseDto(categoryRepository.save(category), activeMembers.keySet());
    }

    @Transactional
    public CategoryResponseDto update(Long id, CategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        Category existingCategory = findById(id, ctx);
        boolean hasChildren = categoryRepository.existsByParent(existingCategory);
        if (hasChildren && dto.getType() != existingCategory.getType()) {
            throw new CategoryExceptions.CategoryWithChildrenTypeChangeException();
        }

        Category parent = resolveParent(existingCategory, dto, ctx);
        if (parent != null && hasChildren) {
            throw new CategoryExceptions.CategoryWithChildrenCannotHaveParentException();
        }

        existingCategory.setType(dto.getType());
        existingCategory.setDescription(dto.getDescription());
        existingCategory.setParent(parent);
        Map<Long, User> activeMembers = activeMembers(ctx.getPlan());
        existingCategory.setOwner(resolveOwner(existingCategory, dto, activeMembers));
        if (existingCategory.getOwner() != null
                && hasChildren
                && memberLimitRepository.existsByCategory_Parent(existingCategory)) {
            // Children inherit the owner, and an owned category cannot have per-member limits.
            throw new CategoryExceptions.CategoryMemberLimitsOnOwnedException();
        }
        applyLimits(existingCategory, dto, activeMembers);

        return new CategoryResponseDto(categoryRepository.save(existingCategory), activeMembers.keySet());
    }

    /**
     * Resolves the requested owner (CAT-15): roots only, and an active member. The stored owner is
     * kept when sent back after they left the plan, so a former member's ownership stays dormant
     * until the OWNER clears or changes it (CAT-14). Parent must already be set.
     */
    private User resolveOwner(Category category, CategoryRequestDto dto, Map<Long, User> activeMembers) {
        Long ownerId = dto.getOwnerId();
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
        return planMembershipRepository.findAllByPlan(plan).stream()
                .map(PlanMembership::getUser)
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    /**
     * Applies the plain limit and the per-member limits (CAT-11, CAT-13, CAT-14). Type, parent and
     * owner must already be set. While per-member entries exist the plain limit sent is ignored and
     * the stored one cleared, so the category limit is always the sum of the active entries.
     */
    private void applyLimits(Category category, CategoryRequestDto dto, Map<Long, User> activeMembers) {
        if (dto.getMemberLimits() != null) {
            replaceMemberLimits(category, dto.getMemberLimits(), activeMembers);
        }
        if (category.getMemberLimits().isEmpty()) {
            category.setSpendingLimit(category.getType() == TransactionType.CREDIT ? null : dto.getSpendingLimit());
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
    private void replaceMemberLimits(Category category, List<MemberLimitDto> requested, Map<Long, User> activeMembers) {
        Map<Long, CategoryMemberLimit> stored = category.getMemberLimits().stream()
                .collect(Collectors.toMap(entry -> entry.getMember().getId(), Function.identity()));
        Set<Long> kept = new HashSet<>();
        for (MemberLimitDto request : requested) {
            Long memberId = request.getMemberId();
            if (!kept.add(memberId)) {
                throw new CategoryExceptions.CategoryMemberLimitDuplicateMemberException(memberId);
            }
            CategoryMemberLimit existing = stored.get(memberId);
            User member = activeMembers.get(memberId);
            if (member == null) {
                if (existing == null || existing.getAmount().compareTo(request.getAmount()) != 0) {
                    throw new CategoryExceptions.CategoryMemberLimitInactiveMemberException(memberId);
                }
                continue;
            }
            if (existing != null) {
                existing.setAmount(request.getAmount());
                continue;
            }
            CategoryMemberLimit entry = new CategoryMemberLimit();
            entry.setCategory(category);
            entry.setMember(member);
            entry.setAmount(request.getAmount());
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
    private Category resolveParent(Category self, CategoryRequestDto dto, PlanContext ctx) {
        if (dto.getParentId() == null) {
            return null;
        }
        Category parent = findById(dto.getParentId(), ctx);
        if (self != null && parent.getId().equals(self.getId())) {
            throw new CategoryExceptions.CategoryParentIsItselfException();
        }
        if (parent.getParent() != null) {
            throw new CategoryExceptions.CategoryParentIsChildException(parent.getId());
        }
        if (parent.getType() != dto.getType()) {
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
        planAuthorization.requireCanManageCategories(ctx.getRole());

        Category category = findById(id, ctx);
        Category target = reassignToId == null ? null : resolveReassignTarget(category, reassignToId, ctx);

        if (categoryRepository.existsByParent(category)) {
            throw new CategoryExceptions.CategoryHasChildrenException(id);
        }

        CategoryUsageDto usage = usageOf(category);

        if (usage.inUse() && target == null) {
            throw new CategoryExceptions.CategoryInUseException(
                    id, usage.getTransactions(), usage.getItems(), usage.getRecurrenceDefinitions());
        }
        if (usage.inUse()) {
            transactionRepository.reassignCategory(category, target);
            transactionItemRepository.reassignCategory(category, target);
            recurrenceDefinitionRepository.reassignCategory(category, target);
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
