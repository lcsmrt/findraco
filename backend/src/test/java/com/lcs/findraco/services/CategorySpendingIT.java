package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.FinancialTransaction;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanRole;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Through-the-API proof of {@code GET .../financial-transaction-category/spending} (spec P1 "Categories
 * tab" AC 2-3 and 8; CAT-01, CAT-02): every category of the plan as DEBIT then CREDIT trees, children
 * nested, with the period's spend and limit usage per row, readable by any plan member.
 */
class CategorySpendingIT extends AbstractIntegrationTest {

    private static final LocalDate TODAY = LocalDate.now();

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    @Autowired
    private FinancialTransactionRepository transactionRepository;

    @Test
    void returnsDebitThenCreditTreesWithNestedChildrenAndLimitUsagePerRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Seed seed = seed(plan, owner);

        JsonNode tree = readSpending(fetchSpending(plan, owner).andExpect(status().isOk()));

        assertThat(tree).hasSize(3);
        assertThat(tree.get(0).get("name").asText()).isEqualTo("Food");
        assertThat(tree.get(1).get("name").asText()).isEqualTo("Rent");
        assertThat(tree.get(2).get("name").asText()).isEqualTo("Salary");
        assertThat(tree.get(0).get("type").asText()).isEqualTo("DEBIT");
        assertThat(tree.get(1).get("type").asText()).isEqualTo("DEBIT");
        assertThat(tree.get(2).get("type").asText()).isEqualTo("CREDIT");

        // Root: direct spend (150) + child (250); the out-of-period transaction is excluded.
        JsonNode food = tree.get(0);
        assertThat(food.get("categoryId").asLong()).isEqualTo(seed.food().getId());
        assertThat(food.get("parentId").isNull()).isTrue();
        assertThat(food.get("spent").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(food.get("limit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(food.get("remaining").decimalValue()).isEqualByComparingTo("0.00");
        assertThat(food.get("percentUsed").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(food.get("overLimit").asBoolean()).isFalse();
        assertThat(food.get("members")).isEmpty();

        // Child: own spend only, evaluated against its own limit → over limit.
        assertThat(food.get("children")).hasSize(1);
        JsonNode delivery = food.get("children").get(0);
        assertThat(delivery.get("categoryId").asLong()).isEqualTo(seed.delivery().getId());
        assertThat(delivery.get("parentId").asLong()).isEqualTo(seed.food().getId());
        assertThat(delivery.get("spent").decimalValue()).isEqualByComparingTo("250.00");
        assertThat(delivery.get("limit").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(delivery.get("remaining").decimalValue()).isEqualByComparingTo("-50.00");
        assertThat(delivery.get("percentUsed").decimalValue()).isEqualByComparingTo("125.00");
        assertThat(delivery.get("overLimit").asBoolean()).isTrue();

        // Zero-spend category without a limit is still listed.
        JsonNode rent = tree.get(1);
        assertThat(rent.get("spent").decimalValue()).isEqualByComparingTo("0");
        assertThat(rent.get("limit").isNull()).isTrue();
        assertThat(rent.get("percentUsed").isNull()).isTrue();
        assertThat(rent.get("overLimit").isNull()).isTrue();
        assertThat(rent.get("children")).isEmpty();

        JsonNode salary = tree.get(2);
        assertThat(salary.get("spent").decimalValue()).isEqualByComparingTo("1000.00");
        assertThat(salary.get("children")).hasSize(1);
        assertThat(salary.get("children").get(0).get("name").asText()).isEqualTo("Bonus");
        assertThat(salary.get("children").get(0).get("spent").decimalValue()).isEqualByComparingTo("0");
    }

    @Test
    void viewerCanReadTheSpendingTree() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        seed(plan, owner);

        JsonNode tree = readSpending(fetchSpending(plan, viewer).andExpect(status().isOk()));

        assertThat(tree).hasSize(3);
        assertThat(tree.get(0).get("name").asText()).isEqualTo("Food");
        assertThat(tree.get(0).get("spent").decimalValue()).isEqualByComparingTo("400.00");
    }

    @Test
    void nonMemberGets404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        seed(plan, owner);
        User outsider = fixtures.aUser();
        fixtures.aPlan(outsider);

        fetchSpending(plan, outsider).andExpect(status().isNotFound());
    }

    @Test
    void missingPeriodIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/spending", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("startDate", TODAY.toString()))
                .andExpect(status().isBadRequest());
    }

    private record Seed(FinancialTransactionCategory food, FinancialTransactionCategory delivery) {}

    /**
     * Food (limit 400) > Delivery (limit 200); Rent (no limit, no spend); Salary (CREDIT) > Bonus.
     * In period: 150 on Food, 250 on Delivery, 1000 on Salary. Out of period: 999 on Food.
     */
    private Seed seed(Plan plan, User owner) {
        FinancialTransactionCategory food = withLimit(fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food"), "400.00");
        FinancialTransactionCategory delivery = withLimit(
                fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food), "200.00");
        fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");
        FinancialTransactionCategory salary = fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Salary");
        fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Bonus", salary);

        fixtures.aTransaction(plan, owner, new BigDecimal("150.00"), FinancialTransactionType.DEBIT, food);
        fixtures.aTransaction(plan, owner, new BigDecimal("250.00"), FinancialTransactionType.DEBIT, delivery);
        fixtures.aTransaction(plan, owner, new BigDecimal("1000.00"), FinancialTransactionType.CREDIT, salary);
        FinancialTransaction old = fixtures.aTransaction(plan, owner, new BigDecimal("999.00"), FinancialTransactionType.DEBIT, food);
        old.setStartDate(TODAY.minusMonths(2));
        transactionRepository.save(old);
        return new Seed(food, delivery);
    }

    private FinancialTransactionCategory withLimit(FinancialTransactionCategory category, String limit) {
        category.setSpendingLimit(new BigDecimal(limit));
        return categoryRepository.save(category);
    }

    private ResultActions fetchSpending(Plan plan, User asUser) throws Exception {
        return mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/spending", plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .param("startDate", TODAY.minusDays(1).toString())
                .param("endDate", TODAY.plusDays(1).toString()));
    }

    private JsonNode readSpending(ResultActions actions) throws Exception {
        MvcResult result = actions.andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
