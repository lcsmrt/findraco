package com.lcs.findraco.category.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import java.util.List;
import org.springframework.data.repository.Repository;

/** Reads of per-member limits. Read-only: they are written through their category. */
public interface CategoryMemberLimitRepository extends Repository<CategoryMemberLimit, Long> {
    List<CategoryMemberLimit> findAllByCategory(Category category);

    /** Whether any child of {@code parent} has per-member limits. */
    boolean existsByCategory_Parent(Category parent);
}
