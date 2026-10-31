package com.lcs.findraco.category.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    List<Category> findAllByPlan(Plan plan);

    Optional<Category> findByIdAndPlan(Long id, Plan plan);

    /** A page of the list, with the parent and owners its response reads. */
    @Override
    @EntityGraph(attributePaths = {"owner", "parent.owner"})
    Page<Category> findAll(Specification<Category> spec, Pageable pageable);

    /** Loads the member limits of categories already read, in one query, so the page stays cut by the database. */
    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.memberLimits ml LEFT JOIN FETCH ml.member "
            + "WHERE c IN :categories")
    List<Category> fetchMemberLimits(@Param("categories") Collection<Category> categories);

    boolean existsByParent(Category parent);

    /** Every category of the plan with its parent, owner and member limits loaded in one query. */
    @Query("SELECT DISTINCT c FROM Category c "
            + "LEFT JOIN FETCH c.parent LEFT JOIN FETCH c.owner "
            + "LEFT JOIN FETCH c.memberLimits ml LEFT JOIN FETCH ml.member "
            + "WHERE c.plan = :plan")
    List<Category> findAllByPlanWithDetails(@Param("plan") Plan plan);
}
