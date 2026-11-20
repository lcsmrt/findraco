package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * The review of movements: which rows with no kind are proposed and as what, who sees them, and what applying a
 * proposal does to the row.
 */
class NeutralCandidatesIT extends AbstractIntegrationTest {

    private static final String CANDIDATES = TransactionRoutes.TRANSACTION + "/neutral-candidates";
    private static final String PIX_OUT = "Transferência enviada pelo Pix - MARINA SOUZA LIMA - ••.123.456-•• - NU";
    private static final String PIX_IN = "Transferência recebida pelo Pix - Marína Lima - ••.123.456-•• - NU";
    private static final String PIX_OTHER = "Transferência enviada pelo Pix - MARINA COSTA - ••.987.654-•• - NU";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void candidatesMatchTheRules() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        member(plan, "Marina Lima", PlanRole.EDITOR);
        LocalDate day = LocalDate.of(2026, 11, 20);
        Transaction sent = imported(plan, owner, "500.00", day.minusDays(3), PIX_OUT, null);
        Transaction received = imported(plan, owner, "500.00", day.minusDays(1), PIX_IN, null);
        Transaction bill = imported(plan, owner, "1500.00", day, "Pagamento de fatura", null);
        imported(plan, owner, "40.00", day, PIX_OTHER, null);
        imported(plan, owner, "75.00", day, "Pagamento de fatura", TransactionKind.CARD_BILL_PAYMENT);
        imported(plan, owner, "60.00", day, null, null);
        Transaction trashed = imported(plan, owner, "90.00", day, "Pagamento de fatura", null);
        mockMvc.perform(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), trashed.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());

        JsonNode page = candidates(plan, owner, "");

        assertThat(page.path("totalElements").asLong()).isEqualTo(3);
        assertThat(page.path("content")).hasSize(3);
        assertThat(candidate(page, 0, "id")).isEqualTo(bill.getId());
        assertThat(page.path("content").get(0).path("proposedKind").asString()).isEqualTo("CARD_BILL_PAYMENT");
        assertThat(candidate(page, 1, "id")).isEqualTo(received.getId());
        assertThat(page.path("content").get(1).path("proposedKind").asString()).isEqualTo("TRANSFER");
        assertThat(candidate(page, 2, "id")).isEqualTo(sent.getId());
        assertThat(page.path("content").get(2).path("proposedKind").asString()).isEqualTo("TRANSFER");
    }

    @Test
    void candidatesArePaged() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = LocalDate.of(2026, 11, 20);
        for (int i = 0; i < 5; i++) {
            imported(plan, owner, "10.00", day.minusDays(i), "Pagamento de fatura", null);
        }

        JsonNode second = candidates(plan, owner, "?page=1&size=2");

        assertThat(second.path("totalElements").asLong()).isEqualTo(5);
        assertThat(second.path("totalPages").asInt()).isEqualTo(3);
        assertThat(second.path("page").asInt()).isEqualTo(1);
        assertThat(second.path("content")).hasSize(2);
    }

    @Test
    void applyingACandidateSetsItsKind() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = LocalDate.of(2026, 11, 20);
        Transaction bill = imported(plan, owner, "100.00", day, "Pagamento de fatura", null);
        Transaction untouched = imported(plan, owner, "30.00", day, "Pagamento de fatura", null);
        long version = fixtures.transactionVersion(bill.getId());
        assertThat(expenses(plan, owner)).isEqualByComparingTo("130.00");

        JsonNode applied = read(
                apply(plan, owner, bill.getId(), "CARD_BILL_PAYMENT", version).andExpect(status().isOk()));

        assertThat(applied.path("kind").asString()).isEqualTo("CARD_BILL_PAYMENT");
        assertThat(applied.path("version").asLong()).isGreaterThan(version);
        assertThat(transactionRepository.findById(bill.getId()).orElseThrow().getKind())
                .isEqualTo(TransactionKind.CARD_BILL_PAYMENT);
        assertThat(expenses(plan, owner)).isEqualByComparingTo("30.00");
        JsonNode remaining = candidates(plan, owner, "");
        assertThat(remaining.path("content")).hasSize(1);
        assertThat(candidate(remaining, 0, "id")).isEqualTo(untouched.getId());
        assertThat(transactionRepository
                        .findById(untouched.getId())
                        .orElseThrow()
                        .getKind())
                .isNull();

        // The old version no longer matches: nothing changes.
        apply(plan, owner, bill.getId(), "SAVINGS", version).andExpect(problem(HttpStatus.CONFLICT, "stale-version"));
        assertThat(transactionRepository.findById(bill.getId()).orElseThrow().getKind())
                .isEqualTo(TransactionKind.CARD_BILL_PAYMENT);

        // Applying again with the version it now has sets the same kind.
        apply(
                        plan,
                        owner,
                        bill.getId(),
                        "CARD_BILL_PAYMENT",
                        applied.path("version").asLong())
                .andExpect(status().isOk());
    }

    @Test
    void applyingAKindTheRowCannotCarryAnswers422AndChangesNothing() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Transaction purchase = imported(plan, owner, "100.00", LocalDate.of(2026, 11, 20), "Mercado", null);

        apply(plan, owner, purchase.getId(), "REFUND", fixtures.transactionVersion(purchase.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));

        assertThat(transactionRepository
                        .findById(purchase.getId())
                        .orElseThrow()
                        .getKind())
                .isNull();
    }

    @Test
    void reviewFollowsTheRowRoles() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User contributor = fixtures.aUser();
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        User outsider = fixtures.aUser();
        fixtures.aPlan(outsider);
        LocalDate day = LocalDate.of(2026, 11, 20);
        Transaction theirs = imported(plan, contributor, "10.00", day, "Pagamento de fatura", null);
        Transaction ownersRow = imported(plan, owner, "20.00", day, "Pagamento de fatura", null);

        JsonNode contributorsList = candidates(plan, contributor, "");
        JsonNode ownersList = candidates(plan, owner, "");

        assertThat(ids(contributorsList)).containsExactly(theirs.getId());
        assertThat(ids(ownersList)).containsExactlyInAnyOrder(theirs.getId(), ownersRow.getId());
        apply(plan, contributor, ownersRow.getId(), "CARD_BILL_PAYMENT", fixtures.transactionVersion(ownersRow.getId()))
                .andExpect(problem(HttpStatus.FORBIDDEN, "not-transaction-creator"));
        apply(plan, contributor, theirs.getId(), "CARD_BILL_PAYMENT", fixtures.transactionVersion(theirs.getId()))
                .andExpect(status().isOk());
        mockMvc.perform(get(CANDIDATES, plan.getId()).with(testAuthHelper.asUser(outsider)))
                .andExpect(status().isNotFound());
        apply(plan, outsider, ownersRow.getId(), "CARD_BILL_PAYMENT", fixtures.transactionVersion(ownersRow.getId()))
                .andExpect(status().isNotFound());
        assertThat(transactionRepository
                        .findById(ownersRow.getId())
                        .orElseThrow()
                        .getKind())
                .isNull();
    }

    private BigDecimal expenses(Plan plan, User caller) throws Exception {
        return read(mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                                .with(testAuthHelper.asUser(caller))
                                .param("startDate", "2026-11-01")
                                .param("endDate", "2026-11-30"))
                        .andExpect(status().isOk()))
                .path("totalExpenses")
                .decimalValue();
    }

    private ResultActions apply(Plan plan, User caller, long id, String kind, long version) throws Exception {
        return mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/{id}/kind", plan.getId(), id)
                .with(testAuthHelper.asUser(caller))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("kind", kind, "version", version))));
    }

    private JsonNode candidates(Plan plan, User caller, String query) throws Exception {
        return read(mockMvc.perform(get(CANDIDATES + query, plan.getId()).with(testAuthHelper.asUser(caller)))
                .andExpect(status().isOk()));
    }

    private static long candidate(JsonNode page, int index, String field) {
        return page.path("content").get(index).path("transaction").path(field).asLong();
    }

    private static List<Long> ids(JsonNode page) {
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < page.path("content").size(); i++) {
            ids.add(candidate(page, i, "id"));
        }
        return ids;
    }

    private JsonNode read(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }

    private User member(Plan plan, String name, PlanRole role) {
        User user = fixtures.aUser();
        jdbc.update("UPDATE users SET name = ? WHERE id = ?", name, user.getId());
        fixtures.addMember(plan, user, role);
        return user;
    }

    private Transaction imported(
            Plan plan, User creator, String amount, LocalDate date, String sourceText, TransactionKind kind) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(
                        null,
                        TransactionType.DEBIT,
                        new BigDecimal(amount),
                        sourceText == null ? "Manual" : sourceText,
                        date,
                        null,
                        null,
                        kind),
                SplitMode.EQUAL,
                List.of(new Share(creator, null)),
                List.of(),
                null,
                sourceText,
                null));
    }
}
