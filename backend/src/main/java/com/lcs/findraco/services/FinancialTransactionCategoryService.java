package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.FinancialTransactionCategoryFilterDto;
import com.lcs.findraco.dtos.request.FinancialTransactionCategoryRequestDto;
import com.lcs.findraco.dtos.request.MemberLimitDto;
import com.lcs.findraco.dtos.response.CategoryUsageDto;
import com.lcs.findraco.dtos.response.FinancialTransactionCategoryResponseDto;
import com.lcs.findraco.exceptions.FinancialTransactionCategoryExceptions;
import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanMembership;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.CategoryMemberLimitRepository;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.repositories.PlanMembershipRepository;
import com.lcs.findraco.repositories.RecurrenceDefinitionRepository;
import com.lcs.findraco.repositories.TransactionItemRepository;
import com.lcs.findraco.security.PlanAuthorization;
import com.lcs.findraco.security.PlanContext;
import com.lcs.findraco.specifications.FinancialTransactionCategorySpecification;
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
public class FinancialTransactionCategoryService {

    private final FinancialTransactionCategoryRepository categoryRepository;
    private final FinancialTransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final CategoryMemberLimitRepository memberLimitRepository;
    private final PlanMembershipRepository planMembershipRepository;
    private final PlanAuthorization planAuthorization;

