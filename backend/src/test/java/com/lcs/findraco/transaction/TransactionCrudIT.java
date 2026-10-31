package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of the PUT full-replace contract described in the transaction update
 * memory note: {@code PUT /transaction/{id}} is a full replace, not a patch. A caller
 * must send the complete desired state (participants, items included); the server discards any
 * child rows (participants/items) not present in the new request rather than merging them in.
 *
 * <p>Also exercises the validation guards that are actually implemented in
 * {@link com.lcs.findraco.transaction.service.TransactionService} and its DTOs.
 */
class TransactionCrudIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void putWithFewerItemsReplacesAllPreviousItemsLeavingNoLeftoverRows() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created = createTransaction(
                plan,
                owner,
                requestBody(
                        "DEBIT",
                        "100.00",
                        "Groceries",
                        owner,
                        List.of(
                                Map.of("description", "Item A", "amount", new BigDecimal("40.00")),
                                Map.of("description", "Item B", "amount", new BigDecimal("60.00")))));
        assertThat(created.get("items")).hasSize(2);
        long transactionId = created.get("id").asLong();

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId,
                                requestBody(
                                        "DEBIT",
                                        "100.00",
                                        "Groceries",
                                        owner,
                                        List.of(Map.of("description", "Item C", "amount", new BigDecimal("70.00")))))))
                .andExpect(status().isOk());

        JsonNode persisted = fetchTransaction(plan, owner, transactionId);

        assertThat(persisted.get("items")).hasSize(1);
        assertThat(persisted.get("items").get(0).get("description").asString()).isEqualTo("Item C");
        assertThat(persisted.get("items").get(0).get("amount").decimalValue()).isEqualByComparingTo("70.00");

        List<String> itemDescriptions = StreamSupport.stream(
                        persisted.get("items").spliterator(), false)
                .map(item -> item.get("description").asString())
                .toList();
        assertThat(itemDescriptions).doesNotContain("Item A", "Item B");
    }

    /**
     * The PUT replaces the whole transaction, so its items are required: omitting them is refused and keeps
     * the stored items (a client that forgot them used to wipe them), while an empty list removes them.
     */
    @Test
    void putWithoutItemsIsRefusedAndAnEmptyListRemovesThem() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long transactionId = createTransaction(
                        plan,
                        owner,
                        requestBody(
                                "DEBIT",
                                "100.00",
                                "Groceries",
                                owner,
                                List.of(Map.of("description", "Item A", "amount", new BigDecimal("40.00")))))
                .get("id")
                .asLong();
        Map<String, Object> withoutItems = new HashMap<>(
                objectMapper.readValue(requestBody("DEBIT", "120.00", "Groceries", owner, List.of()), MAP));
        withoutItems.remove("items");

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(transactionId, objectMapper.writeValueAsString(withoutItems))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[0].field").value("items"));
        assertThat(fetchTransaction(plan, owner, transactionId).get("items")).hasSize(1);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId, requestBody("DEBIT", "120.00", "Groceries", owner, List.of()))))
                .andExpect(status().isOk());
        assertThat(fetchTransaction(plan, owner, transactionId).get("items")).isEmpty();
    }

    @Test
    void putWithFewerParticipantsReplacesAllPreviousParticipantsLeavingNoLeftoverRows() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(plan, member, PlanRole.EDITOR);

        JsonNode created = createTransaction(plan, owner, splitRequestBody("100.00", List.of(owner, member)));
        assertThat(created.get("participants")).hasSize(2);
        long transactionId = created.get("id").asLong();

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(transactionId, splitRequestBody("100.00", List.of(owner)))))
                .andExpect(status().isOk());

        JsonNode persisted = fetchTransaction(plan, owner, transactionId);

        assertThat(persisted.get("participants")).hasSize(1);
        assertThat(persisted.get("participants").get(0).get("id").asLong()).isEqualTo(owner.getId());
        assertThat(persisted.get("participants").get(0).get("shareAmount").decimalValue())
                .isEqualByComparingTo("100.00");
    }

    @Test
    void putWithItemsOverflowingTransactionAmountIsRejected() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        // Single item worth more than the transaction's own amount: TransactionService
        // .applyItems throws TransactionExceptions.ItemsTotalExceedsAmountException,
        // mapped to 400 by GlobalExceptionHandler.
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId,
                                requestBody(
                                        "DEBIT",
                                        "100.00",
                                        "Groceries",
                                        owner,
                                        List.of(Map.of(
                                                "description", "Too much", "amount", new BigDecimal("150.00")))))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "items-exceed-amount"));

        JsonNode persisted = fetchTransaction(plan, owner, transactionId);
        assertThat(persisted.get("items")).isEmpty();
    }

    @Test
    void putWithBlankDescriptionIsRejected() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        // description carries @NotBlank on CreateTransactionRequest: a blank value fails
        // bean validation before the service is even invoked (MethodArgumentNotValidException -> 400).
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(transactionId, requestBody("DEBIT", "100.00", "   ", owner, List.of()))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
    }

    @Test
    void putWithItemAmountNegativeOrZeroIsRejected() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        // TransactionItemRequest.amount carries @Positive: a negative item amount fails bean validation.
        // (TransactionService.applyItems also redundantly re-checks this server-side.)
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId,
                                requestBody(
                                        "DEBIT",
                                        "100.00",
                                        "Groceries",
                                        owner,
                                        List.of(Map.of(
                                                "description", "Refund-ish", "amount", new BigDecimal("-10.00")))))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
    }

    @Test
    void putWithNegativeTransactionAmountIsRejected() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        // CreateTransactionRequest.amount carries @Positive: a negative (or zero) top-level
        // amount fails bean validation before the service is invoked, same as TransactionItemRequest.amount.
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId, requestBody("DEBIT", "-50.00", "Groceries", owner, List.of()))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));

        JsonNode persisted = fetchTransaction(plan, owner, transactionId);
        assertThat(persisted.get("amount").decimalValue()).isEqualByComparingTo("100.00");
    }

    @Test
    void putWithCategoryTypeMismatchIsRejected() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        long creditCategoryId = createCategory(plan, owner, "CREDIT", "Salary");

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        // A category of the other type breaks a rule of the request itself: 422, never a 500.
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId,
                                objectMapper.writeValueAsString(Map.of(
                                        "type",
                                        "DEBIT",
                                        "categoryId",
                                        creditCategoryId,
                                        "amount",
                                        new BigDecimal("100.00"),
                                        "description",
                                        "Groceries",
                                        "startDate",
                                        today().toString(),
                                        "splitMode",
                                        "EQUAL",
                                        "participants",
                                        new Object[] {Map.of("memberId", owner.getId())},
                                        "items",
                                        List.of())))))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "transaction-category-type-mismatch"));
    }

    @Test
    void putWithCategoryFromAnotherPlanIsRejectedAsNotFound() throws Exception {
        // Real behavior: CategoryService.findById treats a category that
        // belongs to a *different* plan the same as a category that doesn't exist at all, and
        // throws CategoryNotFoundException, which GlobalExceptionHandler maps
        // to 404 -- not 400. This follows the same "cross-plan reference looks like not-found,
        // never forbidden" convention documented in PlanAuthorizationMatrixIT/AuthenticationIT,
        // so it's asserted here as the real (and intentional) 404, not the 400 one might guess.
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        User otherOwner = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(otherOwner);
        long foreignCategoryId = createCategory(otherPlan, otherOwner, "DEBIT", "Foreign category");

        JsonNode created =
                createTransaction(plan, owner, requestBody("DEBIT", "100.00", "Groceries", owner, List.of()));
        long transactionId = created.get("id").asLong();

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versioned(
                                transactionId,
                                objectMapper.writeValueAsString(Map.of(
                                        "type",
                                        "DEBIT",
                                        "categoryId",
                                        foreignCategoryId,
                                        "amount",
                                        new BigDecimal("100.00"),
                                        "description",
                                        "Groceries",
                                        "startDate",
                                        today().toString(),
                                        "splitMode",
                                        "EQUAL",
                                        "participants",
                                        new Object[] {Map.of("memberId", owner.getId())},
                                        "items",
                                        List.of())))))
                .andExpect(status().isNotFound());
    }

    private JsonNode createTransaction(Plan plan, User asUser, String body) throws Exception {
        MvcResult result = mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    /** The edit body with the transaction's stored version, as a client sends back the one it read. */
    private String versioned(long transactionId, String body) throws Exception {
        Map<String, Object> versioned = new HashMap<>(objectMapper.readValue(body, MAP));
        versioned.put("version", fixtures.transactionVersion(transactionId));
        return objectMapper.writeValueAsString(versioned);
    }

    private static final TypeReference<Map<String, Object>> MAP = new TypeReference<>() {};

    private JsonNode fetchTransaction(Plan plan, User asUser, long transactionId) throws Exception {
        MvcResult result = mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId)
                        .with(testAuthHelper.asUser(asUser)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private long createCategory(Plan plan, User asUser, String type, String description) throws Exception {
        MvcResult result = mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "type", type,
                                "description", description))))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper
                .readTree(result.getResponse().getContentAsString())
                .get("id")
                .asLong();
    }

    @Test
    void aSplitModeTheApiDoesNotOfferIsRejectedAtTheBoundary() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String percent = splitRequestBody("100.00", List.of(owner)).replace("\"EQUAL\"", "\"PERCENT\"");

        mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(percent))
                .andExpect(problem(HttpStatus.BAD_REQUEST, "malformed-request"));
    }

    private String requestBody(
            String type, String amount, String description, User soleParticipant, List<Map<String, Object>> items)
            throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                type,
                "amount",
                new BigDecimal(amount),
                "description",
                description,
                "startDate",
                today().toString(),
                "splitMode",
                "EQUAL",
                "participants",
                new Object[] {Map.of("memberId", soleParticipant.getId())},
                "items",
                items));
    }

    private String splitRequestBody(String amount, List<User> participants) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                "Split expense",
                "startDate",
                today().toString(),
                "splitMode",
                "EQUAL",
                "participants",
                participants.stream()
                        .map(user -> Map.of("memberId", user.getId()))
                        .toList(),
                "items",
                List.of()));
    }
}
