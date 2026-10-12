package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.FinancialTransactionCategoryFilterDto;
import com.lcs.findraco.dtos.request.FinancialTransactionCategoryRequestDto;
import com.lcs.findraco.exceptions.FinancialTransactionCategoryExceptions;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.repositories.RecurrenceDefinitionRepository;
import com.lcs.findraco.repositories.TransactionItemRepository;
import com.lcs.findraco.security.PlanAuthorization;
import com.lcs.findraco.security.PlanContext;
import com.lcs.findraco.specifications.FinancialTransactionCategorySpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class FinancialTransactionCategoryService {

    private final FinancialTransactionCategoryRepository categoryRepository;
    private final FinancialTransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final PlanAuthorization planAuthorization;

    public FinancialTransactionCategoryService(
            FinancialTransactionCategoryRepository categoryRepository,
            FinancialTransactionRepository transactionRepository,
            TransactionItemRepository transactionItemRepository,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            PlanAuthorization planAuthorization) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.planAuthorization = planAuthorization;
    }

    @Transactional(readOnly = true)
    public FinancialTransactionCategory findById(Long id, PlanContext ctx) {
        return categoryRepository.findByIdAndPlan(id, ctx.getPlan())
                .orElseThrow(() -> new FinancialTransactionCategoryExceptions.FinancialTransactionCategoryNotFoundException(id));
    }

    private static final Set<String> SORTABLE_FIELDS = Set.of("description", "spendingLimit");

    @Transactional(readOnly = true)
    public List<FinancialTransactionCategory> findAllByPlan(PlanContext ctx) {
        return categoryRepository.findAllByPlan(ctx.getPlan());
    }

    @Transactional(readOnly = true)
    public Page<FinancialTransactionCategory> findAllByPlanPaged(FinancialTransactionCategoryFilterDto filter, PlanContext ctx) {
        PageRequest pageable = filter.toPageable(SORTABLE_FIELDS);

        Specification<FinancialTransactionCategory> spec = Specification.allOf(
                FinancialTransactionCategorySpecification.belongsToPlan(ctx.getPlan()),
                FinancialTransactionCategorySpecification.descriptionContains(filter.getDescription()),
                FinancialTransactionCategorySpecification.typeEquals(filter.getType()));

        return categoryRepository.findAll(spec, pageable);
    }

    @Transactional
    public FinancialTransactionCategory create(FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        FinancialTransactionCategory category = new FinancialTransactionCategory();

        category.setPlan(ctx.getPlan());
        category.setType(dto.getType());
        category.setDescription(dto.getDescription());
        category.setSpendingLimit(dto.getType() == FinancialTransactionType.CREDIT ? null : dto.getSpendingLimit());
        category.setParent(resolveParent(null, dto, ctx));

        return categoryRepository.save(category);
    }

    @Transactional
    public FinancialTransactionCategory update(Long id, FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
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
        existingCategory.setSpendingLimit(dto.getType() == FinancialTransactionType.CREDIT ? null : dto.getSpendingLimit());
        existingCategory.setParent(parent);

        return categoryRepository.save(existingCategory);
    }

    /**
     * Resolves and validates the requested parent (two-level hierarchy, CAT-06). Returns null when no
     * parent is requested. {@code self} is null on create.
     */
    private FinancialTransactionCategory resolveParent(FinancialTransactionCategory self,
                                                       FinancialTransactionCategoryRequestDto dto,
                                                       PlanContext ctx) {
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
        FinancialTransactionCategory target = reassignToId == null ? null : resolveReassignTarget(category, reassignToId, ctx);

        if (categoryRepository.existsByParent(category)) {
            throw new FinancialTransactionCategoryExceptions.CategoryHasChildrenException(id);
        }

        long transactions = transactionRepository.countByCategory(category);
        long items = transactionItemRepository.countByCategory(category);
        long recurrenceDefinitions = recurrenceDefinitionRepository.countByCategory(category);
        boolean inUse = transactions + items + recurrenceDefinitions > 0;

        if (inUse && target == null) {
            throw new FinancialTransactionCategoryExceptions.CategoryInUseException(id, transactions, items, recurrenceDefinitions);
        }
        if (inUse) {
            transactionRepository.reassignCategory(category, target);
            transactionItemRepository.reassignCategory(category, target);
            recurrenceDefinitionRepository.reassignCategory(category, target);
        }

        categoryRepository.delete(category);
    }

    private FinancialTransactionCategory resolveReassignTarget(FinancialTransactionCategory category,
                                                               Long reassignToId,
                                                               PlanContext ctx) {
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
