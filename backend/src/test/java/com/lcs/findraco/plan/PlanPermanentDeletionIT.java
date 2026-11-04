package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.LinkedHashMap;
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

/** "Delete now": an owner removes an archived plan and everything scoped to it, and nothing else. */
class PlanPermanentDeletionIT extends AbstractIntegrationTest {

    /** Every plan-scoped table, each counted through the plan it belongs to (children through their parent). */
    private static final Map<String, String> ROWS_OF_A_PLAN = Map.ofEntries(
            Map.entry("plan_memberships", "SELECT count(*) FROM plan_memberships WHERE plan_id = ?"),
            Map.entry("plan_invitations", "SELECT count(*) FROM plan_invitations WHERE plan_id = ?"),
            Map.entry("categories", "SELECT count(*) FROM categories WHERE plan_id = ?"),
            Map.entry(
                    "category_member_limits",
                    "SELECT count(*) FROM category_member_limits l JOIN categories c ON c.id = l.category_id"
                            + " WHERE c.plan_id = ?"),
            Map.entry("transactions", "SELECT count(*) FROM transactions WHERE plan_id = ?"),
            Map.entry(
                    "transaction_items",
                    "SELECT count(*) FROM transaction_items i JOIN transactions t ON t.id = i.transaction_id"
                            + " WHERE t.plan_id = ?"),
            Map.entry(
                    "transaction_participants",
                    "SELECT count(*) FROM transaction_participants p JOIN transactions t ON t.id = p.transaction_id"
                            + " WHERE t.plan_id = ?"),
            Map.entry("recurrence_definitions", "SELECT count(*) FROM recurrence_definitions WHERE plan_id = ?"),
            Map.entry(
                    "recurrence_definition_participants",
                    "SELECT count(*) FROM recurrence_definition_participants p"
                            + " JOIN recurrence_definitions d ON d.id = p.recurrence_definition_id"
                            + " WHERE d.plan_id = ?"),
            Map.entry(
                    "recurrence_exceptions",
                    "SELECT count(*) FROM recurrence_exceptions e"
                            + " JOIN recurrence_definitions d ON d.id = e.definition_id WHERE d.plan_id = ?"));

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PlanRepository planRepository;

    private Plan archived(Plan plan) {
        plan.setDeletedAt(fixtures.now().minus(Duration.ofDays(3)));
        return planRepository.save(plan);
    }

    private ResultActions deleteNow(Plan plan, User caller) throws Exception {
        return mockMvc.perform(
                delete(ApiRoutes.PLAN + "/{id}/permanent", plan.getId()).with(testAuthHelper.asUser(caller)));
    }

    private Map<String, Long> rowsOf(Plan plan) {
        Map<String, Long> counts = new LinkedHashMap<>();
        ROWS_OF_A_PLAN.forEach(
                (table, sql) -> counts.put(table, jdbcTemplate.queryForObject(sql, Long.class, plan.getId())));
        return counts;
    }

    private long users() {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM users", Long.class);
    }

