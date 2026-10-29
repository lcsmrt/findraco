package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionItemRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * What the category feature may read and change about transactions: how many point at a category, and
 * moving them to another one. Kept apart from {@link TransactionService}, which itself resolves
 * categories through the category feature. Callers pass categories already checked to be in their plan.
 */
@Service
public class TransactionCategoryService {

    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final EntityManager entityManager;

    public TransactionCategoryService(
            TransactionRepository transactionRepository,
            TransactionItemRepository transactionItemRepository,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public CategoryReferenceCounts countReferences(long categoryId) {
        Category category = entityManager.getReference(Category.class, categoryId);
        return new CategoryReferenceCounts(
                transactionRepository.countByCategory(category),
                transactionItemRepository.countByCategory(category),
                recurrenceDefinitionRepository.countByCategory(category));
    }

    /** Moves every transaction, item and recurrence definition of one category to another, in one transaction. */
    @Transactional
    public void reassignCategory(long fromCategoryId, long toCategoryId) {
        Category from = entityManager.getReference(Category.class, fromCategoryId);
        Category to = entityManager.getReference(Category.class, toCategoryId);
        transactionRepository.reassignCategory(from, to);
        transactionItemRepository.reassignCategory(from, to);
        recurrenceDefinitionRepository.reassignCategory(from, to);
    }
}
