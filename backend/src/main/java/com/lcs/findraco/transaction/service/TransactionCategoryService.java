package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionDeletionRepository;
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
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final TransactionDeletionRepository deletionRepository;
    private final EntityManager entityManager;

    public TransactionCategoryService(
            TransactionRepository transactionRepository,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            TransactionDeletionRepository deletionRepository,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.deletionRepository = deletionRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public CategoryReferenceCounts countReferences(long categoryId) {
        Category category = entityManager.getReference(Category.class, categoryId);
        return new CategoryReferenceCounts(
                transactionRepository.countByCategory(category),
                transactionRepository.countItemsByCategory(category),
                recurrenceDefinitionRepository.countByCategory(category));
    }

    /** Moves every transaction, item and recurrence definition of one category to another, in one transaction. */
    @Transactional
    public void reassignCategory(long fromCategoryId, long toCategoryId) {
        Category from = entityManager.getReference(Category.class, fromCategoryId);
        Category to = entityManager.getReference(Category.class, toCategoryId);
        transactionRepository.reassignCategory(from, to);
        transactionRepository.bumpVersionsOfItemsIn(from);
        transactionRepository.reassignItemCategory(from, to);
        deletionRepository.followSeriesCategoryMove(from);
        recurrenceDefinitionRepository.reassignCategory(from, to);
    }

    /** Leaves the transactions, items and definitions still pointing at a category (trashed ones) with none. */
    @Transactional
    public void clearCategory(long categoryId) {
        Category category = entityManager.getReference(Category.class, categoryId);
        transactionRepository.clearCategory(category);
        transactionRepository.bumpVersionsOfItemsIn(category);
        transactionRepository.clearItemCategory(category);
        deletionRepository.followSeriesCategoryMove(category);
        recurrenceDefinitionRepository.clearCategory(category);
    }
}
