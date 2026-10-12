package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanRole;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Through-the-API proof of the two-level category hierarchy rules (spec P1 "Two-level
 * subcategories", AC 1-6; CAT-06): a category is either a root or a child of a root, a child has
 * its parent's type, and a parent outside the plan is hidden behind 404.
 */
class CategoryHierarchyIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    // AC 1 (create)
    @Test
    void ownerCreatesCategoryWithParentAndItIsSavedAsChild() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");

        MvcResult result = create(plan, owner, body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode created = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(created.get("parentId").asLong()).isEqualTo(food.getId());
        FinancialTransactionCategory persisted = categoryRepository.findById(created.get("id").asLong()).orElseThrow();
        assertThat(persisted.getParent().getId()).isEqualTo(food.getId());
    }

    // AC 1 (edit)
    @Test
    void ownerEditsRootCategoryGivingItParentAndItIsSavedAsChild() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food - Delivery");

        MvcResult result = update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode updated = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(updated.get("parentId").asLong()).isEqualTo(food.getId());
        assertThat(updated.get("description").asText()).isEqualTo("Delivery");
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent().getId())
                .isEqualTo(food.getId());
    }

    // Edge case: a child whose parent is cleared becomes a root again.
    @Test
    void ownerClearsParentAndTheChildBecomesRoot() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);

        MvcResult result = update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", null))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode updated = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(updated.get("parentId").isNull()).isTrue();
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent()).isNull();
    }

    // AC 2
    @Test
    void parentThatIsItselfAChildIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);

        create(plan, owner, body("DEBIT", "Pizza", delivery.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
    }

    // AC 3
    @Test
    void categoryWithChildrenGivenAParentIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);
        FinancialTransactionCategory essentials = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Essentials");

        update(plan, owner, food.getId(), body("DEBIT", "Food", essentials.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent()).isNull();
    }

    // State-transition integrity (CAT-06): a category cannot be its own parent.
    @Test
    void categoryGivenItselfAsParentIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");

        update(plan, owner, food.getId(), body("DEBIT", "Food", food.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent()).isNull();
    }

    // AC 4
    @Test
    void parentOfDifferentTypeIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory salary = fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Salary");
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");

        create(plan, owner, body("DEBIT", "Delivery", salary.getId()))
                .andExpect(status().isBadRequest());
        update(plan, owner, food.getId(), body("DEBIT", "Food", salary.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getParent()).isNull();
    }

    // AC 5
    @Test
    void parentFromAnotherPlanRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        FinancialTransactionCategory foreignFood = fixtures.aCategory(otherPlan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery");

        create(plan, owner, body("DEBIT", "Dining out", foreignFood.getId()))
                .andExpect(status().isNotFound());
        update(plan, owner, delivery.getId(), body("DEBIT", "Delivery", foreignFood.getId()))
                .andExpect(status().isNotFound());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(1);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent()).isNull();
    }

    // AC 5 (parent id that exists nowhere)
    @Test
    void nonexistentParentRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("DEBIT", "Delivery", 999_999L))
                .andExpect(status().isNotFound());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 6
    @Test
    void typeChangeOnCategoryWithChildrenIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);

        update(plan, owner, food.getId(), body("CREDIT", "Food", null))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getType())
                .isEqualTo(FinancialTransactionType.DEBIT);
    }

    // CAT-04 / AD-004: only the OWNER manages categories, with or without a parent.
    @Test
    void nonOwnerCreateOrUpdateWithParentIsRejectedWith403() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery");

        create(plan, editor, body("DEBIT", "Dining out", food.getId()))
                .andExpect(status().isForbidden());
        update(plan, editor, delivery.getId(), body("DEBIT", "Delivery", food.getId()))
                .andExpect(status().isForbidden());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getParent()).isNull();
    }

    private Map<String, Object> body(String type, String description, Long parentId) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("description", description);
        body.put("parentId", parentId);
        return body;
    }

    private ResultActions create(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        return mockMvc.perform(post(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY, plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions update(Plan plan, User asUser, Long id, Map<String, Object> body) throws Exception {
        return mockMvc.perform(put(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }
}