    private String postJson(String route, Plan plan, User caller, Object body) throws Exception {
        return mockMvc.perform(post(route, plan.getId())
                        .with(testAuthHelper.asUser(caller))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    /**
     * One of every kind of plan-scoped row: a child category, a member limit, an itemised transaction with
     * participants and an item category, an installment series with a deleted occurrence, a second member and a
     * pending invitation. Returns the invitation token.
     */
    private String seed(Plan plan, User owner, User member) throws Exception {
        fixtures.addMember(plan, member, PlanRole.EDITOR);
        JsonNode parent = objectMapper.readTree(postJson(
                CategoryRoutes.CATEGORY,
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "description",
                        "Home",
                        "memberLimits",
                        List.of(Map.of("memberId", member.getId(), "amount", new BigDecimal("80.00"))))));
        JsonNode child = objectMapper.readTree(postJson(
                CategoryRoutes.CATEGORY,
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "description",
                        "Rent",
                        "parentId",
                        parent.get("id").asLong())));
        postJson(
                TransactionRoutes.TRANSACTION,
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("100.00"),
                        "description",
                        "Dinner",
                        "startDate",
                        today().toString(),
                        "categoryId",
                        parent.get("id").asLong(),
                        "splitMode",
                        "EQUAL",
                        "participants",
                        List.of(Map.of("memberId", owner.getId()), Map.of("memberId", member.getId())),
                        "items",
                        List.of(Map.of(
                                "description",
                                "Starter",
                                "amount",
                                new BigDecimal("100.00"),
                                "categoryId",
                                child.get("id").asLong()))));
        JsonNode series = objectMapper.readTree(postJson(
                TransactionRoutes.TRANSACTION + "/series",
                plan,
                owner,
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        new BigDecimal("90.00"),
                        "description",
                        "Laptop",
                        "mode",
                        "INSTALLMENT",
                        "startDate",
                        today().toString(),
                        "parcelsNumber",
                        3,
                        "splitMode",
                        "EQUAL",
                        "participants",
                        List.of(Map.of("memberId", owner.getId()), Map.of("memberId", member.getId())))));
        long occurrence = series.get("occurrences").get(0).get("id").asLong();
        mockMvc.perform(delete(
                                TransactionRoutes.TRANSACTION + "/series/{seriesId}",
                                plan.getId(),
                                series.get("seriesId").asString())
                        .param("scope", "THIS_ONE")
                        .param("pivotOccurrenceId", String.valueOf(occurrence))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());
        return objectMapper
                .readTree(postJson(PlanRoutes.PLAN_INVITATION, plan, owner, Map.of("role", "VIEWER", "type", "LINK")))
                .get("token")
                .asString();
    }

    @Test
    void deletingNowRemovesThePlanAndEveryRowScopedToItAndNothingElse() throws Exception {
        User owner = fixtures.aUser();
        User member = fixtures.aUser();
        Plan doomed = fixtures.aPlan(owner);
        Plan kept = fixtures.aPlan(owner);
        String doomedToken = seed(doomed, owner, member);
        String keptToken = seed(kept, owner, member);
        archived(doomed);
        Map<String, Long> doomedBefore = rowsOf(doomed);
        Map<String, Long> keptBefore = rowsOf(kept);
        long usersBefore = users();
        assertThat(doomedBefore.values())
                .as("every kind of row is seeded: %s", doomedBefore)
                .allMatch(n -> n > 0);

        deleteNow(doomed, owner).andExpect(status().isNoContent());

        assertThat(planRepository.existsById(doomed.getId())).isFalse();
        assertThat(rowsOf(doomed).values()).as("rows left of the deleted plan").allMatch(n -> n == 0);
        assertThat(planRepository.existsById(kept.getId())).isTrue();
        assertThat(rowsOf(kept)).isEqualTo(keptBefore);
        assertThat(users()).isEqualTo(usersBefore);
        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", doomedToken))
                .andExpect(problem(HttpStatus.NOT_FOUND, "invitation-not-found"));
        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", keptToken)).andExpect(status().isOk());
    }

    @Test
    void anActivePlanIsRefusedAndNothingIsDeleted() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        seed(plan, owner, fixtures.aUser());
        Map<String, Long> before = rowsOf(plan);

        deleteNow(plan, owner).andExpect(problem(HttpStatus.CONFLICT, "plan-not-archived"));

        assertThat(planRepository.existsById(plan.getId())).isTrue();
        assertThat(rowsOf(plan)).isEqualTo(before);
    }

    @Test
    void aMemberWhoIsNotTheOwnerCannotDeleteAnArchivedPlan() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        archived(plan);

        deleteNow(plan, editor).andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));

        assertThat(planRepository.existsById(plan.getId())).isTrue();
    }

    @Test
    void aPlanThatIsAlreadyDeletedAnswersNotFound() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        archived(plan);
        deleteNow(plan, owner).andExpect(status().isNoContent());

        deleteNow(plan, owner).andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));
    }
}
