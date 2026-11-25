package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.TransactionType;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * What a share that goes to a contact does to a split, to the totals and to a series, through the API: the split
 * keeps its rules, the plan's spending does not count the share, and only a plain expense takes one.
 */
class ContactSharesIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void splitsWithContactsUseTheExistingRules() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User livia = fixtures.aUser();
        fixtures.addMember(plan, livia, PlanRole.EDITOR);
        Contact mae = fixtures.aContact(plan, "Mãe");

        JsonNode equal = create(plan, owner, expense("80.00", "EQUAL", member(owner, null), contact(mae, null)));
        assertShares(equal, "member:" + owner.getId() + "=40.00", "contact:" + mae.getId() + "=40.00");

        JsonNode exact = create(plan, owner, expense("100.00", "EXACT", member(owner, "30.00"), contact(mae, "70.00")));
        assertShares(exact, "member:" + owner.getId() + "=30.00", "contact:" + mae.getId() + "=70.00");

        JsonNode only = create(plan, owner, expense("50.00", "EQUAL", contact(mae, null)));
        assertShares(only, "contact:" + mae.getId() + "=50.00");
        assertThat(only.path("participants").get(0).path("contactName").asString())
                .isEqualTo("Mãe");
        assertThat(only.path("participants").get(0).path("id").isNull()).isTrue();

        JsonNode cents = create(
                plan, owner, expense("100.01", "EQUAL", member(owner, null), member(livia, null), contact(mae, null)));
        assertShares(
                cents,
                "member:" + owner.getId() + "=33.34",
                "member:" + livia.getId() + "=33.34",
                "contact:" + mae.getId() + "=33.33");
    }

    @Test
    void aParticipantNamesAMemberOrAContactNeverBothNorNeither() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Map<String, Object> both = new LinkedHashMap<>(member(owner, null));
        both.put("contactId", mae.getId());

        for (Map<String, Object> participant : List.of(both, Map.<String, Object>of())) {
            send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, expense("10.00", "EQUAL", participant))
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "participant-member-or-contact"))
                    .andExpect(jsonPath("$.field").value("participants"));
        }
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isZero();
    }

    @Test
    void contactSharesLeaveTotalsTrendAndPeople() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Category restaurant =
                categoryRepository.save(Category.create(plan, TransactionType.DEBIT, "Restaurante", null));
        Map<String, Object> request = expense("80.00", "EXACT", member(owner, "40.00"), contact(mae, "40.00"));
        request.put("categoryId", restaurant.getId());
        create(plan, owner, request);

        JsonNode summary = readBody(period(get(DashboardRoutes.DASHBOARD, plan.getId()), owner));
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("40.00");
        assertThat(summary.path("totalIncome").decimalValue()).isEqualByComparingTo("0");
        assertThat(summary.path("netBalance").decimalValue()).isEqualByComparingTo("-40.00");
        assertThat(summary.path("actualExpenses").decimalValue()).isEqualByComparingTo("40.00");

        JsonNode trend = readBody(period(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId()), owner));
        assertThat(trend).hasSize(1);
        assertThat(trend.get(0).path("expenses").decimalValue()).isEqualByComparingTo("40.00");

        JsonNode people = summary.path("personBreakdown");
        assertThat(people).hasSize(1);
        assertThat(people.get(0).path("userId").asLong()).isEqualTo(owner.getId());
        assertThat(people.get(0).path("expense").decimalValue()).isEqualByComparingTo("40.00");

        JsonNode owned = readBody(period(
                get(DashboardRoutes.DASHBOARD, plan.getId()).param("memberId", String.valueOf(owner.getId())), owner));
        assertThat(owned.path("totalExpenses").decimalValue()).isEqualByComparingTo("40.00");
    }

    @Test
    void contactSharesLeaveCategoriesItemsAndLimits() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Category restaurant =
                categoryRepository.save(Category.create(plan, TransactionType.DEBIT, "Restaurante", null));
        restaurant.changeLimits(new BigDecimal("50.00"), null);
        restaurant = categoryRepository.save(restaurant);
        Category drinks = categoryRepository.save(Category.create(plan, TransactionType.DEBIT, "Bebidas", null));
        Map<String, Object> request = expense("80.00", "EXACT", member(owner, "40.00"), contact(mae, "40.00"));
        request.put("categoryId", restaurant.getId());
        JsonNode created = create(plan, owner, request);

        JsonNode withoutItems = byName(spending(plan, owner), "Restaurante");
        assertThat(withoutItems.path("spent").decimalValue()).isEqualByComparingTo("40.00");
        assertThat(withoutItems.path("limit").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(withoutItems.path("remaining").decimalValue()).isEqualByComparingTo("10.00");

        Map<String, Object> edit = new LinkedHashMap<>(request);
        edit.put(
                "items",
                List.of(Map.of(
                        "description", "Soda", "amount", new BigDecimal("20.00"), "categoryId", drinks.getId())));
        edit.put("version", created.path("version").asLong());
        send(
                        put(
                                TransactionRoutes.TRANSACTION + "/{id}",
                                plan.getId(),
                                created.path("id").asLong()),
                        owner,
                        edit)
                .andExpect(status().isOk());

        JsonNode tree = spending(plan, owner);
        assertThat(byName(tree, "Bebidas").path("spent").decimalValue()).isEqualByComparingTo("10.00");
        assertThat(byName(tree, "Restaurante").path("spent").decimalValue()).isEqualByComparingTo("30.00");
        assertThat(byName(tree, "Restaurante").path("remaining").decimalValue()).isEqualByComparingTo("20.00");
        assertThat(byName(tree, "Restaurante").path("members")).hasSize(1);
    }

    @Test
    void contactSharesOnlyOnPlainExpenses() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Category refunded = categoryRepository.save(Category.create(plan, TransactionType.DEBIT, "Market", null));
        JsonNode stored = create(plan, owner, expense("80.00", "EQUAL", member(owner, null)));
        long storedId = stored.path("id").asLong();

        List<Map<String, Object>> refused = new ArrayList<>();
        Map<String, Object> income = expense("80.00", "EQUAL", contact(mae, null));
        income.put("type", "CREDIT");
        refused.add(income);
        for (String kind : List.of("TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS")) {
            Map<String, Object> neutral = expense("80.00", "EQUAL", contact(mae, null));
            neutral.put("kind", kind);
            refused.add(neutral);
        }
        Map<String, Object> refund = expense("80.00", "EQUAL", contact(mae, null));
        refund.put("type", "CREDIT");
        refund.put("kind", "REFUND");
        refund.put("categoryId", refunded.getId());
        refused.add(refund);
        Map<String, Object> repayment = expense("80.00", "EQUAL", contact(mae, null));
        repayment.put("type", "CREDIT");
        repayment.put("kind", "REPAYMENT");
        repayment.put("contactId", mae.getId());
        refused.add(repayment);

        for (Map<String, Object> request : refused) {
            send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, request)
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-share-not-allowed"));

            Map<String, Object> edit = new LinkedHashMap<>(request);
            edit.put("items", List.of());
            edit.put("version", stored.path("version").asLong());
            send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), storedId), owner, edit)
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-share-not-allowed"));
        }

        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isEqualTo(1);
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM transaction_participants WHERE contact_id IS NOT NULL", Long.class))
                .isZero();
        assertThat(fixtures.transactionVersion(storedId))
                .isEqualTo(stored.path("version").asLong());

        Map<String, Object> series = seriesBody("120.00", today().plusDays(5), contact(mae, null));
        series.put("type", "CREDIT");
        send(post(TransactionRoutes.TRANSACTION + "/series", plan.getId()), owner, series)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-share-not-allowed"));
        assertThat(jdbc.queryForObject("SELECT count(*) FROM recurrence_definitions", Long.class))
                .isZero();
    }

    @Test
    void markingAContactSplitWithAKindIsRefusedAndLeavesTheSplit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        JsonNode split = create(plan, owner, expense("80.00", "EQUAL", member(owner, null), contact(mae, null)));
        long id = split.path("id").asLong();

        for (String kind : List.of("TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS", "REFUND")) {
            Map<String, Object> mark =
                    Map.of("kind", kind, "version", split.path("version").asLong());
            send(post(TransactionRoutes.TRANSACTION + "/{id}/kind", plan.getId(), id), owner, mark)
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-share-not-allowed"));
        }

        JsonNode after = readBody(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertShares(after, "member:" + owner.getId() + "=40.00", "contact:" + mae.getId() + "=40.00");
        assertThat(after.path("version").asLong())
                .isEqualTo(split.path("version").asLong());
    }

    @Test
    void archivedOrForeignContactsAreRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Plan other = fixtures.aPlan(owner);
        Contact archived = fixtures.aContact(plan, "Old");
        Contact foreign = fixtures.aContact(other, "Elsewhere");
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), archived.getId()), owner, null)
                .andExpect(status().isOk());

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        expense("10.00", "EQUAL", contact(archived, null)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-archived"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        expense("10.00", "EQUAL", contact(foreign, null)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "contact-not-found"));
        send(
                        post(TransactionRoutes.TRANSACTION + "/series", plan.getId()),
                        owner,
                        seriesBody("10.00", today().plusDays(5), contact(archived, null)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-archived"));
        send(
                        post(TransactionRoutes.TRANSACTION + "/series", plan.getId()),
                        owner,
                        seriesBody("10.00", today().plusDays(5), contact(foreign, null)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "contact-not-found"));

        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isZero();
    }

    @Test
    void anArchivedContactKeepsItsShareOnAnEditOfTheSameRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Map<String, Object> request = expense("60.00", "EQUAL", member(owner, null), contact(mae, null));
        request.put("startDate", today().plusDays(30).toString());
        JsonNode planned = create(plan, owner, request);
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), mae.getId()), owner, null)
                .andExpect(status().isOk());

        Map<String, Object> edit = new LinkedHashMap<>(request);
        edit.put("description", "Renamed");
        edit.put("items", List.of());
        edit.put("version", planned.path("version").asLong());
        JsonNode saved = readBody(send(
                        put(
                                TransactionRoutes.TRANSACTION + "/{id}",
                                plan.getId(),
                                planned.path("id").asLong()),
                        owner,
                        edit)
                .andExpect(status().isOk()));

        assertShares(saved, "member:" + owner.getId() + "=30.00", "contact:" + mae.getId() + "=30.00");
    }

    @Test
    void onlyOwnerAndEditorSplitWithContacts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        User contributor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        Contact mae = fixtures.aContact(plan, "Mãe");

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        contributor,
                        expense("40.00", "EQUAL", member(contributor, null), contact(mae, null)))
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        contributor,
                        expense("40.00", "EQUAL", contact(mae, null)))
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isZero();

        JsonNode own = create(plan, contributor, expense("40.00", "EQUAL", member(contributor, null)));
        Map<String, Object> edit = expense("40.00", "EQUAL", contact(mae, null));
        edit.put("items", List.of());
        edit.put("version", own.path("version").asLong());
        send(
                        put(
                                TransactionRoutes.TRANSACTION + "/{id}",
                                plan.getId(),
                                own.path("id").asLong()),
                        contributor,
                        edit)
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM transaction_participants WHERE contact_id IS NOT NULL", Long.class))
                .isZero();

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        editor,
                        expense("40.00", "EQUAL", member(editor, null), contact(mae, null)))
                .andExpect(status().isCreated());
    }

    @Test
    void seriesCarryContactSharesThroughEdits() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact irma = fixtures.aContact(plan, "Irmã");
        LocalDate start = today().minusDays(70);
        Map<String, Object> body = seriesBody("120.00", start, contact(irma, null));
        body.put("endDate", start.plusMonths(4).toString());
        JsonNode created = readBody(send(post(TransactionRoutes.TRANSACTION + "/series", plan.getId()), owner, body)
                .andExpect(status().isCreated()));

        assertThat(created.path("count").asInt()).isEqualTo(5);
        for (JsonNode occurrence : created.path("occurrences")) {
            assertThat(shares(occurrence)).containsExactly("contact:" + irma.getId() + "=120.00");
        }
        String seriesId = created.path("seriesId").asString();
        JsonNode definition = readBody(
                mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                                .with(testAuthHelper.asUser(owner)))
                        .andExpect(status().isOk()));
        assertThat(definition.path("participants").get(0).path("contactId").asLong())
                .isEqualTo(irma.getId());

        JsonNode fourth = created.path("occurrences").get(3);
        Map<String, Object> confirm = new LinkedHashMap<>();
        confirm.put("amount", new BigDecimal("120.00"));
        confirm.put("startDate", fourth.path("startDate").asString());
        confirm.put("version", fourth.path("version").asLong());
        send(
                        post(
                                TransactionRoutes.TRANSACTION + "/{id}/confirm",
                                plan.getId(),
                                fourth.path("id").asLong()),
                        owner,
                        confirm)
                .andExpect(status().isOk());

        Map<String, Object> halves = new LinkedHashMap<>(body);
        halves.put("participants", List.of(member(owner, null), contact(irma, null)));
        Map<String, Object> edit = new LinkedHashMap<>();
        edit.put("scope", "THIS_AND_FOLLOWING");
        edit.put(
                "pivotOccurrenceId",
                created.path("occurrences").get(2).path("id").asLong());
        edit.put("version", fixtures.seriesVersion(seriesId));
        edit.put("series", halves);
        send(put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId), owner, edit)
                .andExpect(status().isOk());

        List<String> byDate = jdbc.queryForList(
                "SELECT string_agg(CASE WHEN p.member_user_id IS NOT NULL THEN 'member' ELSE 'contact' END "
                        + "|| '=' || p.share_amount::text, ',' ORDER BY p.member_user_id NULLS LAST) "
                        + "FROM transactions t JOIN transaction_participants p ON p.transaction_id = t.id "
                        + "GROUP BY t.id, t.start_date ORDER BY t.start_date",
                String.class);
        String untouched = "contact=120.00";
        String halved = "member=60.00,contact=60.00";
        // January, February and the confirmed fourth occurrence keep Irmã alone; March and May are halved.
        assertThat(byDate).containsExactly(untouched, untouched, halved, untouched, halved);
    }

    private static JsonNode byName(JsonNode tree, String name) {
        for (JsonNode node : tree) {
            if (name.equals(node.path("name").asString())) {
                return node;
            }
        }
        throw new AssertionError("no category named " + name + " in " + tree);
    }

    private JsonNode spending(Plan plan, User caller) throws Exception {
        return readBody(period(get(CategoryRoutes.CATEGORY + "/spending", plan.getId()), caller));
    }

    private ResultActions period(MockHttpServletRequestBuilder request, User caller) throws Exception {
        LocalDate first = today().withDayOfMonth(1);
        return mockMvc.perform(request.with(testAuthHelper.asUser(caller))
                .param("startDate", first.toString())
                .param("endDate", first.plusMonths(1).minusDays(1).toString()));
    }

    private static Map<String, Object> member(User user, String share) {
        Map<String, Object> participant = new LinkedHashMap<>();
        participant.put("memberId", user.getId());
        if (share != null) {
            participant.put("shareAmount", new BigDecimal(share));
        }
        return participant;
    }

    private static Map<String, Object> contact(Contact contact, String share) {
        Map<String, Object> participant = new LinkedHashMap<>();
        participant.put("contactId", contact.getId());
        if (share != null) {
            participant.put("shareAmount", new BigDecimal(share));
        }
        return participant;
    }

    private Map<String, Object> expense(String amount, String splitMode, Object... participants) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Dinner");
        body.put("startDate", today().toString());
        body.put("splitMode", splitMode);
        body.put("participants", List.of(participants));
        return body;
    }

    private Map<String, Object> seriesBody(String amount, LocalDate start, Object... participants) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Gym");
        body.put("mode", "RECURRING");
        body.put("interval", "MONTHLY");
        body.put("startDate", start.toString());
        body.put("splitMode", "EQUAL");
        body.put("participants", List.of(participants));
        return body;
    }

    private JsonNode create(Plan plan, User caller, Map<String, Object> body) throws Exception {
        return readBody(send(post(TransactionRoutes.TRANSACTION, plan.getId()), caller, body)
                .andExpect(status().isCreated()));
    }

    private static List<String> shares(JsonNode transaction) {
        List<String> shares = new ArrayList<>();
        for (JsonNode participant : transaction.path("participants")) {
            String party = participant.path("contactId").isNull()
                    ? "member:" + participant.path("id").asLong()
                    : "contact:" + participant.path("contactId").asLong();
            shares.add(party + "="
                    + participant.path("shareAmount").decimalValue().setScale(2).toPlainString());
        }
        return shares;
    }

    private static void assertShares(JsonNode transaction, String... expected) {
        assertThat(shares(transaction)).containsExactly(expected);
    }

    private ResultActions send(MockHttpServletRequestBuilder request, User caller, Object body) throws Exception {
        MockHttpServletRequestBuilder signed = request.with(testAuthHelper.asUser(caller));
        if (body != null) {
            signed = signed.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body));
        }
        return mockMvc.perform(signed);
    }

    private JsonNode readBody(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }
}
