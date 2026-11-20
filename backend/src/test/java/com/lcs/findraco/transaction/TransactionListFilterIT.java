package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Every filter of the transaction list other than the category (see {@link TransactionCategoryFilterIT}). */
class TransactionListFilterIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private Clock clock;

    // The two zones are 25 hours apart, so the eastern reader's today is one or two days after the western one.
    private static final String EAST = "Pacific/Kiritimati";
    private static final String WEST = "Pacific/Pago_Pago";

    @Test
    void typeKeepsOnlyThatType() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long debit = aTransaction(plan, owner, owner, "Lunch", "10.00", today(), TransactionType.DEBIT);
        long credit = aTransaction(plan, owner, owner, "Salary", "10.00", today(), TransactionType.CREDIT);

        assertThat(idsOf(list(plan, owner, "type", "DEBIT"))).containsExactly(debit);
        assertThat(idsOf(list(plan, owner, "type", "CREDIT"))).containsExactly(credit);
    }

    @Test
    void memberKeepsTheTransactionsTheyTakePartIn() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        long ownersOwn = aTransaction(plan, owner, owner, "Owner only", "10.00", today(), TransactionType.DEBIT);
        long partnersOwn =
                aTransaction(plan, partner, partner, "Partner only", "10.00", today(), TransactionType.DEBIT);

        assertThat(idsOf(list(plan, owner, "memberId", owner.getId().toString())))
                .containsExactly(ownersOwn);
        assertThat(idsOf(list(plan, owner, "memberId", partner.getId().toString())))
                .containsExactly(partnersOwn);
    }

    @Test
    void descriptionMatchesTheDescriptionOrAParticipantNameIgnoringCase() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User zelda = fixtures.aUser();
        zelda.setName("Zelda");
        userRepository.save(zelda);
        fixtures.addMember(plan, zelda, PlanRole.EDITOR);
        long byDescription = aTransaction(plan, owner, owner, "Pizza night", "10.00", today(), TransactionType.DEBIT);
        long byParticipant = aTransaction(plan, owner, zelda, "Taxi", "10.00", today(), TransactionType.DEBIT);
        aTransaction(plan, owner, owner, "Rent", "10.00", today(), TransactionType.DEBIT);

        assertThat(idsOf(list(plan, owner, "description", "PIZZA"))).containsExactly(byDescription);
        assertThat(idsOf(list(plan, owner, "description", "zel"))).containsExactly(byParticipant);
    }

    @Test
    void theDateRangeIncludesBothEnds() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate first = LocalDate.of(2026, 3, 10);
        long before = aTransaction(plan, owner, owner, "Before", "10.00", first.minusDays(1), TransactionType.DEBIT);
        long onStart = aTransaction(plan, owner, owner, "On start", "10.00", first, TransactionType.DEBIT);
        long inside = aTransaction(plan, owner, owner, "Inside", "10.00", first.plusDays(5), TransactionType.DEBIT);
        long onEnd = aTransaction(plan, owner, owner, "On end", "10.00", first.plusDays(10), TransactionType.DEBIT);
        long after = aTransaction(plan, owner, owner, "After", "10.00", first.plusDays(11), TransactionType.DEBIT);

        assertThat(idsOf(list(
                        plan,
                        owner,
                        "startDateFrom",
                        first.toString(),
                        "startDateTo",
                        first.plusDays(10).toString())))
                .containsExactlyInAnyOrder(onStart, inside, onEnd);
        assertThat(idsOf(list(plan, owner, "startDateFrom", first.plusDays(10).toString())))
                .containsExactlyInAnyOrder(onEnd, after);
        assertThat(idsOf(list(plan, owner, "startDateTo", first.toString())))
                .containsExactlyInAnyOrder(before, onStart);
    }

    @Test
    void theAmountRangeIncludesBothEnds() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long low = aTransaction(plan, owner, owner, "Low", "9.99", today(), TransactionType.DEBIT);
        long min = aTransaction(plan, owner, owner, "Min", "10.00", today(), TransactionType.DEBIT);
        long max = aTransaction(plan, owner, owner, "Max", "20.00", today(), TransactionType.DEBIT);
        long high = aTransaction(plan, owner, owner, "High", "20.01", today(), TransactionType.DEBIT);

        assertThat(idsOf(list(plan, owner, "amountMin", "10.00", "amountMax", "20.00")))
                .containsExactlyInAnyOrder(min, max);
        assertThat(idsOf(list(plan, owner, "amountMax", "9.99"))).containsExactly(low);
        assertThat(idsOf(list(plan, owner, "amountMin", "20.01"))).containsExactly(high);
    }

    @Test
    void filtersCombineAndTheTotalCountsOnlyTheMatches() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long match = aTransaction(plan, owner, owner, "Coffee beans", "15.00", today(), TransactionType.DEBIT);
        aTransaction(plan, owner, owner, "Coffee beans", "15.00", today(), TransactionType.CREDIT);
        aTransaction(plan, owner, owner, "Coffee beans", "99.00", today(), TransactionType.DEBIT);
        aTransaction(plan, owner, owner, "Tea", "15.00", today(), TransactionType.DEBIT);

        JsonNode page = page(plan, owner, "type", "DEBIT", "description", "coffee", "amountMax", "20.00");

        assertThat(idsOf(page.get("content"))).containsExactly(match);
        assertThat(page.get("totalElements").asLong()).isEqualTo(1);
    }

    @Test
    void anotherPlansTransactionsNeverAppear() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Plan other = fixtures.aPlan(owner);
        long mine = aTransaction(plan, owner, owner, "Mine", "10.00", today(), TransactionType.DEBIT);
        aTransaction(other, owner, owner, "Theirs", "10.00", today(), TransactionType.DEBIT);

        assertThat(idsOf(list(plan, owner, "type", "DEBIT"))).containsExactly(mine);
    }

    @Test
    void uncategorizedListsOnlyRowsWithoutCategory() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        long bare = aTransaction(plan, owner, owner, "Bare", "10.00", today(), TransactionType.DEBIT);
        long alsoBare = aTransaction(plan, owner, owner, "Also bare", "10.00", today(), TransactionType.DEBIT);
        for (int i = 0; i < 3; i++) {
            fixtures.aTransaction(plan, owner, new BigDecimal("10.00"), TransactionType.DEBIT, food);
        }

        JsonNode page = page(plan, owner, "uncategorized", "true");

        assertThat(idsOf(page.get("content"))).containsExactlyInAnyOrder(bare, alsoBare);
        assertThat(page.get("totalElements").asLong()).isEqualTo(2);
        assertThat(list(plan, owner)).hasSize(5);
        assertThat(list(plan, owner, "uncategorized", "false")).hasSize(5);
    }

    @Test
    void statusFilterFollowsTheReadersToday() throws Exception {
        User east = fixtures.aUser();
        User west = fixtures.aUser();
        jdbc.update("UPDATE users SET time_zone = ? WHERE id = ?", EAST, east.getId());
        jdbc.update("UPDATE users SET time_zone = ? WHERE id = ?", WEST, west.getId());
        Plan plan = fixtures.aPlan(east);
        fixtures.addMember(plan, west, PlanRole.EDITOR);
        LocalDate eastToday = LocalDate.now(clock.withZone(ZoneId.of(EAST)));
        long pastByDate = aRow(plan, east, "BY_DATE", eastToday.minusDays(3));
        long todayByDate = aRow(plan, east, "BY_DATE", eastToday);
        long futureByDate = aRow(plan, east, "BY_DATE", eastToday.plusDays(3));
        long overdueBill = aRow(plan, east, "REQUIRED", eastToday.minusDays(1));
        long billDueToday = aRow(plan, east, "REQUIRED", eastToday);
        long futureBill = aRow(plan, east, "REQUIRED", eastToday.plusDays(3));
        long confirmedAhead = aRow(plan, east, "CONFIRMED", eastToday.plusDays(3));

        assertThat(idsOf(list(plan, east, "status", "ACTUAL")))
                .containsExactlyInAnyOrder(pastByDate, todayByDate, confirmedAhead);
        assertThat(idsOf(list(plan, east, "status", "FORECAST")))
                .containsExactlyInAnyOrder(futureByDate, billDueToday, futureBill);
        assertThat(idsOf(list(plan, east, "status", "PENDING"))).containsExactly(overdueBill);
        for (String status : List.of("ACTUAL", "FORECAST", "PENDING")) {
            for (JsonNode row : list(plan, east, "status", status)) {
                assertThat(row.get("status").asString()).isEqualTo(status);
            }
        }
        // The western reader's today is before the overdue bill's date, so for them it is not overdue yet.
        assertThat(list(plan, west, "status", "PENDING")).isEmpty();
        assertThat(idsOf(list(plan, west, "status", "FORECAST"))).contains(overdueBill);
    }

    @Test
    void invalidFilterCombinationsAreBadRequest() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");

        mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("uncategorized", "true")
                        .param("categoryId", food.getId().toString()))
                .andExpect(problem(HttpStatus.BAD_REQUEST, "malformed-request"));
        mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("status", "LATER"))
                .andExpect(problem(HttpStatus.BAD_REQUEST, "malformed-request"));
    }

    @Test
    void filtersOnAnotherPlanAreNotFound() throws Exception {
        User owner = fixtures.aUser();
        User stranger = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(stranger))
                        .param("uncategorized", "true")
                        .param("status", "PENDING"))
                .andExpect(status().isNotFound());
    }

    private long aRow(Plan plan, User creator, String confirmation, LocalDate date) {
        long id = aTransaction(plan, creator, creator, "Row " + date, "10.00", date, TransactionType.DEBIT);
        jdbc.update("UPDATE transactions SET confirmation = ? WHERE id = ?", confirmation, id);
        return id;
    }

    private long aTransaction(
            Plan plan,
            User createdBy,
            User participant,
            String description,
            String amount,
            LocalDate date,
            TransactionType type) {
        TransactionDetails details =
                new TransactionDetails(null, type, new BigDecimal(amount), description, date, null, null);
        return fixtures.aTransaction(new TransactionDraft(
                        plan,
                        createdBy,
                        details,
                        SplitMode.EQUAL,
                        List.of(new Share(participant, null)),
                        List.of(),
                        null,
                        null))
                .getId();
    }

    private JsonNode page(Plan plan, User asUser, String... params) throws Exception {
        var request = get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(asUser));
        for (int i = 0; i < params.length; i += 2) {
            request = request.param(params[i], params[i + 1]);
        }
        MvcResult result = mockMvc.perform(request).andExpect(status().isOk()).andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode list(Plan plan, User asUser, String... params) throws Exception {
        return page(plan, asUser, params).get("content");
    }

    private static List<Long> idsOf(JsonNode content) {
        List<Long> ids = new ArrayList<>();
        content.forEach(row -> ids.add(row.get("id").asLong()));
        return ids;
    }
}
