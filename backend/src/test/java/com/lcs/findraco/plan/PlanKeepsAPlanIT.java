package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

/** Losing a membership never leaves a user without a plan: a personal plan is provisioned, or the leave is refused. */
class PlanKeepsAPlanIT extends AbstractIntegrationTest {

    @Autowired
    private PlanMembershipRepository membershipRepository;

    @Test
    void removingAMemberWhoseOnlyPlanItWasGivesThemAPersonalPlan() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}/members/{userId}", plan.getId(), member.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        assertThatHasOnlyAPersonalPlan(member, plan);
    }

    @Test
    void deletingAPlanGivesEachMemberLeftWithoutOneAPersonalPlan() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.VIEWER);
        User memberWithAnotherPlan = fixtures.aUser();
        fixtures.addMember(plan, memberWithAnotherPlan, PlanRole.EDITOR);
        fixtures.aPlan(memberWithAnotherPlan);

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        assertThatHasOnlyAPersonalPlan(member, plan);
        assertThat(membershipRepository.findAllByUserId(memberWithAnotherPlan.getId()))
                .hasSize(1)
                .noneMatch(membership -> membership.getPlan().isDefault());
    }

    @Test
    void leavingTheLastPlanIsRefusedAndLeavingOneOfSeveralKeepsTheOthers() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);

        mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/leave", plan.getId()).with(testAuthHelper.asUser(member)))
                .andExpect(problem(HttpStatus.CONFLICT, "last-plan"));
        assertThat(membershipRepository.findAllByUserId(member.getId())).hasSize(1);

        Plan second = fixtures.aPlan(owner);
        fixtures.addMember(second, member, PlanRole.EDITOR);
        mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/leave", second.getId()).with(testAuthHelper.asUser(member)))
                .andExpect(status().isNoContent());

        List<PlanMembership> left = membershipRepository.findAllByUserId(member.getId());
        assertThat(left).hasSize(1);
        assertThat(left.getFirst().getPlan().getId()).isEqualTo(plan.getId());
    }

    private void assertThatHasOnlyAPersonalPlan(User user, Plan formerPlan) {
        List<PlanMembership> memberships = membershipRepository.findAllByUserId(user.getId());
        assertThat(memberships).hasSize(1);
        PlanMembership personal = memberships.getFirst();
        assertThat(personal.getPlan().getId()).isNotEqualTo(formerPlan.getId());
        assertThat(personal.getPlan().isDefault()).isTrue();
        assertThat(personal.getRole()).isEqualTo(PlanRole.OWNER);
    }
}
