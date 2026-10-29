package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.FinancialTransactionCategory;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.FinancialTransaction;
import com.lcs.findraco.transaction.model.FinancialTransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.StreamSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of the transaction list's {@code categoryId} filter over the category
 * hierarchy (spec P1 "Two-level subcategories" AC 12; CAT-09).
 */
class TransactionCategoryFilterIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void filteringByParentReturnsParentAndChildTransactions() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Seed seed = seed(plan, owner);

        JsonNode page = list(plan, owner, seed.food().getId());

        assertThat(ids(page))
                .containsExactlyInAnyOrder(
                        seed.inFood().getId(),
                        seed.inDelivery().getId(),
                        seed.inDiningOut().getId());
        assertThat(page.get("totalElements").asLong()).isEqualTo(3);
    }

    @Test
    void filteringByChildReturnsOnlyTheChildTransactions() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Seed seed = seed(plan, owner);

        JsonNode page = list(plan, owner, seed.delivery().getId());

        assertThat(ids(page)).containsExactly(seed.inDelivery().getId());
        assertThat(page.get("totalElements").asLong()).isEqualTo(1);
    }

    private record Seed(
            FinancialTransactionCategory food,
            FinancialTransactionCategory delivery,
            FinancialTransaction inFood,
            FinancialTransaction inDelivery,
            FinancialTransaction inDiningOut) {}

    /** Food > Delivery, Food > Dining out, plus an unrelated root (Rent) and an uncategorized transaction. */
    private Seed seed(Plan plan, User owner) {
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery =
                fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);
        FinancialTransactionCategory diningOut =
                fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Dining out", food);
        FinancialTransactionCategory rent = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");

        FinancialTransaction inFood =
                fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, food);
        FinancialTransaction inDelivery =
                fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), FinancialTransactionType.DEBIT, delivery);
        FinancialTransaction inDiningOut =
                fixtures.aTransaction(plan, owner, new BigDecimal("30.00"), FinancialTransactionType.DEBIT, diningOut);
        fixtures.aTransaction(plan, owner, new BigDecimal("40.00"), FinancialTransactionType.DEBIT, rent);
        fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), FinancialTransactionType.DEBIT);
        return new Seed(food, delivery, inFood, inDelivery, inDiningOut);
    }

    private JsonNode list(Plan plan, User asUser, Long categoryId) throws Exception {
        MvcResult result = mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .param("categoryId", categoryId.toString()))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private static List<Long> ids(JsonNode page) {
        return StreamSupport.stream(page.get("content").spliterator(), false)
                .map(transaction -> transaction.get("id").asLong())
                .toList();
    }
}
