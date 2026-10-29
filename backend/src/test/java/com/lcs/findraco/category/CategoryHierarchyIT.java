package com.lcs.findraco.category;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of the two-level category hierarchy rules (spec P1 "Two-level
 * subcategories", AC 1-6; CAT-06): a category is either a root or a child of a root, a child has
 * its parent's type, and a parent outside the plan is hidden behind 404.
 */
class CategoryHierarchyIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    // AC 1 (create)
    @Test
    void ownerCreatesCategoryWithParentAndItIsSavedAsChild() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");

        MvcResult result = create(plan, owner, body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode created = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(created.get("parentId").asLong()).isEqualTo(food.getId());
        Category persisted =
                categoryRepository.findById(created.get("id").asLong()).orElseThrow();
        assertThat(persisted.getParent().getId()).isEqualTo(food.getId());
    }

    // AC 1 (edit)
    @Test
    void ownerEditsRootCategoryGivingItParentAndItIsSavedAsChild() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Food - Delivery");

        MvcResult result = update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode updated = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(updated.get("parentId").asLong()).isEqualTo(food.getId());
        assertThat(updated.get("description").asString()).isEqualTo("Delivery");
        assertThat(categoryRepository
                        .findById(delivery.getId())
                        .orElseThrow()
                        .getParent()
                        .getId())
                .isEqualTo(food.getId());
    }

    // Edge case: a child whose parent is cleared becomes a root again.
    @Test
    void ownerClearsParentAndTheChildBecomesRoot() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);

        MvcResult result = update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", null))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode updated = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(updated.get("parentId").isNull()).isTrue();
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent())
                .isNull();
    }

    // AC 2
    @Test
    void parentThatIsItselfAChildIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);

        create(plan, owner, body("DEBIT", "Pizza", delivery.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-parent-is-subcategory"));

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
    }

    // AC 3
    @Test
    void categoryWithChildrenGivenAParentIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);
        Category essentials = fixtures.aCategory(plan, TransactionType.DEBIT, "Essentials");

        update(plan, owner, food.getId(), body("DEBIT", "Food", essentials.getId()))
                .andExpect(problem(HttpStatus.CONFLICT, "category-subcategories-block-parent"));

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent())
                .isNull();
    }

    // State-transition integrity (CAT-06): a category cannot be its own parent.
    @Test
    void categoryGivenItselfAsParentIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");

        update(plan, owner, food.getId(), body("DEBIT", "Food", food.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-parent-is-itself"));

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent())
                .isNull();
    }

    // AC 4
    @Test
    void parentOfDifferentTypeIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");

        create(plan, owner, body("DEBIT", "Delivery", salary.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-parent-type-mismatch"));
        update(plan, owner, food.getId(), body("DEBIT", "Food", salary.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-parent-type-mismatch"));

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent())
                .isNull();
    }

    // AC 5
    @Test
    void parentFromAnotherPlanRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        Category foreignFood = fixtures.aCategory(otherPlan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery");

        create(plan, owner, body("DEBIT", "Dining out", foreignFood.getId())).andExpect(status().isNotFound());
        update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", foreignFood.getId()))
                .andExpect(status().isNotFound());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(1);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent())
                .isNull();
    }

    // AC 5 (parent id that exists nowhere)
    @Test
    void nonexistentParentRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("DEBIT", "Delivery", 999_999L)).andExpect(status().isNotFound());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 6
    @Test
    void typeChangeOnCategoryWithChildrenIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);

        update(plan, owner, food.getId(), body("CREDIT", "Food", null))
                .andExpect(problem(HttpStatus.CONFLICT, "category-subcategories-block-type-change"));

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getType())
                .isEqualTo(TransactionType.DEBIT);
    }

    @Test
    void typeChangeOfACategoryInUseIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category unused = fixtures.aCategory(plan, TransactionType.DEBIT, "Unused");
        fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, food);

        update(plan, owner, food.getId(), body("CREDIT", "Food", null))
                .andExpect(problem(HttpStatus.CONFLICT, "category-type-change-in-use"));
        update(plan, owner, unused.getId(), body("CREDIT", "Unused", null)).andExpect(status().isOk());

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getType())
                .isEqualTo(TransactionType.DEBIT);
        assertThat(categoryRepository.findById(unused.getId()).orElseThrow().getType())
                .isEqualTo(TransactionType.CREDIT);
    }

    // CAT-04 / AD-004: only the OWNER manages categories, with or without a parent.
    @Test
    void nonOwnerCreateOrUpdateWithParentIsRejectedWith403() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery");

        create(plan, editor, body("DEBIT", "Dining out", food.getId())).andExpect(status().isForbidden());
        update(plan, editor, delivery.getId(), body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isForbidden());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent())
                .isNull();
    }

    private Map<String, Object> body(String type, String description, Long parentId) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("description", description);
        body.put("parentId", parentId);
        return body;
    }

    private ResultActions create(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        return mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions update(Plan plan, User asUser, Long id, Map<String, Object> body) throws Exception {
        return mockMvc.perform(put(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }
}
