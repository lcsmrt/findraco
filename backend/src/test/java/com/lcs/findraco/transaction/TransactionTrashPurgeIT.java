package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.config.TransactionTrashProperties;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.service.TransactionTrashPurgeJob;
import com.lcs.findraco.transaction.service.TransactionTrashService;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** The daily job deletes a deletion at 30 days with everything that hangs from it, and keeps a younger one. */
class TransactionTrashPurgeIT extends AbstractIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;
    private static final Instant NOW = Instant.parse("2026-11-18T10:00:00Z");

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private TransactionTrashService trashService;

    private TransactionTrashPurgeJob job() {
        return new TransactionTrashPurgeJob(
                trashService, new TransactionTrashProperties("-"), Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void purgesAtThirtyDaysAndKeepsYounger() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long dueDeletion = trashRowWithItem(plan, owner);
        long dueSeries = trashSeries(plan, owner);
        long youngDeletion = trashRowWithItem(plan, owner);
        backdate(dueDeletion, NOW.minus(Duration.ofDays(30)));
        backdate(dueSeries, NOW.minus(Duration.ofDays(30)));
        backdate(youngDeletion, NOW.minus(Duration.ofDays(29)).minus(Duration.ofHours(23)));

        job().run();

        assertThat(jdbc.queryForList("SELECT id FROM transaction_deletions", Long.class))
                .containsExactly(youngDeletion);
        assertThat(count("transactions")).isEqualTo(1);
        assertThat(count("transaction_participants")).isEqualTo(1);
        assertThat(count("transaction_items")).isEqualTo(1);
        assertThat(count("recurrence_definitions")).isZero();
        assertThat(count("transactions WHERE deletion_id = " + youngDeletion)).isEqualTo(1);
    }

    private long count(String from) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM " + from, Long.class);
    }

    private void backdate(long deletionId, Instant deletedAt) {
        jdbc.update(
                "UPDATE transaction_deletions SET deleted_at = ? WHERE id = ?",
                java.sql.Timestamp.from(deletedAt),
                deletionId);
    }

    private long trashRowWithItem(Plan plan, User owner) throws Exception {
        Map<String, Object> body = Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("40.00"),
                "description",
                "With item",
                "startDate",
                LocalDate.of(2026, 11, 10).toString(),
                "items",
                List.of(Map.of("description", "Item", "amount", new BigDecimal("10.00"), "quantity", 1)));
        long id = objectMapper
                .readTree(mockMvc.perform(post(TX, plan.getId())
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString())
                .get("id")
                .asLong();
        return deletionId(mockMvc.perform(delete(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());
    }

    private long trashSeries(Plan plan, User owner) throws Exception {
        Map<String, Object> body = Map.of(
                "type", "DEBIT",
                "amount", new BigDecimal("300.00"),
                "description", "Laptop",
                "mode", "INSTALLMENT",
                "startDate", LocalDate.of(2026, 1, 15).toString(),
                "parcelsNumber", 6,
                "splitMode", "EQUAL");
        String seriesId = objectMapper
                .readTree(mockMvc.perform(post(TX + "/series", plan.getId())
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString())
                .get("seriesId")
                .asString();
        return deletionId(mockMvc.perform(delete(TX + "/series/{seriesId}", plan.getId(), seriesId)
                        .param("scope", "ALL")
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());
    }

    private long deletionId(String body) throws Exception {
        JsonNode node = objectMapper.readTree(body);
        return node.get("deletionId").asLong();
    }
}
