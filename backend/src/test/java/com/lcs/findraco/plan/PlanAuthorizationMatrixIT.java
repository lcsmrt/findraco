package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.controller.PlanContextArgumentResolver;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Drives the real security filter chain + {@link PlanContextArgumentResolver} +
 * {@link PlanAuthorization} end-to-end (real JWTs via {@code testAuthHelper.asUser}, no
 * {@code @WithMockUser} — see design TD-6) across the full role matrix: OWNER / EDITOR /
 * CONTRIBUTOR / VIEWER / non-member, for the five representative actions read, create,
 * edit-own, edit-others and manage-plan. Per AD-004: everyone on a plan can read everything,
 * a CONTRIBUTOR may only edit their own rows, only the OWNER manages the plan, and a
 * non-member must see 404 (not 403) so plan existence never leaks. The permission flags in the plan and
 * transaction responses agree with the endpoints: false if and only if the call is refused.
 */
class PlanAuthorizationMatrixIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    private final LocalDate today = LocalDate.now();

    private record PlanCast(Plan plan, User owner, User editor, User contributor, User viewer, User nonMember) {}

    private PlanCast castPlan() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        User contributor = fixtures.aUser();
        User viewer = fixtures.aUser();
        User nonMember = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        return new PlanCast(plan, owner, editor, contributor, viewer, nonMember);
    }

    @Test
    void readAllowedForEveryRoleRegardlessOfRowOwnership() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("50.00"), TransactionType.DEBIT);

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor(), cast.viewer())) {
            mockMvc.perform(get(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    tx.getId())
                            .with(testAuthHelper.asUser(member)))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void readDeniedForNonMemberAsNotFoundNotForbidden() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("50.00"), TransactionType.DEBIT);

        mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), tx.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
    }

    @Test
    void createAllowedForOwnerEditorAndContributor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor())) {
            mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionBody("30.00", "Groceries")))
                    .andExpect(status().isCreated());
        }
    }

    @Test
    void createDeniedForViewerAndLeavesNoPartialRow() throws Exception {
        PlanCast cast = castPlan();
        long countBefore = transactionRepository.count();

        mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionBody("30.00", "Groceries")))
                .andExpect(status().isForbidden());

        assertThat(transactionRepository.count()).isEqualTo(countBefore);
    }

    @Test
    void createDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionBody("30.00", "Groceries")))
                .andExpect(status().isNotFound());
    }

    @Test
    void editOwnAllowedForOwnerEditorAndContributor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor())) {
            Transaction own =
                    fixtures.aTransaction(cast.plan(), member, new BigDecimal("40.00"), TransactionType.DEBIT);

            mockMvc.perform(put(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    own.getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionEditBody("41.00", "Updated by owner of the row")))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void editOwnDeniedForViewerEvenOnTheirOwnRow() throws Exception {
        // A VIEWER never legitimately creates a row, but PlanAuthorization#requireCanModifyTransaction
        // checks the role gate before row-ownership, so even a row a viewer happens to own is denied.
        PlanCast cast = castPlan();
        Transaction ownedByViewer =
                fixtures.aTransaction(cast.plan(), cast.viewer(), new BigDecimal("40.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByViewer.getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByViewer.getId(), "40.00");
    }

    @Test
    void editOthersAllowedForOwnerAndEditor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor())) {
            Transaction ownedByContributor = fixtures.aTransaction(
                    cast.plan(), cast.contributor(), new BigDecimal("60.00"), TransactionType.DEBIT);

            mockMvc.perform(put(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    ownedByContributor.getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionEditBody("61.00", "Edited by non-owner-of-the-row")))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void editOthersDeniedForContributorAndFailsClosedWithNoPartialWrite() throws Exception {
        PlanCast cast = castPlan();
        Transaction ownedByOwner =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                        .with(testAuthHelper.asUser(cast.contributor()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByOwner.getId(), "70.00");

        MvcResult getResult = mockMvc.perform(
                        get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                                .with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode persisted = objectMapper.readTree(getResult.getResponse().getContentAsString());
        assertThat(persisted.get("amount").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(persisted.get("description").asString()).isEqualTo("Test transaction");
    }

    @Test
    void editOthersDeniedForViewer() throws Exception {
        PlanCast cast = castPlan();
        Transaction ownedByOwner =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByOwner.getId(), "70.00");
    }

    @Test
    void editDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), tx.getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isNotFound());

        assertUnchanged(tx.getId(), "70.00");
    }

    @Test
    void managePlanAllowedForOwnerOnly() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.owner()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Renamed by owner"))))
                .andExpect(status().isOk());
    }

    @Test
    void managePlanDeniedForNonOwnerMembers() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.editor(), cast.contributor(), cast.viewer())) {
            mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of("name", "Should not persist"))))
                    .andExpect(status().isForbidden());
        }

        mockMvc.perform(get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    JsonNode plan = objectMapper.readTree(result.getResponse().getContentAsString());
                    assertThat(plan.get("name").asString())
                            .isEqualTo(cast.plan().getName());
                });
    }

    @Test
    void managePlanDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Should not persist"))))
                .andExpect(status().isNotFound());
    }

    // ---- Flags agree with the guards: for every role and action, false if and only if the call is refused ----

    @Test
    void planFlagsAgreeWithThePlanWideEndpointsForEveryRole() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.editor(), cast.contributor(), cast.viewer(), cast.owner(), cast.nonMember())) {
            JsonNode permissions = planPermissions(cast, member);

            assertAgree(
                    member,
                    "createTransactions",
                    permissions,
                    mockMvc.perform(
                            post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                                    .with(testAuthHelper.asUser(member))
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(transactionBody("30.00", "Groceries"))));
            assertAgree(
                    member,
                    "attributeToOthers",
                    permissions,
                    mockMvc.perform(post(
                                    TransactionRoutes.TRANSACTION, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(attributedBody(cast.editor().equals(member) ? cast.owner() : cast.editor()))));
            assertAgree(
                    member,
                    "manageCategories",
                    permissions,
                    mockMvc.perform(post(CategoryRoutes.CATEGORY, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Map.of("type", "DEBIT", "description", "Food " + member.getId())))));
            // Renaming last: the owner's rename succeeds without changing anyone's role.
            assertAgree(
                    member,
                    "managePlan",
                    permissions,
                    mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of("name", "Renamed")))));
        }
    }

    @Test
    void transactionFlagsAgreeWithEditAndDeleteForEveryRoleAndRow() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor(), cast.viewer())) {
            User other = member.equals(cast.owner()) ? cast.editor() : cast.owner();
            for (User rowCreator : List.of(member, other)) {
                Transaction row =
                        fixtures.aTransaction(cast.plan(), rowCreator, new BigDecimal("40.00"), TransactionType.DEBIT);
                JsonNode permissions = read(mockMvc.perform(get(
                                                TransactionRoutes.TRANSACTION + "/{id}",
                                                cast.plan().getId(),
                                                row.getId())
                                        .with(testAuthHelper.asUser(member)))
                                .andExpect(status().isOk()))
                        .get("permissions");

                assertAgree(
                        member,
                        "edit",
                        permissions,
                        mockMvc.perform(put(
                                        TransactionRoutes.TRANSACTION + "/{id}",
                                        cast.plan().getId(),
                                        row.getId())
                                .with(testAuthHelper.asUser(member))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(transactionEditBody("41.00", "Edited"))));
                assertAgree(
                        member,
                        "delete",
                        permissions,
                        mockMvc.perform(delete(
                                        TransactionRoutes.TRANSACTION + "/{id}",
                                        cast.plan().getId(),
                                        row.getId())
                                .with(testAuthHelper.asUser(member))));
            }
        }

        Transaction row =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("40.00"), TransactionType.DEBIT);
        mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), row.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete(
                                TransactionRoutes.TRANSACTION + "/{id}",
                                cast.plan().getId(),
                                row.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
    }

    @Test
    void planFlagsFollowTheRole() throws Exception {
        PlanCast cast = castPlan();

        JsonNode owner = read(mockMvc.perform(
                        get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk()));
        assertThat(owner.get("isDefault").isBoolean()).isTrue();
        assertThat(owner.get("permissions").properties())
                .extracting(Map.Entry::getKey)
                .containsExactlyInAnyOrder("createTransactions", "attributeToOthers", "manageCategories", "managePlan");

        assertThat(flags(planPermissions(cast, cast.owner()))).containsExactly(true, true, true, true);
        assertThat(flags(planPermissions(cast, cast.editor()))).containsExactly(true, true, false, false);
        assertThat(flags(planPermissions(cast, cast.contributor()))).containsExactly(true, false, false, false);
        assertThat(flags(planPermissions(cast, cast.viewer()))).containsExactly(false, false, false, false);
    }

    private static List<Boolean> flags(JsonNode permissions) {
        return List.of(
                permissions.get("createTransactions").asBoolean(),
                permissions.get("attributeToOthers").asBoolean(),
                permissions.get("manageCategories").asBoolean(),
                permissions.get("managePlan").asBoolean());
    }

    /** A member's flags from the plan they read; a non-member reads nothing (404), so every flag is false. */
    private JsonNode planPermissions(PlanCast cast, User member) throws Exception {
        MvcResult result = mockMvc.perform(
                        get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(member)))
                .andReturn();
        if (result.getResponse().getStatus() == 404) {
            return objectMapper.readTree("{}");
        }
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("permissions");
    }

    /** The flag is true exactly when the endpoint accepts the call (2xx); a refusal is 403, or 404 off the plan. */
    private static void assertAgree(User member, String flag, JsonNode permissions, ResultActions call) {
        int status = call.andReturn().getResponse().getStatus();
        boolean allowed = permissions.has(flag) && permissions.get(flag).asBoolean();
        assertThat(status >= 200 && status < 300)
                .as("user %d, %s: flag %s, status %d", member.getId(), flag, allowed, status)
                .isEqualTo(allowed);
        if (!allowed) {
            assertThat(status).as("user %d, %s refused", member.getId(), flag).isIn(403, 404);
        }
    }

    private JsonNode read(ResultActions call) throws Exception {
        return objectMapper.readTree(call.andReturn().getResponse().getContentAsString());
    }

    private String attributedBody(User attributedTo) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("30.00"),
                "description",
                "For a partner",
                "startDate",
                today.toString(),
                "participants",
                List.of(Map.of("memberId", attributedTo.getId()))));
    }

    /** An edit of a transaction the test has just created, so at its first version. */
    private String transactionEditBody(String amount, String description) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                description,
                "startDate",
                today.toString(),
                "version",
                0));
    }

    private String transactionBody(String amount, String description) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                description,
                "startDate",
                today.toString()));
    }

    private void assertUnchanged(Long transactionId, String expectedAmount) {
        Transaction reloaded = transactionRepository.findById(transactionId).orElseThrow();
        assertThat(reloaded.getAmount()).isEqualByComparingTo(expectedAmount);
        assertThat(reloaded.getDescription()).isEqualTo("Test transaction");
    }
}
