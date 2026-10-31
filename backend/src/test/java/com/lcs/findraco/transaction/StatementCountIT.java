package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManagerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import tools.jackson.databind.ObjectMapper;

/** The transaction list costs the same number of SQL statements whatever the number of rows on the page. */
class StatementCountIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Test
    void aPageOfFiveAndAPageOfTwentyIssueTheSameNumberOfStatements() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);
        Category parent = fixtures.aCategory(plan, TransactionType.DEBIT, "Home");
        Category child = fixtures.aCategory(plan, TransactionType.DEBIT, "Rent", parent);

        // More rows than either page holds, so both pages are full and both run the total count.
        createTransactions(plan, owner, member, parent, child, 25);

        long fiveRows = statementsForFirstPage(plan, owner, 5, parent.getId());
        long twentyRows = statementsForFirstPage(plan, owner, 20, parent.getId());

        assertThat(twentyRows).isEqualTo(fiveRows);
    }

    private long statementsForFirstPage(Plan plan, User owner, int rows, long parentId) throws Exception {
        Statistics statistics =
                entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        statistics.clear();

        mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
                        .param("size", String.valueOf(rows))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(rows))
                .andExpect(jsonPath("$.content[0].participants.length()").value(2))
                .andExpect(jsonPath("$.content[0].items[0].category.parentId").value(parentId));

        return statistics.getPrepareStatementCount();
    }

    private void createTransactions(Plan plan, User owner, User member, Category parent, Category child, int count)
            throws Exception {
        for (int i = 0; i < count; i++) {
            Map<String, Object> body = Map.of(
                    "categoryId",
                    i % 2 == 0 ? parent.getId() : child.getId(),
                    "type",
                    "DEBIT",
                    "amount",
                    "100.00",
                    "description",
                    "Row " + i,
                    "startDate",
                    LocalDate.of(2026, 1, 1).plusDays(i).toString(),
                    "splitMode",
                    "EQUAL",
                    "participants",
                    List.of(Map.of("memberId", owner.getId()), Map.of("memberId", member.getId())),
                    "items",
                    List.of(Map.of("description", "Item", "amount", "40.00", "categoryId", child.getId())));
            mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                            .with(testAuthHelper.asUser(owner))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(body)))
                    .andExpect(status().isCreated());
        }
    }
}
