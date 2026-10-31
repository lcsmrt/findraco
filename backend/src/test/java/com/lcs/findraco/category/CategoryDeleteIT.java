package com.lcs.findraco.category;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.ItemDraft;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.List;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of category delete with reassignment (spec P1 "Two-level subcategories"
 * AC 14-16 and the "delete in use" edge case; CAT-10), and of the usage counts the delete dialog
 * reads first (AC 18).
 */
class CategoryDeleteIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private DataSource dataSource;

    @Test
    void unusedCategoryIsDeletedWith204() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category unused = fixtures.aCategory(plan, TransactionType.DEBIT, "Unused");

        deleteCategory(plan, owner, unused.getId(), null).andExpect(status().isNoContent());

        assertThat(categoryRepository.findById(unused.getId())).isEmpty();
    }

    // AC 14
    @Test
    void parentWithChildrenIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");

        deleteCategory(plan, owner, food.getId(), null)
                .andExpect(problem(HttpStatus.CONFLICT, "category-has-subcategories"));
        deleteCategory(plan, owner, food.getId(), other.getId())
                .andExpect(problem(HttpStatus.CONFLICT, "category-has-subcategories"));

        assertThat(categoryRepository.findById(food.getId())).isPresent();
        assertThat(categoryRepository.findById(delivery.getId())).isPresent();
    }

    // Edge case: in use without a target → 409 with reference counts.
    @Test
    void categoryInUseWithoutTargetIsRejectedWith409ReportingCounts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        Transaction direct1 =
                fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);
        Transaction direct2 =
                fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), TransactionType.DEBIT, source);
        Transaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        MvcResult result = deleteCategory(plan, owner, source.getId(), null)
                .andExpect(problem(HttpStatus.CONFLICT, "category-in-use"))
                .andReturn();

        String message = objectMapper
                .readTree(result.getResponse().getContentAsString())
                .get("detail")
                .asString();
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
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Food - Delivery");
        Category target = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);
        Transaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        deleteCategory(plan, owner, source.getId(), target.getId()).andExpect(status().isNoContent());

        assertThat(categoryRepository.findById(source.getId())).isEmpty();
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        assertThat(transactionCategoryId(jdbc, direct.getId())).isEqualTo(target.getId());
        assertThat(itemCategoryId(jdbc, withItem.getId())).isEqualTo(target.getId());
        assertThat(transactionCategoryId(jdbc, withItem.getId())).isEqualTo(other.getId());
        assertThat(definitionCategoryId(jdbc, definition.getId())).isEqualTo(target.getId());
    }

    /**
     * A reassignment changes the moved rows, so it bumps their versions: a client still holding a row read
     * before the delete gets 409 stale-version on its edit instead of putting the deleted category back.
     * A transaction whose item moves is bumped too (the item is part of it); untouched rows keep theirs.
     */
    @Test
    void reassignBumpsTheVersionOfEveryMovedRowAndOnlyThose() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Food - Delivery");
        Category target = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);
        Transaction withItem = transactionWithItem(plan, owner, other, source);
        Transaction untouched =
                fixtures.aTransaction(plan, owner, new BigDecimal("5.00"), TransactionType.DEBIT, other);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        long directBefore = version(jdbc, "transactions", direct.getId());
        long withItemBefore = version(jdbc, "transactions", withItem.getId());
        long untouchedBefore = version(jdbc, "transactions", untouched.getId());
        long definitionBefore = version(jdbc, "recurrence_definitions", definition.getId());

        deleteCategory(plan, owner, source.getId(), target.getId()).andExpect(status().isNoContent());

        assertThat(version(jdbc, "transactions", direct.getId())).isGreaterThan(directBefore);
        assertThat(version(jdbc, "transactions", withItem.getId())).isGreaterThan(withItemBefore);
        assertThat(version(jdbc, "recurrence_definitions", definition.getId())).isGreaterThan(definitionBefore);
        assertThat(version(jdbc, "transactions", untouched.getId())).isEqualTo(untouchedBefore);
    }

    // AC 16: target is the category itself
    @Test
    void targetIsTheCategoryItselfIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), source.getId())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-invalid-reassign-target"));

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId()))
                .isEqualTo(source.getId());
    }

    // AC 16: target is one of its children
    @Test
    void targetIsOneOfItsChildrenIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, food);

        deleteCategory(plan, owner, food.getId(), delivery.getId())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-invalid-reassign-target"));

        assertThat(categoryRepository.findById(food.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId()))
                .isEqualTo(food.getId());
    }

    // AC 16: target of a different type
    @Test
    void targetOfDifferentTypeIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), salary.getId())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-invalid-reassign-target"));

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId()))
                .isEqualTo(source.getId());
    }

    // Target not in the plan → 404 (privacy rule).
    @Test
    void targetFromAnotherPlanRespondsWith404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Category foreign = fixtures.aCategory(otherPlan, TransactionType.DEBIT, "Groceries");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);

        deleteCategory(plan, owner, source.getId(), foreign.getId()).andExpect(status().isNotFound());

        assertThat(categoryRepository.findById(source.getId())).isPresent();
        assertThat(transactionCategoryId(new JdbcTemplate(dataSource), direct.getId()))
                .isEqualTo(source.getId());
    }

    /**
     * AC 15 "in one transaction": a temporary trigger makes the final category DELETE fail after the
     * three bulk moves already ran. The request fails and every reference still points at the source.
     */
    @Test
    void failureMidwayLeavesEveryReferenceUnchanged() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Category target = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        Transaction direct = fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);
        Transaction withItem = transactionWithItem(plan, owner, other, source);
        RecurrenceDefinition definition = recurrenceDefinition(plan, owner, source);

        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        jdbc.execute("CREATE OR REPLACE FUNCTION test_fail_category_delete() RETURNS trigger AS $$ "
                + "BEGIN RAISE EXCEPTION 'forced failure for CategoryDeleteIT'; END; $$ LANGUAGE plpgsql");
        jdbc.execute("CREATE TRIGGER test_fail_category_delete BEFORE DELETE ON categories "
                + "FOR EACH ROW EXECUTE FUNCTION test_fail_category_delete()");
        try {
            deleteCategory(plan, owner, source.getId(), target.getId()).andExpect(status().isInternalServerError());
        } finally {
            jdbc.execute("DROP TRIGGER IF EXISTS test_fail_category_delete ON categories");
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
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, source);
        fixtures.aTransaction(plan, owner, new BigDecimal("20.00"), TransactionType.DEBIT, source);
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
        Category unused = fixtures.aCategory(plan, TransactionType.DEBIT, "Unused");
        Category other = fixtures.aCategory(plan, TransactionType.DEBIT, "Other");
        fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, other);

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
        Category foreign = fixtures.aCategory(otherPlan, TransactionType.DEBIT, "Groceries");
        fixtures.aTransaction(otherPlan, otherOwner, new BigDecimal("10.00"), TransactionType.DEBIT, foreign);

        fetchUsage(plan, owner, foreign.getId()).andExpect(status().isNotFound());
    }

    private ResultActions fetchUsage(Plan plan, User asUser, Long id) throws Exception {
        return mockMvc.perform(
                get(CategoryRoutes.CATEGORY + "/{id}/usage", plan.getId(), id).with(testAuthHelper.asUser(asUser)));
    }

    private JsonNode readUsage(ResultActions result) throws Exception {
        return objectMapper.readTree(result.andReturn().getResponse().getContentAsString());
    }

    private ResultActions deleteCategory(Plan plan, User asUser, Long id, Long reassignTo) throws Exception {
        var request =
                delete(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(asUser));
        if (reassignTo != null) {
            request.param("reassignTo", reassignTo.toString());
        }
        return mockMvc.perform(request);
    }

    /** A R$ 50 transaction in {@code transactionCategory} with one R$ 20 item in {@code itemCategory}. */
    private Transaction transactionWithItem(
            Plan plan, User owner, Category transactionCategory, Category itemCategory) {
        Transaction transaction =
                fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), TransactionType.DEBIT, transactionCategory);
        transaction.replaceItems(List.of(new ItemDraft("Item", new BigDecimal("20.00"), null, itemCategory)));
        return transactionRepository.save(transaction);
    }

    private RecurrenceDefinition recurrenceDefinition(Plan plan, User owner, Category category) {
        return recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                category,
                TransactionType.DEBIT,
                new BigDecimal("30.00"),
                "Installments",
                RecurrenceMode.INSTALLMENT,
                null,
                3,
                null,
                today(),
                null,
                SplitMode.EQUAL,
                List.of(new Share(owner, null)))));
    }

    private static long version(JdbcTemplate jdbc, String table, Long id) {
        Long version = jdbc.queryForObject("SELECT version FROM " + table + " WHERE id = ?", Long.class, id);
        return version == null ? 0 : version;
    }

    private static Long transactionCategoryId(JdbcTemplate jdbc, Long transactionId) {
        return jdbc.queryForObject("SELECT category_id FROM transactions WHERE id = ?", Long.class, transactionId);
    }

    private static Long itemCategoryId(JdbcTemplate jdbc, Long transactionId) {
        return jdbc.queryForObject(
                "SELECT category_id FROM transaction_items WHERE transaction_id = ?", Long.class, transactionId);
    }

    private static Long definitionCategoryId(JdbcTemplate jdbc, Long definitionId) {
        return jdbc.queryForObject(
                "SELECT category_id FROM recurrence_definitions WHERE id = ?", Long.class, definitionId);
    }
}
