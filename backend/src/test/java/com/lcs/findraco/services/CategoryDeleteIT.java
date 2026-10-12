package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.FinancialTransaction;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanRole;
import com.lcs.findraco.models.RecurrenceDefinition;
import com.lcs.findraco.models.RecurrenceMode;
import com.lcs.findraco.models.TransactionItem;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.repositories.RecurrenceDefinitionRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Through-the-API proof of category delete with reassignment (spec P1 "Two-level subcategories"
 * AC 14-16 and the "delete in use" edge case; CAT-10), and of the usage counts the delete dialog
 * reads first (AC 18).
 */
class CategoryDeleteIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    @Autowired
    private FinancialTransactionRepository transactionRepository;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private DataSource dataSource;

    @Test
    void unusedCategoryIsDeletedWith204() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory unused = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Unused");

        deleteCategory(plan, owner, unused.getId(), null).andExpect(status().isNoContent());

        assertThat(categoryRepository.findById(unused.getId())).isEmpty();
    }

    // AC 14
    @Test
    void parentWithChildrenIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");

        deleteCategory(plan, owner, food.getId(), null).andExpect(status().isConflict());
        deleteCategory(plan, owner, food.getId(), other.getId()).andExpect(status().isConflict());

        assertThat(categoryRepository.findById(food.getId())).isPresent();
        assertThat(categoryRepository.findById(delivery.getId())).isPresent();
    }

    // Edge case: in use without a target → 409 with reference counts.
    @Test
    void categoryInUseWithoutTargetIsRejectedWith409ReportingCounts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");
        FinancialTransaction direct1 = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);
        FinancialTransaction direct2 = fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), FinancialTransactionType.DEBIT, source);
        FinancialTransaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        MvcResult result = deleteCategory(plan, owner, source.getId(), null)
                .andExpect(status().isConflict())
                .andReturn();

        String message = objectMapper.readTree(result.getResponse().getContentAsString()).get("message").asText();
        assertThat(message).contains("2 transaction(s)", "1 item(s)", "1 recurrence definition(s)");

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        assertThat(transactionCategoryId(jdbc, direct1.getId())).isEqualTo(source.getId());
        assertThat(transactionCategoryId(jdbc, direct2.getId())).isEqualTo(source.getId());
        assertThat(itemCategoryId(jdbc, withItem.getId())).isEqualTo(source.getId());
        assertThat(definitionCategoryId(jdbc, definition.getId())).isEqualTo(source.getId());
    }

    // AC 15
    @Test
    void reassignMovesTransactionsItemsAndRecurrenceDefinitionsThenDeletesWith204() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food - Delivery");
        FinancialTransactionCategory target = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery");
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);
        FinancialTransaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        deleteCategory(plan, owner, source.getId(), target.getId()).andExpect(status().isNoContent());

        assertThat(categoryRepository.findById(source.getId())).isEmpty();
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        assertThat(transactionCategoryId(jdbc, direct.getId())).isEqualTo(target.getId());
        assertThat(itemCategoryId(jdbc, withItem.getId())).isEqualTo(target.getId());
        assertThat(transactionCategoryId(jdbc, withItem.getId())).isEqualTo(other.getId());
        assertThat(definitionCategoryId(jdbc, definition.getId())).isEqualTo(target.getId());
    }

    // AC 16: target is the category itself
    @Test
    void targetIsTheCategoryItselfIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), source.getId()).andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId())).isEqualTo(source.getId());
    }

    // AC 16: target is one of its children
    @Test
    void targetIsOneOfItsChildrenIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, food);

        deleteCategory(plan, owner, food.getId(), delivery.getId()).andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(food.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId())).isEqualTo(food.getId());
    }

    // AC 16: target of a different type
    @Test
    void targetOfDifferentTypeIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransactionCategory salary = fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Salary");
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), salary.getId()).andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId())).isEqualTo(source.getId());
    }

    // Target not in the plan → 404 (privacy rule).
    @Test
    void targetFromAnotherPlanRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransactionCategory foreign = fixtures.aCategory(otherPlan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), foreign.getId()).andExpect(status().isNotFound());

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId())).isEqualTo(source.getId());
    }

    /**
     * AC 15 "in one transaction": a temporary trigger makes the final category DELETE fail after the
     * three bulk moves already ran. The request fails and every reference still points at the source.
     */
    @Test
    void failureMidwayLeavesEveryReferenceUnchanged() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransactionCategory target = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");
        FinancialTransaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);
        FinancialTransaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        jdbc.execute("CREATE OR REPLACE FUNCTION test_fail_category_delete() RETURNS trigger AS $$ "
                + "BEGIN RAISE EXCEPTION 'forced failure for CategoryDeleteIT'; END; $$ LANGUAGE plpgsql");
        jdbc.execute("CREATE TRIGGER test_fail_category_delete BEFORE DELETE ON financial_transaction_categories "
                + "FOR EACH ROW EXECUTE FUNCTION test_fail_category_delete()");
        try {
            deleteCategory(plan, owner, source.getId(), target.getId()).andExpect(status().isInternalServerError());
        } finally {
            jdbc.execute("DROP TRIGGER IF EXISTS test_fail_category_delete ON financial_transaction_categories");
            jdbc.execute("DROP FUNCTION IF EXISTS test_fail_category_delete()");
        }

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(jdbc, direct.getId())).isEqualTo(source.getId());
        assertThat(itemCategoryId(jdbc, withItem.getId())).isEqualTo(source.getId());
        assertThat(definitionCategoryId(jdbc, definition.getId())).isEqualTo(source.getId());
    }

    // AC 18: one count per reference kind, readable by any member (here a VIEWER).
    @Test
    void usageCountsTransactionsItemsAndRecurrenceDefinitionsForAnyMember() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        FinancialTransactionCategory source = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");
        fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, source);
        fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), FinancialTransactionType.DEBIT, source);
        transactionWithItem(plan, owner, other, source);
        recurrenceDefinition(plan, owner, source);
        recurrenceDefinition(plan, owner, source);
        recurrenceDefinition(plan, owner, source);

        JsonNode usage = readUsage(fetchUsage(plan, viewer, source.getId()).andExpect(status().isOk()));

        assertThat(usage.get("transactions").asLong()).isEqualTo(2L);
        assertThat(usage.get("items").asLong()).isEqualTo(1L);
        assertThat(usage.get("recurrenceDefinitions").asLong()).isEqualTo(3L);
    }

    // AC 18: an unused category reports zero for every kind.
    @Test
    void usageOfAnUnusedCategoryIsZero() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory unused = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Unused");
        FinancialTransactionCategory other = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Other");
        fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, other);

        JsonNode usage = readUsage(fetchUsage(plan, owner, unused.getId()).andExpect(status().isOk()));

        assertThat(usage.get("transactions").asLong()).isZero();
        assertThat(usage.get("items").asLong()).isZero();
        assertThat(usage.get("recurrenceDefinitions").asLong()).isZero();
    }

    // AC 18 + privacy rule: a category of another plan → 404.
    @Test
    void usageOfACategoryFromAnotherPlanRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        FinancialTransactionCategory foreign = fixtures.aCategory(otherPlan, FinancialTransactionType.DEBIT, "Groceries");
        fixtures.aTransaction(otherPlan, otherOwner, new BigDecimal("10.00"), FinancialTransactionType.DEBIT, foreign);

        fetchUsage(plan, owner, foreign.getId()).andExpect(status().isNotFound());
    }

    private ResultActions fetchUsage(Plan plan, User asUser, Long id) throws Exception {
        return mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/{id}/usage", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser)));
    }

    private JsonNode readUsage(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString());
    }

    private ResultActions deleteCategory(Plan plan, User asUser, Long id, Long reassignTo) throws Exception {
        var request = delete(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser));
        if (reassignTo != null) {
            request.param("reassignTo", reassignTo.toString());
        }
        return mockMvc.perform(request);
    }

    /** A R$ 50 transaction in {@code transactionCategory} with one R$ 20 item in {@code itemCategory}. */
    private FinancialTransaction transactionWithItem(Plan plan, User owner,
                                                     FinancialTransactionCategory transactionCategory,
                                                     FinancialTransactionCategory itemCategory) {
        FinancialTransaction transaction = fixtures.aTransaction(
                plan, owner, new BigDecimal("50.00"), FinancialTransactionType.DEBIT, transactionCategory);
        TransactionItem item = new TransactionItem();
        item.setTransaction(transaction);
        item.setDescription("Item");
        item.setAmount(new BigDecimal("20.00"));
        item.setCategory(itemCategory);
        transaction.getItems().add(item);
        return transactionRepository.save(transaction);
    }

    private RecurrenceDefinition recurrenceDefinition(Plan plan, User owner, FinancialTransactionCategory category) {
        RecurrenceDefinition definition = new RecurrenceDefinition();
        definition.setPlan(plan);
        definition.setCreatedBy(owner);
        definition.setCategory(category);
        definition.setSeriesId(UUID.randomUUID().toString());
        definition.setType(FinancialTransactionType.DEBIT);
        definition.setAmount(new BigDecimal("30.00"));
        definition.setDescription("Installments");
        definition.setMode(RecurrenceMode.INSTALLMENT);
        definition.setParcelsNumber(3);
        definition.setStartDate(LocalDate.now());
        return recurrenceDefinitionRepository.save(definition);
    }

    private static Long transactionCategoryId(JdbcTemplate jdbc, Long transactionId) {
        return jdbc.queryForObject("SELECT category_id FROM financial_transactions WHERE id = ?", Long.class, transactionId);
    }

    private static Long itemCategoryId(JdbcTemplate jdbc, Long transactionId) {
        return jdbc.queryForObject("SELECT category_id FROM transaction_items WHERE transaction_id = ?", Long.class, transactionId);
    }

    private static Long definitionCategoryId(JdbcTemplate jdbc, Long definitionId) {
        return jdbc.queryForObject("SELECT category_id FROM recurrence_definitions WHERE id = ?", Long.class, definitionId);
    }
}
