package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Imports and series writes that race: the same file imported twice at once stores each row once, a
 * repeated reference inside one file is one row, and a series edit or delete waits for whoever holds
 * the definition's lock (the top-up does).
 */
class ConcurrentImportIT extends AbstractIntegrationTest {

    private static final int HOLD_MILLIS = 700;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Test
    void twoImportsOfTheSameFileAtOnceStoreEachRowOnce() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = csvOfRows(30);
        CountDownLatch go = new CountDownLatch(1);

        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            Callable<Integer> importer = () -> {
                go.await();
                return importCsv(plan, owner, csv).get("imported").asInt();
            };
            Future<Integer> first = pool.submit(importer);
            Future<Integer> second = pool.submit(importer);
            go.countDown();

            assertThat(first.get(30, TimeUnit.SECONDS) + second.get(30, TimeUnit.SECONDS))
                    .as("rows reported imported by the two requests together")
                    .isEqualTo(30);
        } finally {
            pool.shutdownNow();
        }

        assertThat(transactionRepository.findAllByPlan(plan)).hasSize(30);
    }

    @Test
    void aReferenceRepeatedInsideOneFileIsStoredOnce() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = """
                date,amount,id,description
                15/07/2026,-50.00,dup-1,Uber trip
                15/07/2026,-50.00,dup-1,Uber trip again
                16/07/2026,-10.00,other,Coffee
                """;

        assertThat(importCsv(plan, owner, csv).get("imported").asInt()).isEqualTo(2);
        assertThat(transactionRepository.findAllByPlan(plan)).hasSize(2);
    }

    @Test
    void rowsWithoutAReferenceAreAlwaysNew() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = """
                date,amount,id,description
                15/07/2026,-50.00,,Cash
                15/07/2026,-50.00,,Cash
                """;

        assertThat(importCsv(plan, owner, csv).get("imported").asInt()).isEqualTo(2);
        assertThat(importCsv(plan, owner, csv).get("imported").asInt()).isEqualTo(2);
        assertThat(transactionRepository.findAllByPlan(plan)).hasSize(4);
    }

    @Test
    void aRowWithAZeroAmountIsRefusedAsInvalid() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(file("date,amount,id,description\n15/07/2026,0.00,zero-1,Nothing\n"))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isUnprocessableContent());
        assertThat(transactionRepository.findAllByPlan(plan)).isEmpty();
    }

    @Test
    void aSeriesEditWaitsForTheLockOnTheDefinition() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String seriesId = createOpenEndedSeries(plan, owner);
        long version = fixtures.seriesVersion(seriesId);
        Map<String, Object> edit =
                Map.of("scope", "ALL", "version", version, "series", openEndedBody("Streaming plus"));

        assertWaitsForTheLock(
                plan,
                seriesId,
                () -> mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(edit)))
                        .andReturn());
    }

    @Test
    void aSeriesDeleteWaitsForTheLockOnTheDefinition() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String seriesId = createOpenEndedSeries(plan, owner);

        assertWaitsForTheLock(
                plan,
                seriesId,
                () -> mockMvc.perform(
                                delete(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                                        .with(testAuthHelper.asUser(owner))
                                        .param("scope", "ALL"))
                        .andReturn());
    }

    /**
     * Holds the definition's row lock the way a top-up does, starts the request, proves it is still
     * waiting while the lock is held, then releases the lock and expects the request to finish.
     */
    private void assertWaitsForTheLock(Plan plan, String seriesId, Callable<MvcResult> request) throws Exception {
        CountDownLatch locked = new CountDownLatch(1);
        CountDownLatch release = new CountDownLatch(1);
        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            Future<?> holder = pool.submit(() -> transactionTemplate.executeWithoutResult(status -> {
                assertThat(recurrenceDefinitionRepository.findByPlanAndSeriesIdForUpdate(plan, seriesId))
                        .isPresent();
                locked.countDown();
                try {
                    release.await(30, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }));
            assertThat(locked.await(10, TimeUnit.SECONDS)).isTrue();

            Future<MvcResult> pending = pool.submit(request);
            assertThatThrownBy(() -> pending.get(HOLD_MILLIS, TimeUnit.MILLISECONDS))
                    .as("the request must wait while the definition is locked")
                    .isInstanceOf(TimeoutException.class);

            release.countDown();
            holder.get(10, TimeUnit.SECONDS);
            assertThat(pending.get(30, TimeUnit.SECONDS).getResponse().getStatus())
                    .isIn(200, 204);
        } finally {
            release.countDown();
            pool.shutdownNow();
        }
    }

    private String createOpenEndedSeries(Plan plan, User owner) throws Exception {
        MvcResult result = mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(openEndedBody("Streaming"))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper
                .readTree(result.getResponse().getContentAsString())
                .get("seriesId")
                .asString();
    }

    private Map<String, Object> openEndedBody(String description) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("20.00"));
        body.put("description", description);
        body.put("mode", "RECURRING");
        body.put("startDate", LocalDate.parse("2026-07-01").toString());
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private static String csvOfRows(int rows) {
        StringBuilder csv = new StringBuilder("date,amount,id,description\n");
        for (int i = 1; i <= rows; i++) {
            csv.append("15/07/2026,-%d.00,ref-%d,Row %d\n".formatted(i, i, i));
        }
        return csv.toString();
    }

    private static MockMultipartFile file(String content) {
        return new MockMultipartFile("file", "nubank.csv", "text/csv", content.getBytes(StandardCharsets.UTF_8));
    }

    private JsonNode importCsv(Plan plan, User asUser, String csv) throws Exception {
        MvcResult result = mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(file(csv))
                        .with(testAuthHelper.asUser(asUser)))
                .andReturn();
        assertThat(result.getResponse().getStatus()).isIn(200, 201);
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
