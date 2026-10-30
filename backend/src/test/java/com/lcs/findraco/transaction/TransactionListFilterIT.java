package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Every filter of the transaction list other than the category (see {@link TransactionCategoryFilterIT}). */
class TransactionListFilterIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

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
