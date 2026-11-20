package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * What a movement kind does to a row, through the API: a neutral kind refuses what it cannot carry, a refund needs an
 * expense category on a credit, and the list can be narrowed to the rows that have a kind. What each kind does to the
 * totals is proved in the same class from the dashboard's side.
 */
class NeutralMovementsIT extends AbstractIntegrationTest {

    private static final LocalDate NOVEMBER = LocalDate.of(2026, 11, 10);
    private static final List<TransactionKind> NEUTRAL_KINDS =
            List.of(TransactionKind.TRANSFER, TransactionKind.CARD_BILL_PAYMENT, TransactionKind.SAVINGS);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void neutralKindRefusesCategorySplitAndItems() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Transaction stored = row(plan, owner, TransactionType.DEBIT, "80.00", NOVEMBER, null, null);

        for (TransactionKind kind : NEUTRAL_KINDS) {
            List<Map<String, Object>> refused = new ArrayList<>();
            refused.add(body(TransactionType.DEBIT, "80.00", kind, food.getId()));
            Map<String, Object> split = body(TransactionType.DEBIT, "80.00", kind, null);
            split.put("participants", List.of(member(owner), member(partner)));
            refused.add(split);
            Map<String, Object> withItems = body(TransactionType.DEBIT, "80.00", kind, null);
            withItems.put("items", List.of(Map.of("description", "Part", "amount", "10.00")));
            refused.add(withItems);

            for (Map<String, Object> request : refused) {
                send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, request)
                        .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"))
                        .andExpect(jsonPath("$.field").value("kind"));

                Map<String, Object> edit = new LinkedHashMap<>(request);
                edit.put("items", request.getOrDefault("items", List.of()));
                edit.put("version", stored.getVersion());
                send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), stored.getId()), owner, edit)
                        .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
            }
        }

        assertThat(transactionRepository.findAllByPlan(plan)).singleElement().satisfies(row -> {
            assertThat(row.getId()).isEqualTo(stored.getId());
            assertThat(row.getKind()).isNull();
            assertThat(row.getCategory()).isNull();
            assertThat(row.getVersion()).isEqualTo(stored.getVersion());
        });
    }

    @Test
    void aNeutralKindAloneIsStoredAndComesBackOnTheRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        for (TransactionKind kind : NEUTRAL_KINDS) {
            JsonNode created = readBody(send(
                            post(TransactionRoutes.TRANSACTION, plan.getId()),
                            owner,
                            body(TransactionType.DEBIT, "80.00", kind, null))
                    .andExpect(status().isCreated()));

            assertThat(created.path("kind").asString()).isEqualTo(kind.name());
            assertThat(transactionRepository.findById(created.path("id").asLong()))
                    .get()
                    .extracting(Transaction::getKind)
                    .isEqualTo(kind);
        }
    }

    @Test
    void refundNeedsAnExpenseCategoryOnACredit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, null))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, salary.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.DEBIT, "50.00", TransactionKind.REFUND, food.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "neutral-kind-invalid"));

        assertThat(transactionRepository.findAllByPlan(plan)).isEmpty();

        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        body(TransactionType.CREDIT, "50.00", TransactionKind.REFUND, food.getId()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.kind").value("REFUND"))
                .andExpect(jsonPath("$.category.id").value(food.getId()));
    }

    @Test
    void listFilterNeutralReturnsOnlyRowsWithAKind() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        row(plan, owner, TransactionType.DEBIT, "20.00", NOVEMBER, null, null);
        row(plan, owner, TransactionType.CREDIT, "3000.00", NOVEMBER, null, null);
        Transaction transfer =
                row(plan, owner, TransactionType.DEBIT, "500.00", NOVEMBER, null, TransactionKind.TRANSFER);
        Transaction bill =
                row(plan, owner, TransactionType.DEBIT, "1500.00", NOVEMBER, null, TransactionKind.CARD_BILL_PAYMENT);
        Transaction refund = row(plan, owner, TransactionType.CREDIT, "50.00", NOVEMBER, food, TransactionKind.REFUND);

        JsonNode neutral = list(plan, owner, "NEUTRAL");
        JsonNode refunds = list(plan, owner, "REFUND");
        JsonNode everything = list(plan, owner, null);

        assertThat(ids(neutral)).containsExactlyInAnyOrder(transfer.getId(), bill.getId(), refund.getId());
        assertThat(neutral.path("totalElements").asLong()).isEqualTo(3);
        assertThat(ids(refunds)).containsExactly(refund.getId());
        assertThat(everything.path("totalElements").asLong()).isEqualTo(5);
    }

    private JsonNode list(Plan plan, User caller, String kind) throws Exception {
        var request = get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(caller));
        if (kind != null) {
            request = request.param("kind", kind);
        }
        return readBody(mockMvc.perform(request).andExpect(status().isOk()));
    }

    private static List<Long> ids(JsonNode page) {
        List<Long> ids = new ArrayList<>();
        page.path("content").forEach(row -> ids.add(row.path("id").asLong()));
        return ids;
    }

    private Transaction row(
            Plan plan,
            User creator,
            TransactionType type,
            String amount,
            LocalDate date,
            Category category,
            TransactionKind kind) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(category, type, new BigDecimal(amount), "Row", date, null, null, kind),
                SplitMode.EQUAL,
                List.of(new Share(creator, null)),
                List.of(),
                null,
                null));
    }

    private static Map<String, Object> body(
            TransactionType type, String amount, TransactionKind kind, Long categoryId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", type.name());
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Movement");
        body.put("startDate", NOVEMBER.toString());
        body.put("kind", kind.name());
        if (categoryId != null) {
            body.put("categoryId", categoryId);
        }
        return body;
    }

    private static Map<String, Object> member(User user) {
        return Map.of("memberId", user.getId());
    }

    private ResultActions send(MockHttpServletRequestBuilder request, User caller, Map<String, Object> body)
            throws Exception {
        return mockMvc.perform(request.with(testAuthHelper.asUser(caller))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private JsonNode readBody(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }
}
