package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

/** Every way in creates a transaction through the same aggregate, so its rules hold on each of them. */
class TransactionEntryPathsIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DataSource dataSource;

    @Test
    void anHttpRequestWithoutParticipantsIsRejectedAndNothingIsStored() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("EQUAL", List.of()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "participants-required"));

        assertThat(count("SELECT COUNT(*) FROM transactions")).isZero();
    }

    @Test
    void aCsvRowNeverBecomesATransactionWithoutParticipants() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = """
                date,amount,id,description
                15/07/2026,-50.00,nu-ext-1,Uber trip
                16/07/2026,1200.00,nu-ext-2,Salary payment
                """;

        mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(new MockMultipartFile(
                                "file", "nubank.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8)))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isCreated());

        assertThat(count("SELECT COUNT(*) FROM transactions")).isEqualTo(2);
        assertThat(count("SELECT COUNT(*) FROM transactions t WHERE NOT EXISTS "
                        + "(SELECT 1 FROM transaction_participants p WHERE p.transaction_id = t.id)"))
                .isZero();
        assertThat(count("SELECT COUNT(*) FROM transaction_participants p JOIN transactions t "
                        + "ON t.id = p.transaction_id WHERE p.member_user_id = " + owner.getId()
                        + " AND p.share_amount = t.amount"))
                .isEqualTo(2);
    }

    @Test
    void anExactSplitWithAMissingShareAnswers422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Map<String, Object> withShare = new HashMap<>();
        withShare.put("memberId", owner.getId());
        withShare.put("shareAmount", "100.00");
        Map<String, Object> withoutShare = new HashMap<>();
        withoutShare.put("memberId", partner.getId());

        create(plan, owner, body("EXACT", List.of(withShare, withoutShare)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "exact-share-invalid"));

        assertThat(count("SELECT COUNT(*) FROM transactions")).isZero();
    }

    private ResultActions create(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        return mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private static Map<String, Object> body(String splitMode, List<Map<String, Object>> participants) {
        return Map.of(
                "type", "DEBIT",
                "amount", "100.00",
                "description", "Groceries",
                "startDate", "2026-07-15",
                "splitMode", splitMode,
                "participants", participants);
    }

    private long count(String sql) {
        Long count = new JdbcTemplate(dataSource).queryForObject(sql, Long.class);
        return count == null ? 0 : count;
    }
}
