package com.lcs.findraco.category.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryMemberLimitRepository extends JpaRepository<CategoryMemberLimit, Long> {
    List<CategoryMemberLimit> findAllByCategory(Category category);

    /** Whether any child of {@code parent} has per-member limits. */
    boolean existsByCategory_Parent(Category parent);
}
