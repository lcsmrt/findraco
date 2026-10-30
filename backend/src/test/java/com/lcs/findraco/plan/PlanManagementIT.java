package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

/** Plan management endpoints: delete, leave, transfer, role change, and the invitation list and preview. */
class PlanManagementIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PlanMembershipRepository membershipRepository;

    // ---- delete ----

    @Test
    void theOwnerDeletesAPlanAndItAnswersNotFoundAfterwards() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.aPlan(owner);

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(ApiRoutes.PLAN + "/{id}", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));
    }

    @Test
    void deletingTheLastPlanIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.CONFLICT, "last-plan"));
    }

    @Test
    void aMemberWhoIsNotTheOwnerCannotDeleteThePlan() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.aPlan(editor);

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}", plan.getId()).with(testAuthHelper.asUser(editor)))
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
    }

    // ---- leave ----

    @Test
    void theOwnerCannotLeaveTheirPlan() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.aPlan(owner);

        mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/leave", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.CONFLICT, "last-owner"));
    }

    @Test
    void aNonMemberLeavingAPlanAnswersNotFound() throws Exception {
        Plan plan = fixtures.aPlan(fixtures.aUser());

        mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/leave", plan.getId())
                        .with(testAuthHelper.asUser(fixtures.aUser())))
                .andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));
    }

    // ---- transfer ----

    @Test
    void transferringOwnershipDemotesThePreviousOwnerToTheChosenRole() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);

        transfer(plan, owner, editor.getId(), "VIEWER").andExpect(status().isNoContent());

        assertThat(roleOf(plan, editor)).isEqualTo(PlanRole.OWNER);
        assertThat(roleOf(plan, owner)).isEqualTo(PlanRole.VIEWER);
    }

    @Test
    void transferringWithoutAChosenRoleMakesThePreviousOwnerAnEditor() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);

        transfer(plan, owner, viewer.getId(), null).andExpect(status().isNoContent());

        assertThat(roleOf(plan, owner)).isEqualTo(PlanRole.EDITOR);
    }

    @Test
    void transferringToYourselfIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        transfer(plan, owner, owner.getId(), null)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "ownership-transfer-to-self"));
    }

    @Test
    void transferringToSomeoneWhoIsNotAMemberIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        transfer(plan, owner, fixtures.aUser().getId(), null)
                .andExpect(problem(HttpStatus.NOT_FOUND, "member-not-found"));
    }

    @Test
    void onlyTheOwnerTransfersOwnership() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);

        transfer(plan, editor, owner.getId(), null).andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));

        assertThat(roleOf(plan, owner)).isEqualTo(PlanRole.OWNER);
    }

    // ---- role change ----

    @Test
    void theOwnerChangesAMembersRole() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.VIEWER);

        changeRole(plan, owner, member.getId(), "EDITOR")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("EDITOR"));

        assertThat(roleOf(plan, member)).isEqualTo(PlanRole.EDITOR);
    }

    @Test
    void makingAnotherMemberOwnerNeedsATransfer() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);

        changeRole(plan, owner, member.getId(), "OWNER")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "owner-role-needs-transfer"));
    }

    @Test
    void demotingTheLastOwnerIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        changeRole(plan, owner, owner.getId(), "EDITOR").andExpect(problem(HttpStatus.CONFLICT, "last-owner"));

        assertThat(roleOf(plan, owner)).isEqualTo(PlanRole.OWNER);
    }

    @Test
    void changingTheRoleOfSomeoneWhoIsNotAMemberIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        changeRole(plan, owner, fixtures.aUser().getId(), "EDITOR")
                .andExpect(problem(HttpStatus.NOT_FOUND, "member-not-found"));
    }

    @Test
    void onlyTheOwnerChangesRoles() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);

        changeRole(plan, editor, editor.getId(), "OWNER")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "owner-role-needs-transfer"));
        changeRole(plan, editor, owner.getId(), "VIEWER").andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));

        assertThat(roleOf(plan, owner)).isEqualTo(PlanRole.OWNER);
    }

    // ---- invitation list ----

    @Test
    void theOwnerListsThePlansInvitations() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        createInvitation(plan, owner, "LINK", null);
        createInvitation(plan, owner, "EMAIL", "friend@example.com");

        mockMvc.perform(get(PlanRoutes.PLAN_INVITATION, plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void aMemberWhoIsNotTheOwnerCannotListInvitations() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);

        mockMvc.perform(get(PlanRoutes.PLAN_INVITATION, plan.getId()).with(testAuthHelper.asUser(editor)))
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
    }

    // ---- invitation preview ----

    @Test
    void previewingAValidInvitationNeedsNoSignIn() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String token = createInvitation(plan, owner, "LINK", null);

        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planName").value(plan.getName()))
                .andExpect(jsonPath("$.role").value("EDITOR"));
    }

    @Test
    void previewingAnUnknownTokenAnswersNotFound() throws Exception {
        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", "no-such-token"))
                .andExpect(problem(HttpStatus.NOT_FOUND, "invitation-not-found"));
    }

    @Test
    void previewingARevokedInvitationAnswersConflict() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        MvcResult created = createInvitationResult(plan, owner, "LINK", null);
        String token = objectMapper
                .readTree(created.getResponse().getContentAsString())
                .get("token")
                .asString();
        long id = objectMapper
                .readTree(created.getResponse().getContentAsString())
                .get("id")
                .asLong();
        mockMvc.perform(delete(PlanRoutes.PLAN_INVITATION + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", token))
                .andExpect(problem(HttpStatus.CONFLICT, "invitation-revoked"));
    }

    @Test
    void previewingAnExpiredInvitationAnswersConflict() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Map<String, Object> body = new HashMap<>();
        body.put("role", "EDITOR");
        body.put("type", "LINK");
        body.put("expiresAt", fixtures.now().minus(Duration.ofDays(1)).toString());
        MvcResult created = mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
        String token = objectMapper
                .readTree(created.getResponse().getContentAsString())
                .get("token")
                .asString();

        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", token))
                .andExpect(problem(HttpStatus.CONFLICT, "invitation-expired"));
    }

    // ---- helpers ----

    private PlanRole roleOf(Plan plan, User user) {
        return membershipRepository.findByPlanAndUser(plan, user).orElseThrow().getRole();
    }

    private ResultActions transfer(Plan plan, User actor, Long newOwnerId, String previousOwnerRole) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("newOwnerUserId", newOwnerId);
        if (previousOwnerRole != null) {
            body.put("previousOwnerRole", previousOwnerRole);
        }
        return mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/transfer", plan.getId())
                .with(testAuthHelper.asUser(actor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions changeRole(Plan plan, User actor, Long targetId, String role) throws Exception {
        return mockMvc.perform(put(ApiRoutes.PLAN + "/{id}/members/{userId}", plan.getId(), targetId)
                .with(testAuthHelper.asUser(actor))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", role))));
    }

    private String createInvitation(Plan plan, User owner, String type, String email) throws Exception {
        MvcResult result = createInvitationResult(plan, owner, type, email);
        return objectMapper
                .readTree(result.getResponse().getContentAsString())
                .get("token")
                .asString();
    }

    private MvcResult createInvitationResult(Plan plan, User owner, String type, String email) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("role", "EDITOR");
        body.put("type", type);
        if (email != null) {
            body.put("email", email);
        }
        return mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
    }
}
