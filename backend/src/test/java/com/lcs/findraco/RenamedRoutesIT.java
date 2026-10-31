package com.lcs.findraco;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

/** Transactions and categories answer under their domain names only; the old paths are gone, with no alias. */
class RenamedRoutesIT extends AbstractIntegrationTest {

    @Test
    void transactionAndCategoryRoutesAnswerUnderTheirNewPaths() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);

        mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk());
        mockMvc.perform(get(CategoryRoutes.CATEGORY, plan.getId()).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk());
    }

    @Test
    void oldTransactionPathsAnswerNotFound() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);
        String old = ApiRoutes.PLAN + "/{planId}/financial-transaction";

        mockMvc.perform(get(old, plan.getId()).with(testAuthHelper.asUser(user)))
                .andExpect(status().isNotFound());
        mockMvc.perform(post(old, plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void oldCategoryPathsAnswerNotFound() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);
        String old = ApiRoutes.PLAN + "/{planId}/financial-transaction-category";

        mockMvc.perform(get(old, plan.getId()).with(testAuthHelper.asUser(user)))
                .andExpect(status().isNotFound());
        mockMvc.perform(get(old + "/spending", plan.getId()).with(testAuthHelper.asUser(user)))
                .andExpect(status().isNotFound());
    }
}
