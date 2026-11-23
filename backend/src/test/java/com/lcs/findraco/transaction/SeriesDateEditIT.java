package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
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
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Changing the date of a series' occurrence: one occurrence alone, the day from an occurrence on, and from the
 * first occurrence the month. The monthly series are 16/03 to 16/06/2026 (March is index 0, April 1, May 2, June
 * 3) and every occurrence is unconfirmed unless a test confirms it.
 */
class SeriesDateEditIT extends AbstractIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;
    private static final LocalDate MARCH_16 = LocalDate.of(2026, 3, 16);
    private static final int MARCH = 0;
    private static final int APRIL = 1;
    private static final int MAY = 2;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private OpenEndedSeriesTopUpService topUpService;

    @Test
    void onlyThisMovesOneOccurrence() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode within = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String withinId = within.get("seriesId").asString();
        edit(plan, owner, withinId, "THIS_ONE", occurrenceId(within, APRIL), LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.occurrences[0].startDate").value("2026-04-20"));

        assertThat(dates(withinId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 20),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16));
        assertThat(slots(withinId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 16),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16));

        JsonNode across = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String acrossId = across.get("seriesId").asString();
        edit(plan, owner, acrossId, "THIS_ONE", occurrenceId(across, APRIL), LocalDate.of(2026, 5, 2), gymBody())
                .andExpect(status().isOk());

        assertThat(dates(acrossId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 5, 2),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16));
        // April's slot stays in April, so a later edit of the series still finds it there.
        assertThat(slots(acrossId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 16),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16));
        assertThat(definition(acrossId)).containsEntry("day_of_month", 16);
    }

    @Test
    void movedAloneKeepsDateOnAllEdit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        long april = occurrenceId(series, APRIL);
        edit(plan, owner, seriesId, "THIS_ONE", april, LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(status().isOk());

        Map<String, Object> body = gymBody();
        body.put("amount", new BigDecimal("95.00"));
        edit(plan, owner, seriesId, "ALL", april, null, body).andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 20),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16));
        assertThat(amounts(seriesId)).containsOnly("95.00").hasSize(4);
    }

    @Test
    void dayChangeMovesPivotAndFollowing() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode fromApril = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String aprilSeries = fromApril.get("seriesId").asString();
        edit(
                        plan,
                        owner,
                        aprilSeries,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(fromApril, APRIL),
                        LocalDate.of(2026, 4, 18),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(aprilSeries))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 18),
                        LocalDate.of(2026, 6, 18));
        assertThat(slots(aprilSeries)).isEqualTo(dates(aprilSeries));
        assertThat(definition(aprilSeries))
                .containsEntry("day_of_month", 18)
                .containsEntry("start_date", Date.valueOf("2026-03-16"))
                .containsEntry("end_date", Date.valueOf("2026-06-18"));

        JsonNode fromMarch = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String marchSeries = fromMarch.get("seriesId").asString();
        edit(
                        plan,
                        owner,
                        marchSeries,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(fromMarch, MARCH),
                        LocalDate.of(2026, 3, 18),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(marchSeries))
                .containsExactly(
                        LocalDate.of(2026, 3, 18),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 18),
                        LocalDate.of(2026, 6, 18));
        assertThat(definition(marchSeries))
                .containsEntry("start_date", Date.valueOf("2026-03-18"))
                .containsEntry("end_date", Date.valueOf("2026-06-18"));
    }

    @Test
    void confirmedKeepsDateOnDayChange() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        confirm(plan, owner, occurrenceId(series, MAY), LocalDate.of(2026, 5, 16));

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, APRIL),
                        LocalDate.of(2026, 4, 18),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 18));
        assertThat(slots(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 18));
    }

    @Test
    void movedAloneMovesWithFollowing() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        edit(plan, owner, seriesId, "THIS_ONE", occurrenceId(series, APRIL), LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(status().isOk());

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 3, 18),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 3, 18),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 18),
                        LocalDate.of(2026, 6, 18));
    }

    @Test
    void dayThirtyOneFallsOnMonthEnd() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode fromJanuary = createSeries(plan, owner, gym(LocalDate.of(2026, 1, 16), LocalDate.of(2026, 4, 16)));
        String januarySeries = fromJanuary.get("seriesId").asString();
        Map<String, Object> januaryBody = gymBody();
        januaryBody.put("startDate", "2026-01-16");
        januaryBody.put("endDate", "2026-04-16");
        edit(
                        plan,
                        owner,
                        januarySeries,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(fromJanuary, 0),
                        LocalDate.of(2026, 1, 31),
                        januaryBody)
                .andExpect(status().isOk());

        assertThat(dates(januarySeries))
                .containsExactly(
                        LocalDate.of(2026, 1, 31),
                        LocalDate.of(2026, 2, 28),
                        LocalDate.of(2026, 3, 31),
                        LocalDate.of(2026, 4, 30));

        // February has no 31st, so a member cannot pick day 31 there: the day is picked in March, the next month
        // that has it, and the months after keep it.
        JsonNode fromFebruary = createSeries(plan, owner, gym(LocalDate.of(2026, 2, 16), LocalDate.of(2026, 4, 16)));
        String februarySeries = fromFebruary.get("seriesId").asString();
        Map<String, Object> februaryBody = gymBody();
        februaryBody.put("startDate", "2026-02-16");
        februaryBody.put("endDate", "2026-04-16");
        edit(
                        plan,
                        owner,
                        februarySeries,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(fromFebruary, 1),
                        LocalDate.of(2026, 3, 31),
                        februaryBody)
                .andExpect(status().isOk());

        assertThat(dates(februarySeries))
                .containsExactly(LocalDate.of(2026, 2, 16), LocalDate.of(2026, 3, 31), LocalDate.of(2026, 4, 30));
    }

    @Test
    void deletedMonthStaysEmptyOnDayChange() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        deleteOne(plan, owner, seriesId, occurrenceId(series, APRIL));

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 3, 18),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(LocalDate.of(2026, 3, 18), LocalDate.of(2026, 5, 18), LocalDate.of(2026, 6, 18));

        // The form sends the series as it is now, whose end took the new day.
        Map<String, Object> body = gymBody();
        body.put("amount", new BigDecimal("95.00"));
        body.put("endDate", "2026-06-18");
        edit(plan, owner, seriesId, "ALL", null, null, body).andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(LocalDate.of(2026, 3, 18), LocalDate.of(2026, 5, 18), LocalDate.of(2026, 6, 18));
        assertThat(amounts(seriesId)).containsOnly("95.00").hasSize(3);
    }

    @Test
    void topUpUsesChangedDay() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate start = LocalDate.of(2026, 10, 16);
        JsonNode series = createSeries(plan, owner, gym(start, null));
        String seriesId = series.get("seriesId").asString();
        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, 0),
                        LocalDate.of(2026, 10, 31),
                        gym(start, null))
                .andExpect(status().isOk());
        List<LocalDate> beforeTopUp = dates(seriesId);

        topUpService.topUp(plan.getId(), today().plusMonths(14));

        List<LocalDate> afterTopUp = dates(seriesId);
        assertThat(afterTopUp.size()).isGreaterThan(beforeTopUp.size());
        assertThat(afterTopUp)
                .allSatisfy(date -> assertThat(date)
                        .isEqualTo(YearMonth.from(date)
                                .atDay(Math.min(31, YearMonth.from(date).lengthOfMonth()))));
        // The months the top-up added reach a short month and a long one, so both the clamp and the day show.
        List<LocalDate> added = afterTopUp.subList(beforeTopUp.size(), afterTopUp.size());
        assertThat(added)
                .anyMatch(date -> date.getMonthValue() == 2 && date.getDayOfMonth() >= 28)
                .anyMatch(date -> date.getMonthValue() == 4 && date.getDayOfMonth() == 30)
                .anyMatch(date -> date.getDayOfMonth() == 31);
        assertThat(slots(seriesId)).doesNotHaveDuplicates().isEqualTo(afterTopUp);
    }

    @Test
    void restoreBeforeDateChangeConflicts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        long deletion = deleteOne(plan, owner, seriesId, occurrenceId(series, APRIL));

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 3, 18),
                        gymBody())
                .andExpect(status().isOk());

        mockMvc.perform(post(TX + "/trash/{id}/restore", plan.getId(), deletion).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.CONFLICT, "trash-series-changed"));
        assertThat(dates(seriesId))
                .containsExactly(LocalDate.of(2026, 3, 18), LocalDate.of(2026, 5, 18), LocalDate.of(2026, 6, 18));
    }

    @Test
    void firstOccurrenceShiftsRecurringMonth() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 4, 16),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 4, 16),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16),
                        LocalDate.of(2026, 7, 16));
        assertThat(slots(seriesId)).isEqualTo(dates(seriesId));
        assertThat(definition(seriesId))
                .containsEntry("start_date", Date.valueOf("2026-04-16"))
                .containsEntry("end_date", Date.valueOf("2026-07-16"));
    }

    @Test
    void firstOccurrenceShiftsInstallmentMonth() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, laptop(LocalDate.of(2026, 12, 16)));
        String seriesId = series.get("seriesId").asString();

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, 0),
                        LocalDate.of(2027, 1, 5),
                        laptop(LocalDate.of(2026, 12, 16)))
                .andExpect(status().isOk());

        List<LocalDate> expected = new ArrayList<>();
        for (int month = 0; month < 10; month++) {
            expected.add(LocalDate.of(2027, 1, 5).plusMonths(month));
        }
        assertThat(dates(seriesId)).isEqualTo(expected);
        assertThat(slots(seriesId)).isEqualTo(expected);
        assertThat(jdbc.queryForList(
                        "SELECT description FROM transactions WHERE series_id = ? ORDER BY scheduled_date",
                        String.class,
                        seriesId))
                .containsExactly(
                        "Laptop (1/10)",
                        "Laptop (2/10)",
                        "Laptop (3/10)",
                        "Laptop (4/10)",
                        "Laptop (5/10)",
                        "Laptop (6/10)",
                        "Laptop (7/10)",
                        "Laptop (8/10)",
                        "Laptop (9/10)",
                        "Laptop (10/10)");
    }

    @Test
    void monthShiftMovesDeletedMonth() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        deleteOne(plan, owner, seriesId, occurrenceId(series, APRIL));

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 4, 16),
                        gymBody())
                .andExpect(status().isOk());

        assertThat(dates(seriesId))
                .containsExactly(LocalDate.of(2026, 4, 16), LocalDate.of(2026, 6, 16), LocalDate.of(2026, 7, 16));
    }

    @Test
    void invalidDateChangeIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        long april = occurrenceId(series, APRIL);
        List<LocalDate> datesBefore = dates(seriesId);
        long versionBefore = fixtures.seriesVersion(seriesId);

        edit(plan, owner, seriesId, "THIS_AND_FOLLOWING", april, LocalDate.of(2026, 5, 18), gymBody())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "series-date-change-invalid"));
        edit(plan, owner, seriesId, "ALL", april, LocalDate.of(2026, 4, 18), gymBody())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "series-date-change-invalid"));

        assertThat(dates(seriesId)).isEqualTo(datesBefore);
        assertThat(slots(seriesId)).isEqualTo(datesBefore);
        assertThat(fixtures.seriesVersion(seriesId)).isEqualTo(versionBefore);

        edit(plan, owner, seriesId, "THIS_AND_FOLLOWING", april, LocalDate.of(2026, 4, 18), gymBody())
                .andExpect(status().isOk());
        assertThat(dates(seriesId))
                .containsExactly(
                        LocalDate.of(2026, 3, 16),
                        LocalDate.of(2026, 4, 18),
                        LocalDate.of(2026, 5, 18),
                        LocalDate.of(2026, 6, 18));

        edit(plan, owner, seriesId, "ALL", null, null, gymBody()).andExpect(status().isOk());
    }

    @Test
    void monthCollisionIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        confirm(plan, owner, occurrenceId(series, APRIL), LocalDate.of(2026, 4, 16));
        List<LocalDate> datesBefore = dates(seriesId);
        long versionBefore = fixtures.seriesVersion(seriesId);

        edit(
                        plan,
                        owner,
                        seriesId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(series, MARCH),
                        LocalDate.of(2026, 4, 16),
                        gymBody())
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "series-month-collision"));

        assertThat(dates(seriesId)).isEqualTo(datesBefore);
        assertThat(slots(seriesId)).isEqualTo(datesBefore);
        assertThat(fixtures.seriesVersion(seriesId)).isEqualTo(versionBefore);

        JsonNode unconfirmed = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String unconfirmedId = unconfirmed.get("seriesId").asString();
        edit(
                        plan,
                        owner,
                        unconfirmedId,
                        "THIS_AND_FOLLOWING",
                        occurrenceId(unconfirmed, MARCH),
                        LocalDate.of(2026, 4, 16),
                        gymBody())
                .andExpect(status().isOk());
        assertThat(dates(unconfirmedId))
                .containsExactly(
                        LocalDate.of(2026, 4, 16),
                        LocalDate.of(2026, 5, 16),
                        LocalDate.of(2026, 6, 16),
                        LocalDate.of(2026, 7, 16));
    }

    @Test
    void dateChangeNeedsRightsOverEveryOccurrenceInScope() throws Exception {
        User owner = fixtures.aUser();
        User contributor = fixtures.aUser();
        User viewer = fixtures.aUser();
        User outsider = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        JsonNode series = createSeries(plan, owner, gym(MARCH_16, LocalDate.of(2026, 6, 16)));
        String seriesId = series.get("seriesId").asString();
        long april = occurrenceId(series, APRIL);
        List<LocalDate> datesBefore = dates(seriesId);
        long versionBefore = fixtures.seriesVersion(seriesId);

        edit(plan, contributor, seriesId, "THIS_AND_FOLLOWING", april, LocalDate.of(2026, 4, 18), gymBody())
                .andExpect(problem(HttpStatus.FORBIDDEN, "not-transaction-creator"));
        edit(plan, contributor, seriesId, "THIS_ONE", april, LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(problem(HttpStatus.FORBIDDEN, "not-transaction-creator"));
        edit(plan, viewer, seriesId, "THIS_ONE", april, LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
        edit(plan, outsider, seriesId, "THIS_ONE", april, LocalDate.of(2026, 4, 20), gymBody())
                .andExpect(status().isNotFound());

        assertThat(dates(seriesId)).isEqualTo(datesBefore);
        assertThat(slots(seriesId)).isEqualTo(datesBefore);
        assertThat(fixtures.seriesVersion(seriesId)).isEqualTo(versionBefore);
    }

    // --- helpers -----------------------------------------------------------------------------------------

    private Map<String, Object> gym(LocalDate start, LocalDate end) {
        Map<String, Object> body = gymBody();
        body.put("startDate", start.toString());
        if (end != null) {
            body.put("endDate", end.toString());
        } else {
            body.remove("endDate");
        }
        return body;
    }

    /** The series as the form sends it on an edit: the monthly gym from 16/03 to 16/06/2026. */
    private Map<String, Object> gymBody() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("80.00"));
        body.put("description", "Gym");
        body.put("mode", "RECURRING");
        body.put("startDate", MARCH_16.toString());
        body.put("endDate", "2026-06-16");
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private Map<String, Object> laptop(LocalDate start) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("300.00"));
        body.put("description", "Laptop");
        body.put("mode", "INSTALLMENT");
        body.put("startDate", start.toString());
        body.put("parcelsNumber", 10);
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

    private ResultActions edit(
            Plan plan,
            User user,
            String seriesId,
            String scope,
            Long pivotId,
            LocalDate pivotDate,
            Map<String, Object> series)
            throws Exception {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("scope", scope);
        if (pivotId != null) {
            request.put("pivotOccurrenceId", pivotId);
        }
        if (pivotDate != null) {
            request.put("pivotDate", pivotDate.toString());
        }
        request.put("version", fixtures.seriesVersion(seriesId));
        request.put("series", series);
        return mockMvc.perform(put(TX + "/series/{seriesId}", plan.getId(), seriesId)
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    private void confirm(Plan plan, User user, long id, LocalDate date) throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("amount", new BigDecimal("80.00"));
        body.put("startDate", date.toString());
        body.put("version", fixtures.transactionVersion(id));
        mockMvc.perform(post(TX + "/{id}/confirm", plan.getId(), id)
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }

    private long deleteOne(Plan plan, User user, String seriesId, long pivot) throws Exception {
        return json(mockMvc.perform(delete(TX + "/series/{seriesId}", plan.getId(), seriesId)
                                .param("scope", "THIS_ONE")
                                .param("pivotOccurrenceId", Long.toString(pivot))
                                .with(testAuthHelper.asUser(user)))
                        .andExpect(status().isOk()))
                .get("deletionId")
                .asLong();
    }

    private JsonNode json(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }

    private static long occurrenceId(JsonNode series, int index) {
        return series.get("occurrences").get(index).get("id").asLong();
    }

    private List<LocalDate> dates(String seriesId) {
        return jdbc.queryForList(
                "SELECT start_date FROM transactions WHERE series_id = ? AND deletion_id IS NULL ORDER BY scheduled_date",
                LocalDate.class,
                seriesId);
    }

    private List<LocalDate> slots(String seriesId) {
        return jdbc.queryForList(
                "SELECT scheduled_date FROM transactions WHERE series_id = ? AND deletion_id IS NULL ORDER BY scheduled_date",
                LocalDate.class,
                seriesId);
    }

    private List<String> amounts(String seriesId) {
        return jdbc.queryForList(
                "SELECT amount::text FROM transactions WHERE series_id = ? AND deletion_id IS NULL ORDER BY scheduled_date",
                String.class,
                seriesId);
    }

    private Map<String, Object> definition(String seriesId) {
        return jdbc.queryForMap(
                "SELECT day_of_month, start_date, end_date FROM recurrence_definitions WHERE series_id = ?", seriesId);
    }
}