    public FinancialTransactionCategoryService(
            FinancialTransactionCategoryRepository categoryRepository,
            FinancialTransactionRepository transactionRepository,
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
    public FinancialTransactionCategory findById(Long id, PlanContext ctx) {
        return categoryRepository
                .findByIdAndPlan(id, ctx.getPlan())
                .orElseThrow(() ->
                        new FinancialTransactionCategoryExceptions.FinancialTransactionCategoryNotFoundException(id));
    }

    /** Usage counts of a category of the plan (CAT-10, P1 Sub AC 18); not in the plan → 404. Any member may read it. */
    @Transactional(readOnly = true)
    public CategoryUsageDto getUsage(Long id, PlanContext ctx) {
        return usageOf(findById(id, ctx));
    }

    private CategoryUsageDto usageOf(FinancialTransactionCategory category) {
        return new CategoryUsageDto(
                transactionRepository.countByCategory(category),
                transactionItemRepository.countByCategory(category),
                recurrenceDefinitionRepository.countByCategory(category));
    }

    @Transactional(readOnly = true)
    public FinancialTransactionCategoryResponseDto getById(Long id, PlanContext ctx) {
        return new FinancialTransactionCategoryResponseDto(
                findById(id, ctx), activeMembers(ctx.getPlan()).keySet());
    }

    private static final Set<String> SORTABLE_FIELDS = Set.of("description", "spendingLimit");

    @Transactional(readOnly = true)
    public List<FinancialTransactionCategory> findAllByPlan(PlanContext ctx) {
        return categoryRepository.findAllByPlan(ctx.getPlan());
    }

    @Transactional(readOnly = true)
    public Page<FinancialTransactionCategoryResponseDto> findAllByPlanPaged(
            FinancialTransactionCategoryFilterDto filter, PlanContext ctx) {
        PageRequest pageable = filter.toPageable(SORTABLE_FIELDS);

        Specification<FinancialTransactionCategory> spec = Specification.allOf(
                FinancialTransactionCategorySpecification.belongsToPlan(ctx.getPlan()),
                FinancialTransactionCategorySpecification.descriptionContains(filter.getDescription()),
                FinancialTransactionCategorySpecification.typeEquals(filter.getType()));

        Set<Long> activeMemberIds = activeMembers(ctx.getPlan()).keySet();
        return categoryRepository
                .findAll(spec, pageable)
                .map(category -> new FinancialTransactionCategoryResponseDto(category, activeMemberIds));
    }

    @Transactional
    public FinancialTransactionCategoryResponseDto create(FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        FinancialTransactionCategory category = new FinancialTransactionCategory();

        category.setPlan(ctx.getPlan());
        category.setType(dto.getType());
        category.setDescription(dto.getDescription());
        category.setParent(resolveParent(null, dto, ctx));
        Map<Long, User> activeMembers = activeMembers(ctx.getPlan());
        category.setOwner(resolveOwner(category, dto, activeMembers));
        applyLimits(category, dto, activeMembers);

        return new FinancialTransactionCategoryResponseDto(categoryRepository.save(category), activeMembers.keySet());
    }

    @Transactional
    public FinancialTransactionCategoryResponseDto update(
            Long id, FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        FinancialTransactionCategory existingCategory = findById(id, ctx);
        boolean hasChildren = categoryRepository.existsByParent(existingCategory);
        if (hasChildren && dto.getType() != existingCategory.getType()) {
            throw new FinancialTransactionCategoryExceptions.CategoryWithChildrenTypeChangeException();
        }

        FinancialTransactionCategory parent = resolveParent(existingCategory, dto, ctx);
        if (parent != null && hasChildren) {
            throw new FinancialTransactionCategoryExceptions.CategoryWithChildrenCannotHaveParentException();
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
            throw new FinancialTransactionCategoryExceptions.CategoryMemberLimitsOnOwnedException();
        }
        applyLimits(existingCategory, dto, activeMembers);

        return new FinancialTransactionCategoryResponseDto(
                categoryRepository.save(existingCategory), activeMembers.keySet());
    }

    /**
     * Resolves the requested owner (CAT-15): roots only, and an active member. The stored owner is
     * kept when sent back after they left the plan, so a former member's ownership stays dormant
     * until the OWNER clears or changes it (CAT-14). Parent must already be set.
     */
    private User resolveOwner(
            FinancialTransactionCategory category,
            FinancialTransactionCategoryRequestDto dto,
            Map<Long, User> activeMembers) {
        Long ownerId = dto.getOwnerId();
        if (ownerId == null) {
            return null;
        }
        if (category.getParent() != null) {
            throw new FinancialTransactionCategoryExceptions.CategoryOwnerOnChildException();
        }
        User owner = activeMembers.get(ownerId);
        if (owner != null) {
            return owner;
        }
        User stored = category.getOwner();
        if (stored != null && stored.getId().equals(ownerId)) {
            return stored;
        }
        throw new FinancialTransactionCategoryExceptions.CategoryOwnerInactiveMemberException(ownerId);
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
    private void applyLimits(
            FinancialTransactionCategory category,
            FinancialTransactionCategoryRequestDto dto,
            Map<Long, User> activeMembers) {
        if (dto.getMemberLimits() != null) {
            replaceMemberLimits(category, dto.getMemberLimits(), activeMembers);
        }
        if (category.getMemberLimits().isEmpty()) {
            category.setSpendingLimit(
                    category.getType() == FinancialTransactionType.CREDIT ? null : dto.getSpendingLimit());
            return;
        }
        if (category.getType() == FinancialTransactionType.CREDIT) {
            throw new FinancialTransactionCategoryExceptions.CategoryMemberLimitsOnCreditException();
        }
        if (effectiveOwner(category) != null) {
            throw new FinancialTransactionCategoryExceptions.CategoryMemberLimitsOnOwnedException();
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
            FinancialTransactionCategory category, List<MemberLimitDto> requested, Map<Long, User> activeMembers) {
        Map<Long, CategoryMemberLimit> stored = category.getMemberLimits().stream()
                .collect(Collectors.toMap(entry -> entry.getMember().getId(), Function.identity()));
        Set<Long> kept = new HashSet<>();
        for (MemberLimitDto request : requested) {
            Long memberId = request.getMemberId();
            if (!kept.add(memberId)) {
                throw new FinancialTransactionCategoryExceptions.CategoryMemberLimitDuplicateMemberException(memberId);
            }
            CategoryMemberLimit existing = stored.get(memberId);
            User member = activeMembers.get(memberId);
            if (member == null) {
                if (existing == null || existing.getAmount().compareTo(request.getAmount()) != 0) {
                    throw new FinancialTransactionCategoryExceptions.CategoryMemberLimitInactiveMemberException(
                            memberId);
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
    private static User effectiveOwner(FinancialTransactionCategory category) {
        return category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
    }

    /**
     * Resolves and validates the requested parent (two-level hierarchy, CAT-06). Returns null when no
     * parent is requested. {@code self} is null on create.
     */
    private FinancialTransactionCategory resolveParent(
            FinancialTransactionCategory self, FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        if (dto.getParentId() == null) {
            return null;
        }
        FinancialTransactionCategory parent = findById(dto.getParentId(), ctx);
        if (self != null && parent.getId().equals(self.getId())) {
            throw new FinancialTransactionCategoryExceptions.CategoryParentIsItselfException();
        }
        if (parent.getParent() != null) {
            throw new FinancialTransactionCategoryExceptions.CategoryParentIsChildException(parent.getId());
        }
        if (parent.getType() != dto.getType()) {
            throw new FinancialTransactionCategoryExceptions.CategoryParentTypeMismatchException();
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

        FinancialTransactionCategory category = findById(id, ctx);
        FinancialTransactionCategory target =
                reassignToId == null ? null : resolveReassignTarget(category, reassignToId, ctx);

        if (categoryRepository.existsByParent(category)) {
            throw new FinancialTransactionCategoryExceptions.CategoryHasChildrenException(id);
        }

        CategoryUsageDto usage = usageOf(category);

        if (usage.inUse() && target == null) {
            throw new FinancialTransactionCategoryExceptions.CategoryInUseException(
                    id, usage.getTransactions(), usage.getItems(), usage.getRecurrenceDefinitions());
        }
        if (usage.inUse()) {
            transactionRepository.reassignCategory(category, target);
            transactionItemRepository.reassignCategory(category, target);
            recurrenceDefinitionRepository.reassignCategory(category, target);
        }

        categoryRepository.delete(category);
    }

    private FinancialTransactionCategory resolveReassignTarget(
            FinancialTransactionCategory category, Long reassignToId, PlanContext ctx) {
        FinancialTransactionCategory target = findById(reassignToId, ctx);
        if (target.getId().equals(category.getId())) {
            throw new FinancialTransactionCategoryExceptions.CategoryInvalidReassignTargetException(
                    "a category cannot be moved into itself.");
        }
        if (target.getParent() != null && target.getParent().getId().equals(category.getId())) {
            throw new FinancialTransactionCategoryExceptions.CategoryInvalidReassignTargetException(
                    "a category cannot be moved into one of its subcategories.");
        }
        if (target.getType() != category.getType()) {
            throw new FinancialTransactionCategoryExceptions.CategoryInvalidReassignTargetException(
                    "the target must have the same type.");
        }
        return target;
    }
}
