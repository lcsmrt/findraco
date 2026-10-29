package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
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
            Category food, Category delivery, Transaction inFood, Transaction inDelivery, Transaction inDiningOut) {}

    /** Food > Delivery, Food > Dining out, plus an unrelated root (Rent) and an uncategorized transaction. */
    private Seed seed(Plan plan, User owner) {
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);
        Category diningOut = fixtures.aCategory(plan, TransactionType.DEBIT, "Dining out", food);
        Category rent = fixtures.aCategory(plan, TransactionType.DEBIT, "Rent");

        Transaction inFood = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, food);
        Transaction inDelivery =
                fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), TransactionType.DEBIT, delivery);
        Transaction inDiningOut =
                fixtures.aTransaction(plan, owner, new BigDecimal("30.00"), TransactionType.DEBIT, diningOut);
        fixtures.aTransaction(plan, owner, new BigDecimal("40.00"), TransactionType.DEBIT, rent);
        fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), TransactionType.DEBIT);
        return new Seed(food, delivery, inFood, inDelivery, inDiningOut);
    }

    private JsonNode list(Plan plan, User asUser, Long categoryId) throws Exception {
        MvcResult result = mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
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
