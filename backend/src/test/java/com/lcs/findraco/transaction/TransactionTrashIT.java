package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import com.lcs.findraco.transaction.service.SeriesHorizon;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * A delete moves transactions to the plan's trash; every reader skips them; a restore brings back the rows and
 * undoes what the delete changed on the series, or refuses with nothing changed. All through the API.
 */
class TransactionTrashIT extends AbstractIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private OpenEndedSeriesTopUpService topUpService;

    @Autowired
    private SeriesHorizon seriesHorizon;

    @Test
    void deleteAnswersDeletionIdAndHidesTheRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate november = LocalDate.of(2026, 11, 10);
        long kept = createTransaction(plan, owner, "Rent", "100.00", november, null);
        long doomed = createTransaction(plan, owner, "Fuel", "50.00", november, null);
        assertThat(expenses(plan, owner, november)).isEqualByComparingTo("150.00");

        mockMvc.perform(delete(TX + "/{id}", plan.getId(), doomed).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletionId").isNumber());

        assertThat(listedIds(plan, owner)).containsExactly(kept);
        assertThat(expenses(plan, owner, november)).isEqualByComparingTo("100.00");
    }

    @Test
    void seriesDeleteMakesOneDeletionForEveryRowInScope() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, installment("Laptop", "300.00", LocalDate.of(2026, 1, 15), 6));
        String seriesId = series.get("seriesId").asString();
        long parcel4 = series.get("occurrences").get(3).get("id").asLong();

        long deletionId = deleteSeries(plan, owner, seriesId, "THIS_AND_FOLLOWING", parcel4);

        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM transaction_deletions", Long.class))
                .isEqualTo(1);
        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transactions WHERE deletion_id = ?", Long.class, deletionId))
                .isEqualTo(3);
        assertThat(listedIds(plan, owner))
                .containsExactlyInAnyOrder(
                        series.get("occurrences").get(0).get("id").asLong(),
                        series.get("occurrences").get(1).get("id").asLong(),
                        series.get("occurrences").get(2).get("id").asLong());
    }

    @Test
    void singleDeleteOfAnOccurrenceIsNotRecreatedByASeriesEdit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate start = LocalDate.of(2026, 1, 15);
        JsonNode series = createSeries(plan, owner, recurring("Gym", "50.00", start, start.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = series.get("occurrences").get(2).get("id").asLong();

        mockMvc.perform(delete(TX + "/{id}", plan.getId(), march).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());

        Map<String, Object> edit = recurring("Gym 2", "60.00", start, start.plusMonths(4));
        edit.put("scope", "ALL");
        edit.put("version", fixtures.seriesVersion(seriesId));
        JsonNode edited = editSeries(plan, owner, seriesId, edit);

        assertThat(edited.get("occurrences"))
                .extracting(occurrence -> occurrence.get("startDate").asString())
                .containsExactly("2026-01-15", "2026-02-15", "2026-04-15", "2026-05-15");
        assertThat(jdbc.queryForList("SELECT exception_date::text FROM recurrence_exceptions", String.class))
                .containsExactly("2026-03-15");
    }

    @Test
    void trashedTransactionIsNotFoundById() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = LocalDate.of(2026, 11, 10);
        long id = createTransaction(plan, owner, "Fuel", "50.00", day, null);
        mockMvc.perform(delete(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());
        String updateBody = objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("1.00"),
                "description",
                "x",
                "startDate",
                day.toString(),
                "items",
                List.of(),
                "version",
                0));
        String confirmBody = objectMapper.writeValueAsString(
                Map.of("amount", new BigDecimal("1.00"), "startDate", day.toString(), "version", 0));

        mockMvc.perform(get(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "transaction-not-found"));
        mockMvc.perform(put(TX + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(problem(HttpStatus.NOT_FOUND, "transaction-not-found"));
        mockMvc.perform(post(TX + "/{id}/confirm", plan.getId(), id)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(confirmBody))
                .andExpect(problem(HttpStatus.NOT_FOUND, "transaction-not-found"));
        mockMvc.perform(delete(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "transaction-not-found"));

        String seriesId = createSeries(plan, owner, installment("Laptop", "300.00", day, 3))
                .get("seriesId")
                .asString();
        deleteSeries(plan, owner, seriesId, "ALL", null);
        mockMvc.perform(delete(TX + "/series/{seriesId}", plan.getId(), seriesId)
                        .param("scope", "ALL")
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "series-not-found"));
    }

    @Test
    void trashedSeriesIsNotToppedUp() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String seriesId = createSeries(plan, owner, openEnded("Streaming", "20.00", fixtures.today()))
                .get("seriesId")
                .asString();
        deleteSeries(plan, owner, seriesId, "ALL", null);
        long rowsBefore = rowsOf(seriesId);

        topUpService.extendTo(plan.getId(), fixtures.today().plusYears(3));
        seriesHorizon.ensureCovered(plan.getId(), fixtures.today().plusYears(5));

        assertThat(rowsOf(seriesId)).isEqualTo(rowsBefore);
        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transactions WHERE series_id = ? AND deletion_id IS NULL",
                        Long.class,
                        seriesId))
                .isZero();
    }

    @Test
    void trashedRowsCountInNoReader() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category category = fixtures.aCategory(plan, TransactionType.DEBIT, "Home");
        LocalDate day = LocalDate.of(2026, 11, 10);
        createTransaction(plan, owner, "Rent active", "100.00", day, category.getId());
        long trashed = createTransaction(plan, owner, "Rent trashed", "30.00", day, category.getId());
        mockMvc.perform(delete(TX + "/{id}", plan.getId(), trashed).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk());
        String from = "2026-11-01";
        String to = "2026-11-30";

        JsonNode summary = json(mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .param("startDate", from)
                        .param("endDate", to)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(summary.get("totalExpenses").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(summary.get("personBreakdown").get(0).get("expense").decimalValue())
                .isEqualByComparingTo("100.00");

        JsonNode trend = json(mockMvc.perform(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId())
                        .param("startDate", from)
                        .param("endDate", to)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(trend.get(0).get("expenses").decimalValue()).isEqualByComparingTo("100.00");

        JsonNode spending = json(mockMvc.perform(get(CategoryRoutes.CATEGORY + "/spending", plan.getId())
                        .param("startDate", from)
                        .param("endDate", to)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(findSpent(spending, category.getId())).isEqualByComparingTo("100.00");

        JsonNode usage =
                json(mockMvc.perform(get(CategoryRoutes.CATEGORY + "/{id}/usage", plan.getId(), category.getId())
                                .with(testAuthHelper.asUser(owner)))
                        .andExpect(status().isOk()));
        assertThat(usage.get("transactions").asLong()).isEqualTo(1);

        JsonNode searched = json(mockMvc.perform(
                        get(TX, plan.getId()).param("description", "Rent").with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(searched.get("content")).hasSize(1);
        assertThat(searched.get("content").get(0).get("description").asString()).isEqualTo("Rent active");
    }

    @Test
    void restoreBringsBackTheOriginalRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category category = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        LocalDate day = LocalDate.of(2026, 11, 10);
        Map<String, Object> body = transactionBody("Dinner", "80.00", day, category.getId());
        body.put("items", List.of(Map.of("description", "Wine", "amount", new BigDecimal("30.00"), "quantity", 1)));
        long id = json(mockMvc.perform(post(TX, plan.getId())
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                        .andExpect(status().isCreated()))
                .get("id")
                .asLong();
        JsonNode before = fetch(plan, owner, id);
        long deletionId = deleteTransaction(plan, owner, id);

        mockMvc.perform(post(TX + "/trash/{id}/restore", plan.getId(), deletionId)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.restored").value(1));

        JsonNode after = fetch(plan, owner, id);
        assertThat(after.get("amount").decimalValue()).isEqualByComparingTo("80.00");
        assertThat(after.get("startDate").asString()).isEqualTo(day.toString());
        assertThat(after.get("category").get("id").asLong()).isEqualTo(category.getId());
        assertThat(after.get("participants")).isEqualTo(before.get("participants"));
        assertThat(after.get("items")).hasSize(1);
        assertThat(after.get("items").get(0).get("description").asString()).isEqualTo("Wine");
        assertThat(listedIds(plan, owner)).containsExactly(id);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM transaction_deletions", Long.class))
                .isZero();
    }

    @Test
    void restoreOnlyThisRemovesTheException() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate start = LocalDate.of(2026, 1, 15);
        JsonNode series = createSeries(plan, owner, recurring("Gym", "50.00", start, start.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = series.get("occurrences").get(2).get("id").asLong();

        long deletionId = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM recurrence_exceptions", Long.class))
                .isEqualTo(1);

        restore(plan, owner, deletionId)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.restored").value(1));

        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM recurrence_exceptions", Long.class))
                .isZero();
        assertThat(listedIds(plan, owner)).hasSize(5).contains(march);
    }

    @Test
    void restoreFollowingPutsBackTheSeriesEnd() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode installments =
                createSeries(plan, owner, installment("Laptop", "300.00", LocalDate.of(2026, 1, 15), 6));
        String installmentsId = installments.get("seriesId").asString();
        long parcel4 = installments.get("occurrences").get(3).get("id").asLong();

        long deletionId = deleteSeries(plan, owner, installmentsId, "THIS_AND_FOLLOWING", parcel4);
        assertThat(definition(plan, owner, installmentsId).get("parcelsNumber").asInt())
                .isEqualTo(3);
        restore(plan, owner, deletionId)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.restored").value(3));

        assertThat(definition(plan, owner, installmentsId).get("parcelsNumber").asInt())
                .isEqualTo(6);
        assertThat(listedIds(plan, owner)).hasSize(6);

        LocalDate start = fixtures.today();
        JsonNode open = createSeries(plan, owner, openEnded("Streaming", "20.00", start));
        String openId = open.get("seriesId").asString();
        long fifth = open.get("occurrences").get(4).get("id").asLong();

        long openDeletion = deleteSeries(plan, owner, openId, "THIS_AND_FOLLOWING", fifth);
        assertThat(definition(plan, owner, openId).get("endDate").isNull()).isFalse();
        restore(plan, owner, openDeletion).andExpect(status().isOk());

        assertThat(definition(plan, owner, openId).get("endDate").isNull()).isTrue();
    }

    @Test
    void restoreAllReactivatesTheSeries() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, openEnded("Streaming", "20.00", fixtures.today()));
        String seriesId = series.get("seriesId").asString();
        int generated = series.get("count").asInt();

        long deletionId = deleteSeries(plan, owner, seriesId, "ALL", null);
        assertThat(listedIds(plan, owner)).isEmpty();
        restore(plan, owner, deletionId)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.restored").value(generated));

        assertThat(listedIds(plan, owner)).hasSize(generated);
        topUpService.extendTo(plan.getId(), fixtures.today().plusYears(3));
        assertThat(rowsOf(seriesId)).isGreaterThan(generated);
    }

    @Test
    void restoreAfterTheSeriesChangedIsAConflict() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, installment("Laptop", "300.00", LocalDate.of(2026, 1, 15), 6));
        String seriesId = series.get("seriesId").asString();
        long parcel4 = series.get("occurrences").get(3).get("id").asLong();
        long parcel1 = series.get("occurrences").get(0).get("id").asLong();
        long deletionId = deleteSeries(plan, owner, seriesId, "THIS_AND_FOLLOWING", parcel4);

        Map<String, Object> edit = installment("Laptop renamed", "300.00", LocalDate.of(2026, 1, 15), 3);
        edit.put("scope", "THIS_ONE");
        edit.put("pivotOccurrenceId", parcel1);
        edit.put("version", fixtures.seriesVersion(seriesId));
        editSeries(plan, owner, seriesId, edit);
        long parcelsBefore =
                definition(plan, owner, seriesId).get("parcelsNumber").asLong();

        restore(plan, owner, deletionId).andExpect(problem(HttpStatus.CONFLICT, "trash-series-changed"));

        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transactions WHERE deletion_id = ?", Long.class, deletionId))
                .isEqualTo(3);
        assertThat(definition(plan, owner, seriesId).get("parcelsNumber").asLong())
                .isEqualTo(parcelsBefore);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM transaction_deletions", Long.class))
                .isEqualTo(1);
    }

    @Test
    void restoreOfAMissingDeletionIsNotFound() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Plan other = fixtures.aPlan(owner);
        long id = createTransaction(plan, owner, "Fuel", "50.00", LocalDate.of(2026, 11, 10), null);
        long deletionId = deleteTransaction(plan, owner, id);

        restore(plan, owner, 999_999L).andExpect(problem(HttpStatus.NOT_FOUND, "trash-entry-not-found"));
        restore(other, owner, deletionId).andExpect(problem(HttpStatus.NOT_FOUND, "trash-entry-not-found"));
        restore(plan, owner, deletionId).andExpect(status().isOk());
        restore(plan, owner, deletionId).andExpect(problem(HttpStatus.NOT_FOUND, "trash-entry-not-found"));
    }

    @Test
    void restoreWithoutRightsOnEveryRowIsDenied() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        long id = createTransaction(plan, owner, "Fuel", "50.00", LocalDate.of(2026, 11, 10), null);
        long deletionId = deleteTransaction(plan, editor, id);
        jdbc.update(
                "UPDATE plan_memberships SET role = 'CONTRIBUTOR' WHERE plan_id = ? AND user_id = ?",
                plan.getId(),
                editor.getId());

        restore(plan, editor, deletionId).andExpect(problem(HttpStatus.FORBIDDEN, "not-transaction-creator"));

        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transactions WHERE deletion_id = ?", Long.class, deletionId))
                .isEqualTo(1);
    }

    @Test
    void trashListsDeletionsNewestFirstWithTotals() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long single = createTransaction(plan, owner, "Fuel", "50.00", LocalDate.of(2026, 11, 10), null);
        long singleDeletion = deleteTransaction(plan, owner, single);
        String seriesId = createSeries(plan, owner, installment("Laptop", "300.00", LocalDate.of(2026, 1, 15), 6))
                .get("seriesId")
                .asString();
        long seriesDeletion = deleteSeries(plan, owner, seriesId, "ALL", null);

        JsonNode page = json(mockMvc.perform(get(TX + "/trash", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));

        JsonNode entries = page.get("content");
        assertThat(entries).hasSize(2);
        assertThat(entries.get(0).get("id").asLong()).isEqualTo(seriesDeletion);
        assertThat(entries.get(0).get("kind").asString()).isEqualTo("SERIES");
        assertThat(entries.get(0).get("scope").asString()).isEqualTo("ALL");
        assertThat(entries.get(0).get("description").asString()).isEqualTo("Laptop");
        assertThat(entries.get(0).get("count").asInt()).isEqualTo(6);
        assertThat(entries.get(0).get("amount").decimalValue()).isEqualByComparingTo("1800.00");
        assertThat(entries.get(0).get("deletedBy").get("id").asLong()).isEqualTo(owner.getId());
        Instant deletedAt = Instant.parse(entries.get(0).get("deletedAt").asString());
        assertThat(Instant.parse(entries.get(0).get("expiresAt").asString()))
                .isEqualTo(deletedAt.plus(Duration.ofDays(30)));
        assertThat(entries.get(1).get("id").asLong()).isEqualTo(singleDeletion);
        assertThat(entries.get(1).get("count").asInt()).isEqualTo(1);
    }

    @Test
    void contributorSeesOnlyTheirOwnDeletions() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User contributor = fixtures.aUser();
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        long ownersRow = createTransaction(plan, owner, "Fuel", "50.00", LocalDate.of(2026, 11, 10), null);
        long contributorsRow = createTransaction(plan, contributor, "Bus", "5.00", LocalDate.of(2026, 11, 10), null);
        deleteTransaction(plan, owner, ownersRow);
        long mine = deleteTransaction(plan, contributor, contributorsRow);

        JsonNode contributorsTrash =
                json(mockMvc.perform(get(TX + "/trash", plan.getId()).with(testAuthHelper.asUser(contributor)))
                        .andExpect(status().isOk()));
        JsonNode ownersTrash =
                json(mockMvc.perform(get(TX + "/trash", plan.getId()).with(testAuthHelper.asUser(owner)))
                        .andExpect(status().isOk()));

        assertThat(contributorsTrash.get("content")).hasSize(1);
        assertThat(contributorsTrash.get("content").get(0).get("id").asLong()).isEqualTo(mine);
        assertThat(ownersTrash.get("content")).hasSize(2);
    }

    @Test
    void reimportSkipsATrashedRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = """
                date,amount,id,description
                15/07/2026,-50.00,nu-ext-1,Uber trip
                16/07/2026,1200.00,nu-ext-2,Salary payment
                """;
        importCsv(plan, owner, csv);
        List<Long> ids = listedIds(plan, owner);
        deleteTransaction(plan, owner, ids.get(0));

        JsonNode again = importCsv(plan, owner, csv);

        assertThat(again.get("imported").asInt()).isZero();
        assertThat(again.get("skippedDuplicates").asInt()).isEqualTo(2);
        assertThat(listedIds(plan, owner)).hasSize(1);
    }

    @Test
    void categoryDeleteIgnoresAndMovesTrashedRows() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = LocalDate.of(2026, 11, 10);
        Category unused = fixtures.aCategory(plan, TransactionType.DEBIT, "Unused");
        long trashedId = createTransactionWithItem(plan, owner, unused.getId(), day);
        deleteTransaction(plan, owner, trashedId);

        mockMvc.perform(delete(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), unused.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());
        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transactions WHERE id = ? AND category_id IS NULL",
                        Long.class,
                        trashedId))
                .isEqualTo(1);
        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transaction_items WHERE transaction_id = ? AND category_id IS NULL",
                        Long.class,
                        trashedId))
                .isEqualTo(1);

        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Source");
        Category target = fixtures.aCategory(plan, TransactionType.DEBIT, "Target");
        long trashedToMove = createTransactionWithItem(plan, owner, source.getId(), day);
        deleteTransaction(plan, owner, trashedToMove);

        mockMvc.perform(delete(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), source.getId())
                        .param("reassignTo", target.getId().toString())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());
        assertThat(jdbc.queryForObject("SELECT category_id FROM transactions WHERE id = ?", Long.class, trashedToMove))
                .isEqualTo(target.getId());
        assertThat(jdbc.queryForObject(
                        "SELECT category_id FROM transaction_items WHERE transaction_id = ?",
                        Long.class,
                        trashedToMove))
                .isEqualTo(target.getId());
    }

    @Test
    void restoreAfterCategoryDeleteUsesTheTarget() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = LocalDate.of(2026, 11, 10);
        Category source = fixtures.aCategory(plan, TransactionType.DEBIT, "Source");
        Category target = fixtures.aCategory(plan, TransactionType.DEBIT, "Target");
        long toTarget = createTransaction(plan, owner, "Fuel", "50.00", day, source.getId());
        long toTargetDeletion = deleteTransaction(plan, owner, toTarget);
        mockMvc.perform(delete(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), source.getId())
                        .param("reassignTo", target.getId().toString())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        restore(plan, owner, toTargetDeletion).andExpect(status().isOk());
        assertThat(fetch(plan, owner, toTarget).get("category").get("id").asLong())
                .isEqualTo(target.getId());

        Category alone = fixtures.aCategory(plan, TransactionType.DEBIT, "Alone");
        long toNone = createTransaction(plan, owner, "Bus", "5.00", day, alone.getId());
        long toNoneDeletion = deleteTransaction(plan, owner, toNone);
        mockMvc.perform(delete(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), alone.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        restore(plan, owner, toNoneDeletion).andExpect(status().isOk());
        assertThat(fetch(plan, owner, toNone).get("category").isNull()).isTrue();
    }

    // --- helpers -----------------------------------------------------------------------------------------

    private JsonNode json(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }

    private Map<String, Object> transactionBody(String description, String amount, LocalDate day, Long categoryId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", description);
        body.put("startDate", day.toString());
        if (categoryId != null) {
            body.put("categoryId", categoryId);
        }
        return body;
    }

    private long createTransaction(
            Plan plan, User user, String description, String amount, LocalDate day, Long categoryId) throws Exception {
        return json(mockMvc.perform(post(TX, plan.getId())
                                .with(testAuthHelper.asUser(user))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                        transactionBody(description, amount, day, categoryId))))
                        .andExpect(status().isCreated()))
                .get("id")
                .asLong();
    }

    private long createTransactionWithItem(Plan plan, User user, Long categoryId, LocalDate day) throws Exception {
        Map<String, Object> body = transactionBody("With item", "40.00", day, categoryId);
        body.put(
                "items",
                List.of(Map.of(
                        "description",
                        "Item",
                        "amount",
                        new BigDecimal("10.00"),
                        "quantity",
                        1,
                        "categoryId",
                        categoryId)));
        return json(mockMvc.perform(post(TX, plan.getId())
                                .with(testAuthHelper.asUser(user))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                        .andExpect(status().isCreated()))
                .get("id")
                .asLong();
    }

    private Map<String, Object> installment(String description, String amount, LocalDate start, int parcels) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", description);
        body.put("mode", "INSTALLMENT");
        body.put("startDate", start.toString());
        body.put("parcelsNumber", parcels);
        body.put("splitMode", "EQUAL");
        return body;
    }

    private Map<String, Object> recurring(String description, String amount, LocalDate start, LocalDate end) {
        Map<String, Object> body = openEnded(description, amount, start);
        body.put("endDate", end.toString());
        return body;
    }

    private Map<String, Object> openEnded(String description, String amount, LocalDate start) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", description);
        body.put("mode", "RECURRING");
        body.put("startDate", start.toString());
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private JsonNode createSeries(Plan plan, User user, Map<String, Object> body) throws Exception {
        return json(mockMvc.perform(post(TX + "/series", plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated()));
    }

    /** The edit request nests the series under scope, pivot and version. */
    private JsonNode editSeries(Plan plan, User user, String seriesId, Map<String, Object> flat) throws Exception {
        Map<String, Object> series = new LinkedHashMap<>(flat);
        Map<String, Object> request = new LinkedHashMap<>();
        for (String outer : List.of("scope", "pivotOccurrenceId", "version")) {
            if (series.containsKey(outer)) {
                request.put(outer, series.remove(outer));
            }
        }
        request.put("series", series);
        return json(mockMvc.perform(put(TX + "/series/{seriesId}", plan.getId(), seriesId)
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()));
    }

    private long deleteTransaction(Plan plan, User user, long id) throws Exception {
        return json(mockMvc.perform(delete(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(user)))
                        .andExpect(status().isOk()))
                .get("deletionId")
                .asLong();
    }

    private long deleteSeries(Plan plan, User user, String seriesId, String scope, Long pivot) throws Exception {
        var request = delete(TX + "/series/{seriesId}", plan.getId(), seriesId)
                .param("scope", scope)
                .with(testAuthHelper.asUser(user));
        if (pivot != null) {
            request.param("pivotOccurrenceId", pivot.toString());
        }
        return json(mockMvc.perform(request).andExpect(status().isOk()))
                .get("deletionId")
                .asLong();
    }

    private ResultActions restore(Plan plan, User user, long deletionId) throws Exception {
        return mockMvc.perform(
                post(TX + "/trash/{id}/restore", plan.getId(), deletionId).with(testAuthHelper.asUser(user)));
    }

    private List<Long> listedIds(Plan plan, User user) throws Exception {
        JsonNode page =
                json(mockMvc.perform(get(TX, plan.getId()).param("size", "100").with(testAuthHelper.asUser(user)))
                        .andExpect(status().isOk()));
        List<Long> ids = new ArrayList<>();
        page.get("content").forEach(row -> ids.add(row.get("id").asLong()));
        return ids;
    }

    private JsonNode fetch(Plan plan, User user, long id) throws Exception {
        return json(mockMvc.perform(get(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk()));
    }

    private JsonNode definition(Plan plan, User user, String seriesId) throws Exception {
        return json(mockMvc.perform(
                        get(TX + "/series/{seriesId}", plan.getId(), seriesId).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk()));
    }

    private BigDecimal expenses(Plan plan, User user, LocalDate inMonth) throws Exception {
        JsonNode summary = json(mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .param("startDate", inMonth.withDayOfMonth(1).toString())
                        .param(
                                "endDate",
                                inMonth.withDayOfMonth(inMonth.lengthOfMonth()).toString())
                        .with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk()));
        return summary.get("totalExpenses").decimalValue();
    }

    private long rowsOf(String seriesId) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM transactions WHERE series_id = ?", Long.class, seriesId);
    }

    private BigDecimal findSpent(JsonNode trees, long categoryId) {
        for (JsonNode node : trees) {
            if (node.get("categoryId").asLong() == categoryId) {
                return node.get("spent").decimalValue();
            }
            BigDecimal inChildren = findSpent(node.get("children"), categoryId);
            if (inChildren != null) {
                return inChildren;
            }
        }
        return null;
    }

    private JsonNode importCsv(Plan plan, User user, String csv) throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "nubank.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));
        MvcResult result = mockMvc.perform(
                        multipart(TX + "/import", plan.getId()).file(file).with(testAuthHelper.asUser(user)))
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
