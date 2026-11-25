package com.lcs.findraco;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.ObjectMapper;

/** Every input is bounded: one request per bound class answers 422 on the offending field. */
class BoundedInputsIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PlanMembershipRepository membershipRepository;

    @Test
    void aStringLongerThanItsColumnIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(
                        post(CategoryRoutes.CATEGORY, plan.getId()),
                        owner,
                        Map.of("type", "DEBIT", "description", "x".repeat(256)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("description"))
                .andExpect(jsonPath("$.errors[0].code").value("Size"));
    }

    @Test
    void aContactNameLongerThanItsColumnIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(post(ContactRoutes.CONTACT, plan.getId()), owner, Map.of("name", "x".repeat(61)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("name"))
                .andExpect(jsonPath("$.errors[0].code").value("Size"));
    }

    @Test
    void aRepaymentTakesAtMostAHundredPositiveAllocations() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Map<String, Object> repayment = new LinkedHashMap<>(Map.of(
                "type", "CREDIT",
                "amount", "10.00",
                "description", "Pix",
                "startDate", today().toString(),
                "kind", "REPAYMENT",
                "contactId", mae.getId()));

        repayment.put("allocations", Collections.nCopies(101, Map.of("participantId", 1, "amount", "1.00")));
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("allocations"))
                .andExpect(jsonPath("$.errors[0].code").value("Size"));

        repayment.put("allocations", List.of(Map.of("participantId", 1, "amount", "0.00")));
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("allocations[0].amount"))
                .andExpect(jsonPath("$.errors[0].code").value("Positive"));
    }

    @Test
    void aSeriesDescriptionLeavesRoomForTheInstallmentSuffix() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(
                        post(TransactionRoutes.TRANSACTION + "/series", plan.getId()),
                        owner,
                        Map.of(
                                "type", "DEBIT",
                                "amount", "10.00",
                                "description", "x".repeat(246),
                                "mode", "INSTALLMENT",
                                "parcelsNumber", 120,
                                "startDate", "2026-01-01"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("description"));
    }

    @Test
    void aListLongerThanItsBoundIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        List<Map<String, Object>> items = IntStream.range(0, 101)
                .mapToObj(i -> Map.<String, Object>of("description", "Item " + i, "amount", "1.00"))
                .toList();

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        Map.of(
                                "type", "DEBIT",
                                "amount", "101.00",
                                "description", "Market",
                                "startDate", "2026-01-01",
                                "items", items))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("items"));
    }

    @Test
    void moneyWithThreeFractionDigitsIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        Map.of("type", "DEBIT", "amount", "10.005", "description", "Coffee", "startDate", "2026-01-01"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("amount"))
                .andExpect(jsonPath("$.errors[0].code").value("Digits"));
    }

    @Test
    void aNegativeSpendingLimitIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(
                        post(CategoryRoutes.CATEGORY, plan.getId()),
                        owner,
                        Map.of("type", "DEBIT", "description", "Food", "spendingLimit", "-1.00"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("spendingLimit"))
                .andExpect(jsonPath("$.errors[0].code").value("PositiveOrZero"));
    }

    @Test
    void aTransactionParcelsNumberIsBounded() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        Map.of(
                                "type", "DEBIT",
                                "amount", "10.00",
                                "description", "Coffee",
                                "startDate", "2026-01-01",
                                "parcelsNumber", 121))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("parcelsNumber"));
    }

    @Test
    void anInvitationCannotGrantOwner() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        send(post(PlanRoutes.PLAN_INVITATION, plan.getId()), owner, Map.of("role", "OWNER", "type", "LINK"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("role"));
    }

    @Test
    void aTransferCannotLeaveThePreviousOwnerAnOwner() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        send(
                        post(ApiRoutes.PLAN + "/{id}/transfer", plan.getId()),
                        owner,
                        Map.of("newOwnerUserId", partner.getId(), "previousOwnerRole", "OWNER"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("previousOwnerRole"));

        assertThat(membershipRepository.countByPlanAndRole(plan, PlanRole.OWNER))
                .isEqualTo(1);
    }

    private ResultActions send(MockHttpServletRequestBuilder request, User asUser, Map<String, Object> body)
            throws Exception {
        return mockMvc.perform(request.with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }
}
