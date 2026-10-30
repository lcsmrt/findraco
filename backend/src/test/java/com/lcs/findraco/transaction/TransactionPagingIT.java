package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Equal sort keys page deterministically, and a search term is matched literally. */
class TransactionPagingIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void rowsWithEqualSortKeysAppearOnExactlyOnePage() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        for (int i = 0; i < 7; i++) {
            aTransaction(plan, owner, "Same " + i);
        }

        for (String sortBy : List.of("amount", "startDate", "description", "category", "attributedTo")) {
            List<Long> seen = new ArrayList<>();
            for (int page = 0; page < 4; page++) {
                seen.addAll(idsOf(list(plan, owner, "sortBy", sortBy, "size", "2", "page", String.valueOf(page))));
            }
            assertThat(seen).as("sorted by " + sortBy).hasSize(7).doesNotHaveDuplicates();
            assertThat(new HashSet<>(seen)).hasSize(7);
        }
    }

    @Test
    void aPercentOrUnderscoreInTheSearchMatchesLiterally() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        aTransaction(plan, owner, "Half 50% off");
        aTransaction(plan, owner, "Half 50 off");
        aTransaction(plan, owner, "snake_case");
        aTransaction(plan, owner, "snakeXcase");

        assertThat(descriptionsOf(list(plan, owner, "description", "%"))).containsExactly("Half 50% off");
        assertThat(descriptionsOf(list(plan, owner, "description", "50%"))).containsExactly("Half 50% off");
        assertThat(descriptionsOf(list(plan, owner, "description", "_"))).containsExactly("snake_case");
        assertThat(descriptionsOf(list(plan, owner, "description", "e_c"))).containsExactly("snake_case");
    }

    private void aTransaction(Plan plan, User owner, String description) {
        TransactionDetails details = new TransactionDetails(
                null, TransactionType.DEBIT, new BigDecimal("10.00"), description, today(), null, null);
        fixtures.aTransaction(new TransactionDraft(
                plan, owner, details, SplitMode.EQUAL, List.of(new Share(owner, null)), List.of(), null, null));
    }

    private JsonNode list(Plan plan, User owner, String... params) throws Exception {
        var request = get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(owner));
        for (int i = 0; i < params.length; i += 2) {
            request = request.param(params[i], params[i + 1]);
        }
        MvcResult result = mockMvc.perform(request).andExpect(status().isOk()).andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("content");
    }

    private static List<Long> idsOf(JsonNode content) {
        List<Long> ids = new ArrayList<>();
        content.forEach(row -> ids.add(row.get("id").asLong()));
        return ids;
    }

    private static Set<String> descriptionsOf(JsonNode content) {
        Set<String> descriptions = new HashSet<>();
        content.forEach(row -> descriptions.add(row.get("description").asString()));
        return descriptions;
    }
}
