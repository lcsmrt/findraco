package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Drives {@link com.lcs.findraco.plan.controller.PlanInvitationController} end-to-end through the
 * real API (create -> accept -> revoke) to pin down the actual lifecycle semantics of
 * {@link com.lcs.findraco.plan.service.PlanInvitationService}, which differ by
 * {@code InvitationType}:
 *
 * <ul>
 *   <li>LINK invites never flip to ACCEPTED (they stay PENDING/reusable), so a second accept
 *       by an already-a-member user is genuinely idempotent: 200 OK, no duplicate membership.
 *   <li>EMAIL invites are single-use: the first accept flips status to ACCEPTED, so a second
 *       accept attempt on the same token is rejected up-front by the token-loading guard with
 *       410 GONE ("This invitation has already been used") rather than silently
 *       succeeding. This is a real behavioral asymmetry in the codebase, not a test artifact.
 *   <li>Expiry (LINK-only; EMAIL invites never carry an expiresAt) is enforced lazily against
 *       {@code expiresAt} and mapped by {@link com.lcs.findraco.shared.error.GlobalExceptionHandler}
 *       to 410 GONE, matching the task's assumption.
 *   <li>Revoke is mapped to 410 GONE via {@code InvitationRevokedException} ("This
 *       invitation has been revoked."): a consumed/withdrawn invitation is gone, alongside
 *       expired and already-used.
 * </ul>
 */
class InvitationLifecycleIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PlanMembershipRepository planMembershipRepository;

    @Autowired
    private PlanRepository planRepository;

    @Test
    void acceptingALinkInvitationTwiceIsIdempotentAndDoesNotDuplicateMembership() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser();

        String token = createInvitation(plan, owner, PlanRole.EDITOR, "LINK", null, null);

        MvcResult first =
                acceptAs(token, invitee).andExpect(status().isCreated()).andReturn();
        JsonNode firstBody = objectMapper.readTree(first.getResponse().getContentAsString());
        assertThat(firstBody.get("planId").asLong()).isEqualTo(plan.getId());
        assertThat(firstBody.get("role").asString()).isEqualTo("EDITOR");
        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(2);

        MvcResult second = acceptAs(token, invitee).andExpect(status().isOk()).andReturn();
        JsonNode secondBody = objectMapper.readTree(second.getResponse().getContentAsString());
        assertThat(secondBody.get("planId").asLong()).isEqualTo(plan.getId());
        assertThat(secondBody.get("role").asString()).isEqualTo("EDITOR");

        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(2);
    }

    @Test
    void acceptingAnEmailInvitationTwiceRejectsTheSecondAttemptAsAlreadyUsed() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser();

        String token = createInvitation(plan, owner, PlanRole.VIEWER, "EMAIL", invitee.getEmail(), null);

        acceptAs(token, invitee).andExpect(status().isCreated());
        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(2);

        acceptAs(token, invitee).andExpect(problem(HttpStatus.CONFLICT, "invitation-used"));

        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(2);
    }

    @Test
    void anEmailInvitationMatchesTheInviteeWhateverTheCase() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser("guest-" + System.nanoTime() + "@case.com");

        String token = createInvitation(
                plan, owner, PlanRole.VIEWER, "EMAIL", invitee.getEmail().toUpperCase(java.util.Locale.ROOT), null);

        acceptAs(token, invitee).andExpect(status().isCreated());
    }

    @Test
    void anOwnerRoleInvitationIsRefusedAsANarrowedEnum() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"OWNER\",\"type\":\"LINK\"}"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("role"))
                .andExpect(jsonPath("$.errors[0].code").value("NarrowedEnum"));
    }

    @Test
    void acceptingAnExpiredLinkInvitationIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser();

        String token = createInvitation(
                plan, owner, PlanRole.CONTRIBUTOR, "LINK", null, fixtures.now().minus(Duration.ofDays(1)));

        acceptAs(token, invitee).andExpect(problem(HttpStatus.CONFLICT, "invitation-expired"));

        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(1);
    }

    @Test
    void acceptingARevokedInvitationIsRejectedWith409() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser();

        MvcResult created = mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invitationBody(PlanRole.EDITOR, "LINK", null, null))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode createdBody = objectMapper.readTree(created.getResponse().getContentAsString());
        String token = createdBody.get("token").asString();
        long invitationId = createdBody.get("id").asLong();

        mockMvc.perform(delete(PlanRoutes.PLAN_INVITATION + "/{invitationId}", plan.getId(), invitationId)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        acceptAs(token, invitee).andExpect(problem(HttpStatus.CONFLICT, "invitation-revoked"));

        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(1);
    }

    @Test
    void anEmailInvitationWithoutAnEmailAddressIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invitationBody(PlanRole.EDITOR, "EMAIL", null, null))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "invitation-email-required"));
    }

    @Test
    void previewAndAcceptOfADeletedPlansInvitationAnswerNotFound() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User invitee = fixtures.aUser();
        String token = createInvitation(plan, owner, PlanRole.EDITOR, "LINK", null, null);
        plan.setDeletedAt(fixtures.now());
        planRepository.save(plan);

        mockMvc.perform(get(PlanRoutes.INVITATION + "/{token}", token).with(testAuthHelper.asUser(invitee)))
                .andExpect(problem(HttpStatus.NOT_FOUND, "invitation-not-found"));
        acceptAs(token, invitee).andExpect(problem(HttpStatus.NOT_FOUND, "invitation-not-found"));

        assertThat(planMembershipRepository.findAllByPlan(plan)).hasSize(1);
    }

    private String createInvitation(Plan plan, User owner, PlanRole role, String type, String email, Instant expiresAt)
            throws Exception {
        MvcResult result = mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invitationBody(role, type, email, expiresAt))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("token").asString();
    }

    private Map<String, Object> invitationBody(PlanRole role, String type, String email, Instant expiresAt) {
        java.util.HashMap<String, Object> body = new java.util.HashMap<>();
        body.put("role", role.name());
        body.put("type", type);
        if (email != null) {
            body.put("email", email);
        }
        if (expiresAt != null) {
            body.put("expiresAt", expiresAt.toString());
        }
        return body;
    }

    private org.springframework.test.web.servlet.ResultActions acceptAs(String token, User actor) throws Exception {
        return mockMvc.perform(
                post(PlanRoutes.INVITATION + "/{token}/accept", token).with(testAuthHelper.asUser(actor)));
    }
}
