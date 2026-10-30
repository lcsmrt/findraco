package com.lcs.findraco.dashboard;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
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
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of the AD-007 Partition Invariant: {@code spent[C] = A[C] - B[C] + I[C]},
 * where A is a category's whole-transaction sums, B is the categorized-item amounts subtracted
 * out of the parent category, and I is those same amounts re-attributed to the item's own
 * category. Uncategorized items and any un-itemized remainder stay with the parent category. The
 * partition is read from the category spending tree, the totals from the dashboard.
 *
 * <p>Responses are read as raw {@link JsonNode} trees rather than deserialized into the response
 * DTOs, since those DTOs are immutable (no default constructor/setters) and are only ever built
 * server-side from entities (see {@code SplitInvariantIT} for the same pattern).
 */
class DashboardPartitionIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void itemizedTransactionAttributesItemsToOwnCategoryAndRemainderToParent() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        long groceriesId =
                createCategory(plan, owner, "DEBIT", "Groceries").get("id").asLong();
        long foodId = createCategory(plan, owner, "DEBIT", "Food").get("id").asLong();
        long cleaningId =
                createCategory(plan, owner, "DEBIT", "Cleaning").get("id").asLong();

        Map<String, Object> body = Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("150.00"),
                "description",
                "Grocery run",
                "startDate",
                today().toString(),
                "categoryId",
                groceriesId,
                "items",
                List.of(
                        Map.of("description", "Food shopping", "amount", new BigDecimal("90.00"), "categoryId", foodId),
                        Map.of(
                                "description",
                                "Cleaning supplies",
                                "amount",
                                new BigDecimal("40.00"),
                                "categoryId",
                                cleaningId),
                        Map.of("description", "Misc", "amount", new BigDecimal("10.00"))));

        createTransaction(plan, owner, body);

        JsonNode dashboard = fetchDashboard(plan, owner);
        JsonNode breakdown = fetchSpending(plan, owner);

        assertThat(categorySpent(breakdown, "Groceries")).isEqualByComparingTo("20.00");
        assertThat(categorySpent(breakdown, "Food")).isEqualByComparingTo("90.00");
        assertThat(categorySpent(breakdown, "Cleaning")).isEqualByComparingTo("40.00");

        BigDecimal partitionedSum = categorySpent(breakdown, "Groceries")
                .add(categorySpent(breakdown, "Food"))
                .add(categorySpent(breakdown, "Cleaning"));
        assertThat(partitionedSum).isEqualByComparingTo("150.00");

        assertThat(dashboard.get("totalExpenses").decimalValue()).isEqualByComparingTo("150.00");
    }

    @Test
    void nonItemizedTransactionBreakdownIsUnchangedFromPreItemsBehavior() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        long utilitiesId =
                createCategory(plan, owner, "DEBIT", "Utilities").get("id").asLong();

        Map<String, Object> body = Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("75.00"),
                "description",
                "Electric bill",
                "startDate",
                today().toString(),
                "categoryId",
                utilitiesId);

        createTransaction(plan, owner, body);

        JsonNode dashboard = fetchDashboard(plan, owner);
        JsonNode breakdown = fetchSpending(plan, owner);

        assertThat(breakdown).hasSize(1);
        assertThat(categorySpent(breakdown, "Utilities")).isEqualByComparingTo("75.00");
        assertThat(dashboard.get("totalExpenses").decimalValue()).isEqualByComparingTo("75.00");
    }

    @Test
    void topLineTotalsAreIdenticalRegardlessOfItemization() throws Exception {
        User ownerA = fixtures.aUser();
        Plan planA = fixtures.aPlan(ownerA);

        createTransaction(
                planA,
                ownerA,
                Map.of(
                        "type",
                        "CREDIT",
                        "amount",
                        new BigDecimal("500.00"),
                        "description",
                        "Salary",
                        "startDate",
                        today().toString()));
        createTransaction(
                planA,
                ownerA,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("200.00"),
                        "description",
                        "Rent",
                        "startDate",
                        today().toString()));

        User ownerB = fixtures.aUser();
        Plan planB = fixtures.aPlan(ownerB);

        long bonusId =
                createCategory(planB, ownerB, "CREDIT", "Bonus").get("id").asLong();
        long foodId = createCategory(planB, ownerB, "DEBIT", "Food").get("id").asLong();

        createTransaction(
                planB,
                ownerB,
                Map.of(
                        "type",
                        "CREDIT",
                        "amount",
                        new BigDecimal("500.00"),
                        "description",
                        "Salary",
                        "startDate",
                        today().toString(),
                        "items",
                        List.of(Map.of(
                                "description",
                                "Year-end bonus",
                                "amount",
                                new BigDecimal("100.00"),
                                "categoryId",
                                bonusId))));
        createTransaction(
                planB,
                ownerB,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("200.00"),
                        "description",
                        "Rent",
                        "startDate",
                        today().toString(),
                        "items",
                        List.of(Map.of(
                                "description",
                                "Groceries slice",
                                "amount",
                                new BigDecimal("50.00"),
                                "categoryId",
                                foodId))));

        JsonNode dashboardA = fetchDashboard(planA, ownerA);
        JsonNode dashboardB = fetchDashboard(planB, ownerB);

        assertThat(dashboardB.get("totalIncome").decimalValue())
                .isEqualByComparingTo(dashboardA.get("totalIncome").decimalValue());
        assertThat(dashboardB.get("totalExpenses").decimalValue())
                .isEqualByComparingTo(dashboardA.get("totalExpenses").decimalValue());
        assertThat(dashboardB.get("netBalance").decimalValue())
                .isEqualByComparingTo(dashboardA.get("netBalance").decimalValue());

        assertThat(dashboardA.get("totalIncome").decimalValue()).isEqualByComparingTo("500.00");
        assertThat(dashboardA.get("totalExpenses").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(dashboardA.get("netBalance").decimalValue()).isEqualByComparingTo("300.00");
    }

    /**
     * Proves the D1 on-read trigger (RMV2-06/07, see {@code design.md}): a stale open-ended
     * (mode = RECURRING, endDate = null) series is topped up as a side effect of the dashboard
     * GET itself, its newly materialized rows are readable in that same response, the watermark
     * advances, and — critically — none of this perturbs the AD-007 partition invariant already
     * proven above for an unrelated itemized transaction in the same plan. The recurring series
     * uses its own category so its contribution is trivially separable from the itemized one.
     *
     * <p>The definition's own dates are anchored on day-of-month 1 (independent of whatever day
     * "today()" happens to be) so the expected occurrence count is exact calendar-month arithmetic,
     * regardless of month-length clamping around the real, injected {@code Clock}'s current date.
     */
    @Test
    void openEndedSeriesTopUpDuringDashboardReadPreservesPartitionInvariant() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        long groceriesId =
                createCategory(plan, owner, "DEBIT", "Groceries").get("id").asLong();
        long foodId = createCategory(plan, owner, "DEBIT", "Food").get("id").asLong();
        long cleaningId =
                createCategory(plan, owner, "DEBIT", "Cleaning").get("id").asLong();
        long subscriptionsId =
                createCategory(plan, owner, "DEBIT", "Subscriptions").get("id").asLong();

        Map<String, Object> body = Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("150.00"),
                "description",
                "Grocery run",
                "startDate",
                today().toString(),
                "categoryId",
                groceriesId,
                "items",
                List.of(
                        Map.of("description", "Food shopping", "amount", new BigDecimal("90.00"), "categoryId", foodId),
                        Map.of(
                                "description",
                                "Cleaning supplies",
                                "amount",
                                new BigDecimal("40.00"),
                                "categoryId",
                                cleaningId),
                        Map.of("description", "Misc", "amount", new BigDecimal("10.00"))));
        createTransaction(plan, owner, body);

        Category subscriptionsCategory =
                categoryRepository.findByIdAndPlan(subscriptionsId, plan).orElseThrow();

        LocalDate anchorMonth = today().withDayOfMonth(1);
        LocalDate start = anchorMonth.minusMonths(6);
        LocalDate staleGeneratedThrough = anchorMonth.minusMonths(2);
        LocalDate expectedLastGenerated = anchorMonth.plusMonths(12);

        RecurrenceDefinition definition =
                anOpenEndedDefinition(plan, owner, subscriptionsCategory, start, "Streaming", new BigDecimal("30.00"));
        definition.markGeneratedThrough(staleGeneratedThrough);
        recurrenceDefinitionRepository.save(definition);

        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId()))
                .isEmpty();

        JsonNode dashboard = fetchDashboard(plan, owner, start, today().plusMonths(13));

        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId());
        // Top-up only materializes forward from the (stale) watermark — it never backfills the
        // months between the series' start and that watermark, since those are assumed already
        // persisted from the original creation flow (not seeded here, so none exist beforehand).
        long expectedOccurrences = ChronoUnit.MONTHS.between(staleGeneratedThrough, expectedLastGenerated);
        assertThat(occurrences).hasSize((int) expectedOccurrences);

        RecurrenceDefinition reloaded =
                recurrenceDefinitionRepository.findById(definition.getId()).orElseThrow();
        assertThat(reloaded.getGeneratedThrough()).isEqualTo(expectedLastGenerated);

        JsonNode breakdown = fetchSpending(plan, owner, start, today().plusMonths(13));
        assertThat(categorySpent(breakdown, "Groceries")).isEqualByComparingTo("20.00");
        assertThat(categorySpent(breakdown, "Food")).isEqualByComparingTo("90.00");
        assertThat(categorySpent(breakdown, "Cleaning")).isEqualByComparingTo("40.00");

        BigDecimal partitionedSum = categorySpent(breakdown, "Groceries")
                .add(categorySpent(breakdown, "Food"))
                .add(categorySpent(breakdown, "Cleaning"));
        assertThat(partitionedSum).isEqualByComparingTo("150.00");

        BigDecimal expectedSubscriptionsSpent =
                new BigDecimal("30.00").multiply(BigDecimal.valueOf(expectedOccurrences));
        assertThat(categorySpent(breakdown, "Subscriptions")).isEqualByComparingTo(expectedSubscriptionsSpent);

        BigDecimal expectedTotalExpenses = new BigDecimal("150.00").add(expectedSubscriptionsSpent);
        assertThat(dashboard.get("totalExpenses").decimalValue()).isEqualByComparingTo(expectedTotalExpenses);
    }

    /**
     * CAT-07/CAT-08 (spec P1 Sub AC 7 and 11): the spending tree lists the root with its direct spend plus
     * its children's, the child nested under it. Edge case: once the child's parent is cleared, its
     * spend no longer rolls into the former parent.
     */
    @Test
    void parentRollsUpChildSpendUntilTheChildBecomesRoot() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        long foodId = createCategory(plan, owner, "DEBIT", "Food").get("id").asLong();
        long deliveryId = createCategory(
                        plan, owner, Map.of("type", "DEBIT", "description", "Delivery", "parentId", foodId))
                .get("id")
                .asLong();

        createTransaction(
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("40.00"),
                        "description",
                        "Market",
                        "startDate",
                        today().toString(),
                        "categoryId",
                        foodId));
        createTransaction(
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("60.00"),
                        "description",
                        "Pizza",
                        "startDate",
                        today().toString(),
                        "categoryId",
                        deliveryId));

        JsonNode breakdown = fetchSpending(plan, owner);

        assertThat(breakdown).hasSize(1);
        JsonNode food = breakdown.get(0);
        assertThat(food.get("categoryId").asLong()).isEqualTo(foodId);
        assertThat(food.get("parentId").isNull()).isTrue();
        assertThat(food.get("name").asString()).isEqualTo("Food");
        assertThat(food.get("spent").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(food.get("children")).hasSize(1);
        JsonNode delivery = food.get("children").get(0);
        assertThat(delivery.get("categoryId").asLong()).isEqualTo(deliveryId);
        assertThat(delivery.get("parentId").asLong()).isEqualTo(foodId);
        assertThat(delivery.get("spent").decimalValue()).isEqualByComparingTo("60.00");

        mockMvc.perform(put(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), deliveryId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "type",
                                "DEBIT",
                                "description",
                                "Delivery",
                                "version",
                                fixtures.categoryVersion(deliveryId)))))
                .andExpect(status().isOk());

        JsonNode afterMove = fetchSpending(plan, owner);
        assertThat(afterMove).hasSize(2);
        assertThat(categorySpent(afterMove, "Food")).isEqualByComparingTo("40.00");
        assertThat(categorySpent(afterMove, "Delivery")).isEqualByComparingTo("60.00");
    }

    /**
     * AD-008 / CAT-12: item portions follow the member too: each member row carries the member's
     * share of the item portions. R$ 100 split 60/40 with a R$ 30 Cleaning item: the partner's
     * portion of the item is R$ 12, so their Groceries spend is 40 - 12 and their Cleaning spend 12.
     */
    @Test
    void memberRowsFollowTheItemPortions() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        long groceriesId =
                createCategory(plan, owner, "DEBIT", "Groceries").get("id").asLong();
        long cleaningId =
                createCategory(plan, owner, "DEBIT", "Cleaning").get("id").asLong();

        createTransaction(
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("100.00"),
                        "description",
                        "Grocery run",
                        "startDate",
                        today().toString(),
                        "categoryId",
                        groceriesId,
                        "splitMode",
                        "EXACT",
                        "participants",
                        List.of(
                                Map.of("memberId", owner.getId(), "shareAmount", new BigDecimal("60.00")),
                                Map.of("memberId", partner.getId(), "shareAmount", new BigDecimal("40.00"))),
                        "items",
                        List.of(Map.of(
                                "description",
                                "Cleaning supplies",
                                "amount",
                                new BigDecimal("30.00"),
                                "categoryId",
                                cleaningId))));

        JsonNode spending = fetchSpending(plan, owner);
        assertThat(memberSpent(spending, "Groceries", partner)).isEqualByComparingTo("28.00");
        assertThat(memberSpent(spending, "Cleaning", partner)).isEqualByComparingTo("12.00");
        assertThat(memberSpent(spending, "Groceries", owner)).isEqualByComparingTo("42.00");
        assertThat(memberSpent(spending, "Cleaning", owner)).isEqualByComparingTo("18.00");
        assertThat(categorySpent(spending, "Groceries")).isEqualByComparingTo("70.00");
        assertThat(categorySpent(spending, "Cleaning")).isEqualByComparingTo("30.00");
    }

    private RecurrenceDefinition anOpenEndedDefinition(
            Plan plan, User owner, Category category, LocalDate start, String description, BigDecimal amount) {
        return recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                category,
                TransactionType.DEBIT,
                amount,
                description,
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                start,
                null,
                SplitMode.EQUAL,
                List.of(new Share(owner, null)))));
    }

    private JsonNode createCategory(Plan plan, User asUser, String type, String description) throws Exception {
        return createCategory(
                plan,
                asUser,
                Map.of(
                        "type", type,
                        "description", description));
    }

    private JsonNode createCategory(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        String requestBody = objectMapper.writeValueAsString(body);

        MvcResult result = mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode createTransaction(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        String requestBody = objectMapper.writeValueAsString(body);

        MvcResult result = mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode fetchDashboard(Plan plan, User asUser) throws Exception {
        return fetchDashboard(plan, asUser, today().minusDays(1), today().plusDays(1));
    }

    private JsonNode fetchSpending(Plan plan, User asUser) throws Exception {
        return fetchSpending(plan, asUser, today().minusDays(1), today().plusDays(1));
    }

    private JsonNode fetchSpending(Plan plan, User asUser, LocalDate startDate, LocalDate endDate) throws Exception {
        MvcResult result = mockMvc.perform(get(CategoryRoutes.CATEGORY + "/spending", plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode fetchDashboard(Plan plan, User asUser, LocalDate startDate, LocalDate endDate) throws Exception {
        MvcResult result = mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private static BigDecimal categorySpent(JsonNode spending, String categoryName) {
        return row(spending, categoryName).get("spent").decimalValue();
    }

    private static BigDecimal memberSpent(JsonNode spending, String categoryName, User member) {
        for (JsonNode memberRow : row(spending, categoryName).get("members")) {
            if (memberRow.get("memberId").asLong() == member.getId()) {
                return memberRow.get("spent").decimalValue();
            }
        }
        throw new AssertionError("No row of member " + member.getId() + " in " + categoryName);
    }

    /** A root or a nested child of the spending tree, by name. */
    private static JsonNode row(JsonNode spending, String categoryName) {
        for (JsonNode category : spending) {
            if (category.get("name").asString().equals(categoryName)) {
                return category;
            }
            for (JsonNode child : category.get("children")) {
                if (child.get("name").asString().equals(categoryName)) {
                    return child;
                }
            }
        }
        throw new AssertionError("No category named " + categoryName + " in spending: " + spending);
    }
}
