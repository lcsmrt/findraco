package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * What a movement kind does to a row, through the API: a neutral kind refuses what it cannot carry, a refund needs an
 * expense category on a credit, and the list can be narrowed to the rows that have a kind. What each kind does to the
 * totals is proved in the same class from the dashboard's side.
 */
class NeutralMovementsIT extends AbstractIntegrationTest {

    private static final LocalDate NOVEMBER = LocalDate.of(2026, 11, 10);
    private static final List<TransactionKind> NEUTRAL_KINDS =
            List.of(TransactionKind.TRANSFER, TransactionKind.CARD_BILL_PAYMENT, TransactionKind.SAVINGS);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void neutralKindRefusesCategorySplitAndItems() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Transaction stored = row(plan, owner, TransactionType.DEBIT, "80.00", NOVEMBER, null, null);

        for (TransactionKind kind : NEUTRAL_KINDS) {
            List<Map<String, Object>> refused = new ArrayList<>();
            refused.add(body(TransactionType.DEBIT, "80.00", kind, food.getId()));
            Map<String, Object> split = body(TransactionType.DEBIT, "80.00", kind, null);
            split.put("participants", List.of(member(owner), member(partner)));
            refused.add(split);
            Map<String, Object> withItems = body(TransactionType.DEBIT, "80.00", kind, null);
            withItems.put("items", List.of(Map.of("description", "Part", "amount", "10.00")));
            refused.add(withItems);

            for (Map<String, Object> request : refused) {
                send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, request)
                        .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"))
                        .andExpect(jsonPath("$.field").value("kind"));

                Map<String, Object> edit = new LinkedHashMap<>(request);
                edit.put("items", request.getOrDefault("items", List.of()));
                edit.put("version", stored.getVersion());
                send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), stored.getId()), owner, edit)
                        .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
            }
        }

        assertThat(transactionRepository.findAllByPlan(plan)).singleElement().satisfies(row -> {
            assertThat(row.getId()).isEqualTo(stored.getId());
            assertThat(row.getKind()).isNull();
            assertThat(row.getCategory()).isNull();
            assertThat(row.getVersion()).isEqualTo(stored.getVersion());
        });
    }

    @Test
    void aNeutralKindAloneIsStoredAndComesBackOnTheRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        for (TransactionKind kind : NEUTRAL_KINDS) {
            JsonNode created = readBody(send(
                            post(TransactionRoutes.TRANSACTION, plan.getId()),
                            owner,
                            body(TransactionType.DEBIT, "80.00", kind, null))
                    .andExpect(status().isCreated()));

            assertThat(created.path("kind").asString()).isEqualTo(kind.name());
            assertThat(transactionRepository.findById(created.path("id").asLong()))
                    .get()
                    .extracting(Transaction::getKind)
                    .isEqualTo(kind);
        }
    }

    @Test
    void anyMemberCanSaveAnotherMembersNeutralRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User marina = fixtures.aUser();
        fixtures.addMember(plan, marina, PlanRole.EDITOR);
        Transaction marinas =
                row(plan, marina, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);
        Map<String, Object> edit = body(TransactionType.DEBIT, "500.00", TransactionKind.TRANSFER, null);
        edit.put("description", "Pix to the rent");
        edit.put("participants", List.of(member(marina)));
        edit.put("items", List.of());
        edit.put("version", marinas.getVersion());

        JsonNode saved =
                readBody(send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), marinas.getId()), owner, edit)
                        .andExpect(status().isOk()));

        assertThat(saved.path("kind").asString()).isEqualTo("TRANSFER");
        assertThat(saved.path("description").asString()).isEqualTo("Pix to the rent");
        assertThat(saved.path("participants")).hasSize(1);
        assertThat(saved.path("participants").get(0).path("id").asLong()).isEqualTo(marina.getId());
    }

    @Test
    void refundNeedsAnExpenseCategoryOnACredit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, null))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, salary.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.DEBIT, "50.00", TransactionKind.REFUND, food.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));

        assertThat(transactionRepository.findAllByPlan(plan)).isEmpty();

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, food.getId()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.kind").value("REFUND"))
                .andExpect(jsonPath("$.category.id").value(food.getId()));
    }

    @Test
    void listFilterNeutralReturnsOnlyRowsWithAKind() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        row(plan, owner, TransactionType.DEBIT, "20.00", NOVEMBER, null, null);
        row(plan, owner, TransactionType.CREDIT, "3000.00", NOVEMBER, null, null);
        Transaction transfer =
                row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);
        Transaction bill =
                row(plan, owner, TransactionType.DEBIT, "1500.00", NOVEMBER, null, TransactionKind.CARD_BILL_PAYMENT);
        Transaction refund = row(plan, owner, TransactionType.CREDIT, "50.00", NOVEMBER, food, TransactionKind.REFUND);

        JsonNode neutral = list(plan, owner, "NEUTRAL");
        JsonNode refunds = list(plan, owner, "REFUND");
        JsonNode everything = list(plan, owner, null);

        assertThat(ids(neutral)).containsExactlyInAnyOrder(transfer.getId(), bill.getId(), refund.getId());
        assertThat(neutral.path("totalElements").asLong()).isEqualTo(3);
        assertThat(ids(refunds)).containsExactly(refund.getId());
        assertThat(everything.path("totalElements").asLong()).isEqualTo(5);
    }

    @Test
    void neutralRowsCountInNoTotal() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Market");
        row(plan, owner, TransactionType.CREDIT, "3000.00", NOVEMBER, salary, null);
        row(plan, owner, TransactionType.DEBIT, "200.00", NOVEMBER, market, null);
        row(plan, owner, TransactionType.DEBIT, "1500.00", NOVEMBER, null, TransactionKind.CARD_BILL_PAYMENT);
        row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);

        JsonNode summary = summary(plan, owner);

        assertThat(summary.path("totalIncome").decimalValue()).isEqualByComparingTo("3000.00");
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(summary.path("netBalance").decimalValue()).isEqualByComparingTo("2800.00");
        assertThat(summary.path("actualBalance").decimalValue()).isEqualByComparingTo("2800.00");
    }

    @Test
    void neutralRowsLeaveTrendAndPeople() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        row(plan, owner, TransactionType.CREDIT, "3000.00", NOVEMBER, null, null);
        row(plan, owner, TransactionType.DEBIT, "200.00", NOVEMBER, null, null);
        row(plan, owner, TransactionType.DEBIT, "1500.00", NOVEMBER, null, TransactionKind.CARD_BILL_PAYMENT);
        row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);

        JsonNode trend = trend(plan, owner);
        JsonNode people = summary(plan, owner).path("personBreakdown");

        assertThat(trend).hasSize(1);
        assertThat(trend.get(0).path("month").asInt()).isEqualTo(11);
        assertThat(trend.get(0).path("income").decimalValue()).isEqualByComparingTo("3000.00");
        assertThat(trend.get(0).path("expenses").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(people).hasSize(1);
        assertThat(people.get(0).path("expense").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(people.get(0).path("income").decimalValue()).isEqualByComparingTo("3000.00");
    }

    @Test
    void neutralKindsLeaveCategoriesAndLimits() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = limited(fixtures.aCategory(plan, TransactionType.DEBIT, "Food"), "400.00");
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        row(plan, owner, TransactionType.DEBIT, "100.00", NOVEMBER, food, null);
        row(plan, owner, TransactionType.CREDIT, "3000.00", NOVEMBER, salary, null);
        String before = spending(plan, owner).toString();

        for (TransactionKind kind : NEUTRAL_KINDS) {
            row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, kind);
            row(plan, owner, TransactionType.CREDIT, "300.00", NOVEMBER, null, kind);

            assertThat(spending(plan, owner).toString())
                    .as("after %s rows", kind)
                    .isEqualTo(before);
        }

        JsonNode foodRow = byName(spending(plan, owner), "Food");
        assertThat(foodRow.path("spent").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(foodRow.path("limit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(foodRow.path("remaining").decimalValue()).isEqualByComparingTo("300.00");
        assertThat(byName(spending(plan, owner), "Salary").path("spent").decimalValue())
                .isEqualByComparingTo("3000.00");
    }

    @Test
    void dashboardReportsNeutralOutAndIn() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        row(plan, owner, TransactionType.DEBIT, "1500.00", NOVEMBER, null, TransactionKind.CARD_BILL_PAYMENT);
        row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);
        row(plan, owner, TransactionType.CREDIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);
        row(plan, owner, TransactionType.DEBIT, "70.00", NOVEMBER.minusMonths(1), null, TransactionKind.SAVINGS);
        Transaction trashed = row(plan, owner, TransactionType.DEBIT, "99.00", NOVEMBER, null, TransactionKind.SAVINGS);
        mockMvc.perform(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), trashed.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());

        JsonNode summary = summary(plan, owner);

        assertThat(summary.path("neutralOut").decimalValue()).isEqualByComparingTo("2000.00");
        assertThat(summary.path("neutralIn").decimalValue()).isEqualByComparingTo("500.00");
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("0.00");
    }

    @Test
    void refundLowersItsCategoryAndExpenses() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        row(plan, owner, TransactionType.DEBIT, "100.00", NOVEMBER, food, null);
        assertThat(summary(plan, owner).path("totalExpenses").decimalValue()).isEqualByComparingTo("100.00");

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, food.getId()))
                .andExpect(status().isCreated());

        JsonNode summary = summary(plan, owner);
        assertThat(byName(spending(plan, owner), "Food").path("spent").decimalValue())
                .isEqualByComparingTo("50.00");
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(summary.path("totalIncome").decimalValue()).isEqualByComparingTo("0.00");
        assertThat(summary.path("actualExpenses").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(trend(plan, owner).get(0).path("expenses").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(trend(plan, owner).get(0).path("income").decimalValue()).isEqualByComparingTo("0.00");
    }

    @Test
    void refundLowersTheSpendingOfWhoItIsAttributedTo() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User marina = fixtures.aUser();
        fixtures.addMember(plan, marina, PlanRole.EDITOR);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        fixtures.aTransaction(new TransactionDraft(
                plan,
                owner,
                new TransactionDetails(
                        food, TransactionType.DEBIT, new BigDecimal("100.00"), "Pizza", NOVEMBER, null, null),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), new Share(marina, null)),
                List.of(),
                null,
                null));
        assertThat(expenseOf(summary(plan, owner), marina)).isEqualByComparingTo("50.00");

        Map<String, Object> refund = body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, food.getId());
        refund.put("participants", List.of(member(marina)));
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, refund).andExpect(status().isCreated());

        JsonNode summary = summary(plan, owner);
        assertThat(expenseOf(summary, marina)).isEqualByComparingTo("0.00");
        assertThat(expenseOf(summary, owner)).isEqualByComparingTo("50.00");
        JsonNode members = byName(spending(plan, owner), "Food").path("members");
        assertThat(members).hasSize(1);
        assertThat(members.get(0).path("memberId").asLong()).isEqualTo(owner.getId());
        assertThat(members.get(0).path("spent").decimalValue()).isEqualByComparingTo("50.00");
    }

    @Test
    void limitIsMeasuredNetOfRefunds() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = limited(fixtures.aCategory(plan, TransactionType.DEBIT, "Food"), "80.00");
        row(plan, owner, TransactionType.DEBIT, "100.00", NOVEMBER, food, null);
        assertThat(byName(spending(plan, owner), "Food").path("status").asString())
                .isEqualTo("OVER");

        row(plan, owner, TransactionType.CREDIT, "50.00", NOVEMBER, food, TransactionKind.REFUND);

        JsonNode foodRow = byName(spending(plan, owner), "Food");
        assertThat(foodRow.path("spent").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(foodRow.path("limit").decimalValue()).isEqualByComparingTo("80.00");
        assertThat(foodRow.path("remaining").decimalValue()).isEqualByComparingTo("30.00");
        assertThat(foodRow.path("percentUsed").decimalValue()).isEqualByComparingTo("62.50");
        assertThat(foodRow.path("status").asString()).isNotEqualTo("OVER");
    }

    private Category limited(Category category, String limit) {
        category.changeLimits(new BigDecimal(limit), null);
        return categoryRepository.save(category);
    }

    private JsonNode summary(Plan plan, User caller) throws Exception {
        return readBody(mockMvc.perform(period(get(DashboardRoutes.DASHBOARD, plan.getId()), caller))
                .andExpect(status().isOk()));
    }

    private JsonNode trend(Plan plan, User caller) throws Exception {
        return readBody(mockMvc.perform(period(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId()), caller))
                .andExpect(status().isOk()));
    }

    private JsonNode spending(Plan plan, User caller) throws Exception {
        return readBody(mockMvc.perform(period(get(CategoryRoutes.CATEGORY + "/spending", plan.getId()), caller))
                .andExpect(status().isOk()));
    }

    private MockHttpServletRequestBuilder period(MockHttpServletRequestBuilder request, User caller) {
        return request.with(testAuthHelper.asUser(caller))
                .param("startDate", "2026-11-01")
                .param("endDate", "2026-11-30");
    }

    private static JsonNode byName(JsonNode tree, String name) {
        for (JsonNode node : tree) {
            if (name.equals(node.path("name").asString())) {
                return node;
            }
        }
        throw new AssertionError("no category named " + name + " in " + tree);
    }

    private static BigDecimal expenseOf(JsonNode summary, User member) {
        for (JsonNode person : summary.path("personBreakdown")) {
            if (person.path("userId").asLong() == member.getId()) {
                return person.path("expense").decimalValue();
            }
        }
        return BigDecimal.ZERO;
    }

    private JsonNode list(Plan plan, User caller, String kind) throws Exception {
        var request = get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(caller));
        if (kind != null) {
            request = request.param("kind", kind);
        }
        return readBody(mockMvc.perform(request).andExpect(status().isOk()));
    }

    private static List<Long> ids(JsonNode page) {
        List<Long> ids = new ArrayList<>();
        page.path("content").forEach(row -> ids.add(row.path("id").asLong()));
        return ids;
    }

    private Transaction row(
            Plan plan,
            User creator,
            TransactionType type,
            String amount,
            LocalDate date,
            Category category,
            TransactionKind kind) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(category, type, new BigDecimal(amount), "Row", date, null, null, kind),
                SplitMode.EQUAL,
                List.of(new Share(creator, null)),
                List.of(),
                null,
                null));
    }

    private static Map<String, Object> body(
            TransactionType type, String amount, TransactionKind kind, Long categoryId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", type.name());
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Movement");
        body.put("startDate", NOVEMBER.toString());
        body.put("kind", kind.name());
        if (categoryId != null) {
            body.put("categoryId", categoryId);
        }
        return body;
    }

    private static Map<String, Object> member(User user) {
        return Map.of("memberId", user.getId());
    }

    private ResultActions send(MockHttpServletRequestBuilder request, User caller, Map<String, Object> body)
            throws Exception {
        return mockMvc.perform(request.with(testAuthHelper.asUser(caller))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private JsonNode readBody(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }
}
