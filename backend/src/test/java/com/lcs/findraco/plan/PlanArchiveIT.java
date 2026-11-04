package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.ResultActions;

/** An owner lists the plans they archived and restores one. */
class PlanArchiveIT extends AbstractIntegrationTest {

    @Autowired
    private PlanRepository planRepository;

    private Plan archived(Plan plan, Instant at) {
        plan.setDeletedAt(at);
        return planRepository.save(plan);
    }

    private ResultActions list(User caller) throws Exception {
        return mockMvc.perform(get(ApiRoutes.PLAN + "/archived").with(testAuthHelper.asUser(caller)));
    }

    private ResultActions restore(Plan plan, User caller) throws Exception {
        return mockMvc.perform(
                post(ApiRoutes.PLAN + "/{id}/restore", plan.getId()).with(testAuthHelper.asUser(caller)));
    }

    // ---- list ----

    @Test
    void theListHoldsTheArchivedPlansTheCallerOwnsNewestFirstWithTheirDeletionDate() throws Exception {
        User owner = fixtures.aUser();
        Instant older = fixtures.now().minus(Duration.ofDays(10)).truncatedTo(ChronoUnit.MICROS);
        Instant newer = fixtures.now().minus(Duration.ofDays(2)).truncatedTo(ChronoUnit.MICROS);
        Plan olderPlan = archived(fixtures.aPlan(owner), older);
        Plan newerPlan = archived(fixtures.aPlan(owner), newer);
        fixtures.aPlan(owner);
        archived(fixtures.aPlan(fixtures.aUser()), newer);

        list(owner)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(newerPlan.getId()))
                .andExpect(jsonPath("$[0].name").value(newerPlan.getName()))
                .andExpect(jsonPath("$[0].archivedAt").value(newer.toString()))
                .andExpect(jsonPath("$[0].deletesAt")
                        .value(newer.plus(Duration.ofDays(30)).toString()))
                .andExpect(jsonPath("$[1].id").value(olderPlan.getId()))
                .andExpect(jsonPath("$[1].deletesAt")
                        .value(older.plus(Duration.ofDays(30)).toString()));
    }

    @Test
    void aMemberWhoIsNotAnOwnerOfAnArchivedPlanSeesAnEmptyList() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        archived(plan, fixtures.now());

        list(editor).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
    }

    // ---- restore ----

    @Test
    void restoringAnArchivedPlanBringsItBackForEveryMemberWithTheSameRole() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.aPlan(editor);
        archived(plan, fixtures.now().minus(Duration.ofDays(3)));

        restore(plan, owner)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(plan.getId()))
                .andExpect(jsonPath("$.name").value(plan.getName()))
                .andExpect(jsonPath("$.myRole").value("OWNER"));

        assertThat(planRepository.findById(plan.getId()).orElseThrow().getDeletedAt())
                .isNull();
        mockMvc.perform(get(ApiRoutes.PLAN).with(testAuthHelper.asUser(editor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + plan.getId() + ")].myRole").value("EDITOR"));
        mockMvc.perform(get(ApiRoutes.PLAN).with(testAuthHelper.asUser(owner)))
                .andExpect(jsonPath("$[?(@.id == " + plan.getId() + ")].myRole").value("OWNER"));
        list(owner).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void aMemberWhoIsNotTheOwnerCannotRestoreAndTheArchiveStays() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        archived(plan, fixtures.now().minus(Duration.ofDays(1)));

        restore(plan, editor).andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));

        assertThat(planRepository.findById(plan.getId()).orElseThrow().getDeletedAt())
                .isNotNull();
    }

    @Test
    void restoringAnActivePlanIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        restore(plan, owner).andExpect(problem(HttpStatus.CONFLICT, "plan-not-archived"));
    }

    @Test
    void restoringAnUnknownPlanAnswersNotFound() throws Exception {
        User owner = fixtures.aUser();

        mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/restore", 999_999L).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));
    }
}
