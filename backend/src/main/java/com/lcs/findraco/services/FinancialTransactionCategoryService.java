package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.FinancialTransactionCategoryFilterDto;
import com.lcs.findraco.dtos.request.FinancialTransactionCategoryRequestDto;
import com.lcs.findraco.exceptions.FinancialTransactionCategoryExceptions;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
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
    private final PlanAuthorization planAuthorization;

    public FinancialTransactionCategoryService(
            FinancialTransactionCategoryRepository categoryRepository,
            PlanAuthorization planAuthorization) {
        this.categoryRepository = categoryRepository;
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

        return categoryRepository.save(category);
    }

    @Transactional
    public FinancialTransactionCategory update(Long id, FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        FinancialTransactionCategory existingCategory = findById(id, ctx);

        existingCategory.setType(dto.getType());
        existingCategory.setDescription(dto.getDescription());
        existingCategory.setSpendingLimit(dto.getType() == FinancialTransactionType.CREDIT ? null : dto.getSpendingLimit());

        return categoryRepository.save(existingCategory);
    }

    @Transactional
    public void delete(Long id, PlanContext ctx) {
        planAuthorization.requireCanManageCategories(ctx.getRole());

        FinancialTransactionCategory category = findById(id, ctx);
        categoryRepository.delete(category);
    }
}
