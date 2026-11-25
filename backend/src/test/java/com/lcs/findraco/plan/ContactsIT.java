package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
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

/** What a plan's contacts do through the API: their names, their balances, archiving and deleting. */
class ContactsIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void createsTrimsAndBoundsTheName() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode mae = readBody(send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "Mãe"))
                .andExpect(status().isCreated()));
        assertThat(mae.path("name").asString()).isEqualTo("Mãe");
        assertThat(mae.path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(mae.path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(mae.path("archived").asBoolean()).isFalse();

        JsonNode padded = readBody(send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "  Tia  "))
                .andExpect(status().isCreated()));
        assertThat(padded.path("name").asString()).isEqualTo("Tia");

        for (String refused : List.of("", "   ", "x".repeat(61))) {
            send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", refused))
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                    .andExpect(jsonPath("$.errors[0].field").value("name"));
        }
        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "x".repeat(60)))
                .andExpect(status().isCreated());

        assertThat(names(list(plan, owner, false))).containsExactly("Mãe", "Tia", "x".repeat(60));
        assertThat(jdbc.queryForObject("SELECT count(*) FROM contacts", Long.class))
                .isEqualTo(3);
    }

    @Test
    void rejectsADuplicateActiveNameOnly() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Plan other = fixtures.aPlan(owner);
        Contact first = fixtures.aContact(plan, "Mãe");

        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "mãe"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-name-taken"))
                .andExpect(jsonPath("$.field").value("name"));
        assertThat(jdbc.queryForObject("SELECT count(*) FROM contacts WHERE plan_id = ?", Long.class, plan.getId()))
                .isEqualTo(1);

        // Another plan, and a member of this plan who carries the name, do not count.
        send(post(ContactRoutes.CONTACT, other.getId()), owner, Map.of("name", "mãe"))
                .andExpect(status().isCreated());
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);
        jdbc.update("UPDATE users SET name = 'Joana' WHERE id = ?", member.getId());
        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "Joana"))
                .andExpect(status().isCreated());

        // An archived contact frees its name.
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), first.getId()), owner, null)
                .andExpect(status().isOk());
        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "mãe"))
                .andExpect(status().isCreated());
    }

    @Test
    void renameReachesTheSharesAndChecksTheVersion() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction row = contactRow(plan, owner, mae, "40.00", today().minusDays(3));
        long version = fixtures.contactVersion(mae.getId());

        JsonNode renamed = readBody(send(
                        put(ContactRoutes.CONTACT + "/{id}", plan.getId(), mae.getId()),
                        owner,
                        Map.of("name", "Mamãe", "version", version))
                .andExpect(status().isOk()));

        assertThat(renamed.path("name").asString()).isEqualTo("Mamãe");
        assertThat(renamed.path("version").asLong()).isGreaterThan(version);
        JsonNode stored =
                readBody(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), row.getId())
                                .with(testAuthHelper.asUser(owner)))
                        .andExpect(status().isOk()));
        assertThat(stored.path("participants").get(0).path("contactName").asString())
                .isEqualTo("Mamãe");

        send(
                        put(ContactRoutes.CONTACT + "/{id}", plan.getId(), mae.getId()),
                        owner,
                        Map.of("name", "Outra", "version", version))
                .andExpect(problem(HttpStatus.CONFLICT, "stale-version"));
        assertThat(names(list(plan, owner, false))).containsExactly("Mamãe");

        send(
                        put(ContactRoutes.CONTACT + "/{id}", plan.getId(), mae.getId()),
                        owner,
                        Map.of("name", "", "version", fixtures.contactVersion(mae.getId())))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
    }

    @Test
    void listsActiveContactsByNameWithTheirBalances() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact caio = fixtures.aContact(plan, "Caio");
        Contact bia = fixtures.aContact(plan, "Bia");
        Contact ana = fixtures.aContact(plan, "Ana");
        Contact dani = fixtures.aContact(plan, "Dani");
        contactRow(plan, owner, ana, "50.00", today().minusDays(2));
        aRepayment(plan, owner, bia, "20.00");
        archive(plan, owner, dani);

        JsonNode active = list(plan, owner, false);
        assertThat(names(active)).containsExactly("Ana", "Bia", "Caio");
        assertThat(active.get(0).path("owed").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(active.get(0).path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(active.get(1).path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(active.get(1).path("credit").decimalValue()).isEqualByComparingTo("20.00");
        assertThat(active.get(2).path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(active.get(2).path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(caio.getId()).isEqualTo(active.get(2).path("id").asLong());

        JsonNode withArchived = list(plan, owner, true);
        assertThat(names(withArchived)).containsExactly("Ana", "Bia", "Caio", "Dani");
        assertThat(withArchived.get(3).path("archived").asBoolean()).isTrue();
        assertThat(withArchived.get(0).path("archived").asBoolean()).isFalse();
    }

    @Test
    void archivesOnlyAtZeroBalance() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact settled = fixtures.aContact(plan, "Settled");
        Contact owes = fixtures.aContact(plan, "Owes");
        Contact credit = fixtures.aContact(plan, "Credit");
        Transaction paid = contactRow(plan, owner, settled, "30.00", today().minusDays(10));
        aRepayment(plan, owner, settled, "30.00");
        contactRow(plan, owner, owes, "0.01", today().minusDays(1));
        aRepayment(plan, owner, credit, "5.00");

        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), owes.getId()), owner, null)
                .andExpect(problem(HttpStatus.CONFLICT, "contact-balance-not-zero"));
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), credit.getId()), owner, null)
                .andExpect(problem(HttpStatus.CONFLICT, "contact-balance-not-zero"));
        assertThat(names(list(plan, owner, false))).contains("Owes", "Credit");

        JsonNode archived =
                readBody(send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), settled.getId()), owner, null)
                        .andExpect(status().isOk()));
        assertThat(archived.path("archived").asBoolean()).isTrue();

        assertThat(names(list(plan, owner, false))).containsExactly("Credit", "Owes");
        assertThat(names(list(plan, owner, true))).containsExactly("Credit", "Owes", "Settled");
        JsonNode stored =
                readBody(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), paid.getId())
                                .with(testAuthHelper.asUser(owner)))
                        .andExpect(status().isOk()));
        assertThat(stored.path("participants").get(0).path("contactName").asString())
                .isEqualTo("Settled");

        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, expenseWithContact("10.00", settled.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-archived"));
    }

    @Test
    void refusesArchiveWithPlannedShares() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact planned = fixtures.aContact(plan, "Planned");
        Contact gym = fixtures.aContact(plan, "Gym");
        Contact ended = fixtures.aContact(plan, "Ended");
        Transaction plannedRow = contactRow(plan, owner, planned, "80.00", today().plusDays(40));
        // Every occurrence so far is past and paid: no share is planned, yet the series is still running.
        String running = createSeries(plan, owner, gym, today().minusDays(70), today().plusDays(1));
        aRepayment(plan, owner, gym, owed(plan, owner, "Gym"));
        createSeries(plan, owner, ended, today().minusDays(70), today().minusDays(5));
        aRepayment(plan, owner, ended, owed(plan, owner, "Ended"));

        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), planned.getId()), owner, null)
                .andExpect(problem(HttpStatus.CONFLICT, "contact-has-planned-shares"));
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), gym.getId()), owner, null)
                .andExpect(problem(HttpStatus.CONFLICT, "contact-has-planned-shares"));
        assertThat(names(list(plan, owner, false))).containsExactly("Ended", "Gym", "Planned");

        archive(plan, owner, ended);

        send(
                        delete(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), running)
                                .param("scope", "ALL"),
                        owner,
                        null)
                .andExpect(status().isOk());
        jdbc.update("DELETE FROM transactions WHERE repayment_contact_id = ?", gym.getId());
        archive(plan, owner, gym);

        send(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), plannedRow.getId()), owner, null)
                .andExpect(status().isOk());
        archive(plan, owner, planned);
        assertThat(names(list(plan, owner, false))).isEmpty();
    }

    @Test
    void unarchiveRestoresUnlessTheNameIsTaken() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact tia = fixtures.aContact(plan, "Tia");
        archive(plan, owner, mae);
        archive(plan, owner, tia);
        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "Mãe"))
                .andExpect(status().isCreated());

        send(post(ContactRoutes.CONTACT + "/{id}/unarchive", plan.getId(), mae.getId()), owner, null)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "contact-name-taken"));
        assertThat(names(list(plan, owner, false))).containsExactly("Mãe");

        JsonNode restored =
                readBody(send(post(ContactRoutes.CONTACT + "/{id}/unarchive", plan.getId(), tia.getId()), owner, null)
                        .andExpect(status().isOk()));
        assertThat(restored.path("archived").asBoolean()).isFalse();
        assertThat(names(list(plan, owner, false))).containsExactly("Mãe", "Tia");
    }

    @Test
    void deletesOnlyAnUnusedContact() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact unused = fixtures.aContact(plan, "Unused");
        Contact trashed = fixtures.aContact(plan, "Trashed");
        Contact live = fixtures.aContact(plan, "Live");
        Contact repaid = fixtures.aContact(plan, "Repaid");
        Contact inSeries = fixtures.aContact(plan, "Series");
        Transaction trashedRow = contactRow(plan, owner, trashed, "10.00", today().minusDays(4));
        contactRow(plan, owner, live, "10.00", today().minusDays(4));
        aRepayment(plan, owner, repaid, "10.00");
        send(post(TransactionRoutes.TRANSACTION + "/series", plan.getId()), owner, monthlySeriesWith(inSeries))
                .andExpect(status().isCreated());
        mockMvc.perform(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), trashedRow.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());

        for (Contact used : List.of(trashed, live, repaid, inSeries)) {
            send(delete(ContactRoutes.CONTACT + "/{id}", plan.getId(), used.getId()), owner, null)
                    .andExpect(problem(HttpStatus.CONFLICT, "contact-in-use"));
        }
        assertThat(names(list(plan, owner, true))).containsExactly("Live", "Repaid", "Series", "Trashed", "Unused");

        send(delete(ContactRoutes.CONTACT + "/{id}", plan.getId(), unused.getId()), owner, null)
                .andExpect(status().isNoContent());
        assertThat(names(list(plan, owner, true))).containsExactly("Live", "Repaid", "Series", "Trashed");
        assertThat(jdbc.queryForObject("SELECT count(*) FROM contacts WHERE id = ?", Long.class, unused.getId()))
                .isZero();
    }

    private Transaction contactRow(Plan plan, User creator, Contact contact, String amount, LocalDate date) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(null, TransactionType.DEBIT, new BigDecimal(amount), "Share", date, null, null),
                SplitMode.EQUAL,
                List.of(Share.ofContact(contact, null)),
                List.of(),
                null,
                null));
    }

    /** A payment from the contact, as the schema stores it; recording one through the API comes with repayments. */
    private void aRepayment(Plan plan, User receiver, Contact contact, String amount) {
        jdbc.update(
                "INSERT INTO transactions (plan_id, created_by, amount, description, type, start_date, confirmation, "
                        + "kind, repayment_contact_id) VALUES (?, ?, ?::numeric, 'Pix', 'CREDIT', ?, 'BY_DATE', "
                        + "'REPAYMENT', ?)",
                plan.getId(),
                receiver.getId(),
                amount,
                today().minusDays(1),
                contact.getId());
    }

    private void archive(Plan plan, User caller, Contact contact) throws Exception {
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), contact.getId()), caller, null)
                .andExpect(status().isOk());
    }

    private Map<String, Object> expenseWithContact(String amount, long contactId) {
        return Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                "Dinner",
                "startDate",
                today().toString(),
                "participants",
                List.of(Map.of("contactId", contactId)));
    }

    private Map<String, Object> monthlySeriesWith(Contact contact) {
        return Map.of(
                "type", "DEBIT",
                "amount", new BigDecimal("120.00"),
                "description", "Gym",
                "mode", "RECURRING",
                "interval", "MONTHLY",
                "startDate", today().plusDays(2).toString(),
                "participants", List.of(Map.of("contactId", contact.getId())));
    }

    /** What the plan's list says the contact owes, to pay exactly that, whatever the calendar generated. */
    private String owed(Plan plan, User owner, String name) throws Exception {
        for (JsonNode contact : list(plan, owner, false)) {
            if (name.equals(contact.path("name").asString())) {
                return contact.path("owed").decimalValue().toPlainString();
            }
        }
        throw new AssertionError("no contact " + name);
    }

    private String createSeries(Plan plan, User owner, Contact contact, LocalDate start, LocalDate end)
            throws Exception {
        Map<String, Object> body = new LinkedHashMap<>(monthlySeriesWith(contact));
        body.put("startDate", start.toString());
        body.put("endDate", end.toString());
        body.put("requiresConfirmation", false);
        return readBody(send(post(TransactionRoutes.TRANSACTION + "/series", plan.getId()), owner, body)
                        .andExpect(status().isCreated()))
                .path("seriesId")
                .asString();
    }

    private JsonNode list(Plan plan, User caller, boolean archived) throws Exception {
        return readBody(mockMvc.perform(get(ContactRoutes.CONTACT, plan.getId())
                        .with(testAuthHelper.asUser(caller))
                        .param("archived", String.valueOf(archived)))
                .andExpect(status().isOk()));
    }

    private static List<String> names(JsonNode contacts) {
        List<String> names = new ArrayList<>();
        contacts.forEach(contact -> names.add(contact.path("name").asString()));
        return names;
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
