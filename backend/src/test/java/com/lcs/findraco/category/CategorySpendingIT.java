package com.lcs.findraco.category;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.CategoryMemberLimit;
import com.lcs.findraco.category.model.FinancialTransactionCategory;
import com.lcs.findraco.category.repository.CategoryMemberLimitRepository;
import com.lcs.findraco.category.repository.FinancialTransactionCategoryRepository;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.FinancialTransaction;
import com.lcs.findraco.transaction.model.FinancialTransactionType;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.repository.FinancialTransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of {@code GET .../financial-transaction-category/spending} (spec P1 "Categories
 * tab" AC 2-3 and 8; CAT-01, CAT-02): every category of the plan as DEBIT then CREDIT trees, children
 * nested, with the period's spend and limit usage per row, readable by any plan member. Also the
 * per-member rows (P2 AC 2, 5-6, 11-12; CAT-12, CAT-14), owned rows (P3 AC 5, 7; CAT-14, CAT-16) and
 * former members end to end, so the service's active-member wiring is exercised for real.
 */
class CategorySpendingIT extends AbstractIntegrationTest {

    private final LocalDate today = LocalDate.now();

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    @Autowired
    private FinancialTransactionRepository transactionRepository;

    @Autowired
    private CategoryMemberLimitRepository memberLimitRepository;

    @Test
    void returnsDebitThenCreditTreesWithNestedChildrenAndLimitUsagePerRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Seed seed = seed(plan, owner);

        JsonNode tree = readSpending(fetchSpending(plan, owner).andExpect(status().isOk()));

        assertThat(tree).hasSize(3);
        assertThat(tree.get(0).get("name").asString()).isEqualTo("Food");
        assertThat(tree.get(1).get("name").asString()).isEqualTo("Rent");
        assertThat(tree.get(2).get("name").asString()).isEqualTo("Salary");
        assertThat(tree.get(0).get("type").asString()).isEqualTo("DEBIT");
        assertThat(tree.get(1).get("type").asString()).isEqualTo("DEBIT");
        assertThat(tree.get(2).get("type").asString()).isEqualTo("CREDIT");

        // Root: direct spend (150) + child (250); the out-of-period transaction is excluded.
        JsonNode food = tree.get(0);
        assertThat(food.get("categoryId").asLong()).isEqualTo(seed.food().getId());
        assertThat(food.get("parentId").isNull()).isTrue();
        assertThat(food.get("spent").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(food.get("limit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(food.get("remaining").decimalValue()).isEqualByComparingTo("0.00");
        assertThat(food.get("percentUsed").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(food.get("overLimit").asBoolean()).isFalse();
        // UX-04 AC 1: the single participant is listed with the rolled-up spend and no limit.
        assertThat(food.get("members")).singleElement().satisfies(member -> {
            assertThat(member.get("memberId").asLong()).isEqualTo(owner.getId());
            assertThat(member.get("spent").decimalValue()).isEqualByComparingTo("400.00");
            assertThat(member.get("limit").isNull()).isTrue();
        });

        // Child: own spend only, evaluated against its own limit → over limit.
        assertThat(food.get("children")).hasSize(1);
        JsonNode delivery = food.get("children").get(0);
        assertThat(delivery.get("categoryId").asLong())
                .isEqualTo(seed.delivery().getId());
        assertThat(delivery.get("parentId").asLong()).isEqualTo(seed.food().getId());
        assertThat(delivery.get("spent").decimalValue()).isEqualByComparingTo("250.00");
        assertThat(delivery.get("limit").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(delivery.get("remaining").decimalValue()).isEqualByComparingTo("-50.00");
        assertThat(delivery.get("percentUsed").decimalValue()).isEqualByComparingTo("125.00");
        assertThat(delivery.get("overLimit").asBoolean()).isTrue();

        // Zero-spend category without a limit is still listed.
        JsonNode rent = tree.get(1);
        assertThat(rent.get("spent").decimalValue()).isEqualByComparingTo("0");
        assertThat(rent.get("limit").isNull()).isTrue();
        assertThat(rent.get("percentUsed").isNull()).isTrue();
        assertThat(rent.get("overLimit").isNull()).isTrue();
        assertThat(rent.get("children")).isEmpty();

        JsonNode salary = tree.get(2);
        assertThat(salary.get("spent").decimalValue()).isEqualByComparingTo("1000.00");
        assertThat(salary.get("children")).hasSize(1);
        assertThat(salary.get("children").get(0).get("name").asString()).isEqualTo("Bonus");
        assertThat(salary.get("children").get(0).get("spent").decimalValue()).isEqualByComparingTo("0");
    }

    @Test
    void viewerCanReadTheSpendingTree() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        seed(plan, owner);

        JsonNode tree = readSpending(fetchSpending(plan, viewer).andExpect(status().isOk()));

        assertThat(tree).hasSize(3);
        assertThat(tree.get(0).get("name").asString()).isEqualTo("Food");
        assertThat(tree.get(0).get("spent").decimalValue()).isEqualByComparingTo("400.00");
    }

    @Test
    void nonMemberGets404() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        seed(plan, owner);
        User outsider = fixtures.aUser();
        fixtures.aPlan(outsider);

        fetchSpending(plan, outsider).andExpect(status().isNotFound());
    }

    @Test
    void missingPeriodIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/spending", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("startDate", today.toString()))
                .andExpect(status().isBadRequest());
    }

    // P2 independent test (AC 2, 5, 6): limit = sum of the entries; each member's share against their own limit.
    @Test
    void perMemberLimitsSumToTheRowLimitAndEachMemberSpendsTheirShare() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = withMemberLimits(
                fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries"),
                Map.of(owner, "260.00", partner, "140.00"));
        aSplitTransaction(plan, owner, groceries, "100.00", Map.of(owner, "50.00", partner, "50.00"));

        JsonNode row = rowNamed(readSpending(fetchSpending(plan, owner).andExpect(status().isOk())), "Groceries");

        assertThat(row.get("spent").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(row.get("limit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(row.get("percentUsed").decimalValue()).isEqualByComparingTo("25.00");
        assertThat(row.get("overLimit").asBoolean()).isFalse();
        assertThat(row.get("members")).hasSize(2);

        JsonNode mine = memberRow(row, owner);
        assertThat(mine.get("spent").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(mine.get("limit").decimalValue()).isEqualByComparingTo("260.00");
        assertThat(mine.get("remaining").decimalValue()).isEqualByComparingTo("210.00");
        assertThat(mine.get("overLimit").asBoolean()).isFalse();
        assertThat(mine.get("active").asBoolean()).isTrue();

        JsonNode theirs = memberRow(row, partner);
        assertThat(theirs.get("spent").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(theirs.get("limit").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(theirs.get("remaining").decimalValue()).isEqualByComparingTo("90.00");
        assertThat(theirs.get("overLimit").asBoolean()).isFalse();
        assertThat(theirs.get("active").asBoolean()).isTrue();
    }

    // P2 AC 11-12 (CAT-14): a removed member's entry is listed inactive and left out of the sum; rejoining restores it.
    @Test
    void removedMembersEntryIsInactiveAndOutOfTheSumUntilTheyRejoin() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = withMemberLimits(
                fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries"),
                Map.of(owner, "260.00", partner, "140.00"));
        aSplitTransaction(plan, owner, groceries, "100.00", Map.of(owner, "50.00", partner, "50.00"));

        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode removed = rowNamed(readSpending(fetchSpending(plan, owner).andExpect(status().isOk())), "Groceries");
        assertThat(removed.get("spent").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(removed.get("limit").decimalValue()).isEqualByComparingTo("260.00");
        assertThat(memberRow(removed, owner).get("active").asBoolean()).isTrue();
        JsonNode former = memberRow(removed, partner);
        assertThat(former.get("active").asBoolean()).isFalse();
        assertThat(former.get("limit").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(former.get("spent").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(former.get("remaining").isNull()).isTrue();
        assertThat(former.get("percentUsed").isNull()).isTrue();
        assertThat(former.get("overLimit").isNull()).isTrue();

        rejoin(plan, owner, partner);

        JsonNode rejoined = rowNamed(readSpending(fetchSpending(plan, owner).andExpect(status().isOk())), "Groceries");
        assertThat(rejoined.get("limit").decimalValue()).isEqualByComparingTo("400.00");
        JsonNode back = memberRow(rejoined, partner);
        assertThat(back.get("active").asBoolean()).isTrue();
        assertThat(back.get("limit").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(back.get("remaining").decimalValue()).isEqualByComparingTo("90.00");
    }

    // P3 independent test (AC 5; CAT-16): an owned row counts the owner's share only; the other share is listed without
    // a limit.
    @Test
    void ownedCategoryCountsTheOwnersShareOnly() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory professional = owned(
                withLimit(fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Professional"), "100.00"), owner);
        aSplitTransaction(plan, owner, professional, "100.00", Map.of(owner, "70.00", partner, "30.00"));

        JsonNode row = rowNamed(readSpending(fetchSpending(plan, partner).andExpect(status().isOk())), "Professional");

        assertThat(row.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(row.get("ownerActive").asBoolean()).isTrue();
        assertThat(row.get("spent").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(row.get("limit").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(row.get("percentUsed").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(row.get("members")).hasSize(2);
        assertThat(memberRow(row, owner).get("spent").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(memberRow(row, owner).get("limit").isNull()).isTrue();
        JsonNode other = memberRow(row, partner);
        assertThat(other.get("spent").decimalValue()).isEqualByComparingTo("30.00");
        assertThat(other.get("limit").isNull()).isTrue();
        assertThat(other.get("active").asBoolean()).isTrue();
    }

    // P3 AC 7 (CAT-14): a removed owner is reported as a former member and still attributes their spend.
    @Test
    void removedOwnerIsReportedInactiveAndStillCountsTheirShare() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory professional =
                owned(fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Professional"), partner);
        fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Courses", professional);
        aSplitTransaction(plan, partner, professional, "100.00", Map.of(partner, "70.00", owner, "30.00"));

        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode row = rowNamed(readSpending(fetchSpending(plan, owner).andExpect(status().isOk())), "Professional");
        assertThat(row.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(row.get("ownerActive").isBoolean()).isTrue();
        assertThat(row.get("ownerActive").asBoolean()).isFalse();
        assertThat(row.get("spent").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(row.get("children")).singleElement().satisfies(child -> {
            assertThat(child.get("ownerId").asLong()).isEqualTo(partner.getId());
            assertThat(child.get("ownerActive").isBoolean()).isTrue();
            assertThat(child.get("ownerActive").asBoolean()).isFalse();
        });
        assertThat(memberRow(row, owner).get("spent").decimalValue()).isEqualByComparingTo("30.00");

        rejoin(plan, owner, partner);

        JsonNode rejoined =
                rowNamed(readSpending(fetchSpending(plan, owner).andExpect(status().isOk())), "Professional");
        assertThat(rejoined.get("ownerActive").asBoolean()).isTrue();
    }

    // UX-04 AC 1: a plain category (no limit entries) lists every member with their spend.
    @Test
    void plainCategoryListsEveryMemberWithSpend() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory market = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Market");
        aSplitTransaction(plan, owner, market, "100.00", Map.of(owner, "60.00", partner, "40.00"));

        JsonNode row = rowNamed(readSpending(fetchSpending(plan, partner).andExpect(status().isOk())), "Market");

        assertThat(row.get("spent").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(row.get("members")).hasSize(2);
        JsonNode mine = memberRow(row, owner);
        assertThat(mine.get("name").asString()).isEqualTo(owner.getName());
        assertThat(mine.get("spent").decimalValue()).isEqualByComparingTo("60.00");
        assertThat(mine.get("limit").isNull()).isTrue();
        assertThat(mine.get("active").asBoolean()).isTrue();
        JsonNode theirs = memberRow(row, partner);
        assertThat(theirs.get("spent").decimalValue()).isEqualByComparingTo("40.00");
        assertThat(theirs.get("limit").isNull()).isTrue();
        assertThat(theirs.get("active").asBoolean()).isTrue();
    }

    private record Seed(FinancialTransactionCategory food, FinancialTransactionCategory delivery) {}

    /**
     * Food (limit 400) > Delivery (limit 200); Rent (no limit, no spend); Salary (CREDIT) > Bonus.
     * In period: 150 on Food, 250 on Delivery, 1000 on Salary. Out of period: 999 on Food.
     */
    private Seed seed(Plan plan, User owner) {
        FinancialTransactionCategory food =
                withLimit(fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food"), "400.00");
        FinancialTransactionCategory delivery =
                withLimit(fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food), "200.00");
        fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");
        FinancialTransactionCategory salary = fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Salary");
        fixtures.aCategory(plan, FinancialTransactionType.CREDIT, "Bonus", salary);

        fixtures.aTransaction(plan, owner, new BigDecimal("150.00"), FinancialTransactionType.DEBIT, food);
        fixtures.aTransaction(plan, owner, new BigDecimal("250.00"), FinancialTransactionType.DEBIT, delivery);
        fixtures.aTransaction(plan, owner, new BigDecimal("1000.00"), FinancialTransactionType.CREDIT, salary);
        FinancialTransaction old =
                fixtures.aTransaction(plan, owner, new BigDecimal("999.00"), FinancialTransactionType.DEBIT, food);
        old.setStartDate(today.minusMonths(2));
        transactionRepository.save(old);
        return new Seed(food, delivery);
    }

    private FinancialTransactionCategory withLimit(FinancialTransactionCategory category, String limit) {
        category.setSpendingLimit(new BigDecimal(limit));
        return categoryRepository.save(category);
    }

    private FinancialTransactionCategory withMemberLimits(
            FinancialTransactionCategory category, Map<User, String> amounts) {
        amounts.forEach((member, amount) -> {
            CategoryMemberLimit entry = new CategoryMemberLimit();
            entry.setCategory(category);
            entry.setMember(member);
            entry.setAmount(new BigDecimal(amount));
            memberLimitRepository.save(entry);
        });
        return category;
    }

    private FinancialTransactionCategory owned(FinancialTransactionCategory category, User owner) {
        category.setOwner(owner);
        return categoryRepository.save(category);
    }

    /** A transaction dated today split across members by the given share amounts. */
    private void aSplitTransaction(
            Plan plan, User createdBy, FinancialTransactionCategory category, String amount, Map<User, String> shares) {
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setCategory(category);
        transaction.setPlan(plan);
        transaction.setCreatedBy(createdBy);
        transaction.setType(FinancialTransactionType.DEBIT);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setDescription("Split transaction");
        transaction.setStartDate(today);
        shares.forEach((member, share) -> {
            TransactionParticipant participant = new TransactionParticipant();
            participant.setTransaction(transaction);
            participant.setMember(member);
            participant.setShareAmount(new BigDecimal(share));
            transaction.getParticipants().add(participant);
        });
        transactionRepository.save(transaction);
    }

    private ResultActions removeMember(Plan plan, User asUser, User member) throws Exception {
        return mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}/members/{userId}", plan.getId(), member.getId())
                .with(testAuthHelper.asUser(asUser)));
    }

    /** The removed member accepts a new link invitation from the plan OWNER. */
    private void rejoin(Plan plan, User owner, User member) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("role", PlanRole.EDITOR.name());
        body.put("type", "LINK");
        String token = readSpending(mockMvc.perform(post(ApiRoutes.PLAN_INVITATION, plan.getId())
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                        .andExpect(status().isCreated()))
                .get("token")
                .asString();
        mockMvc.perform(post(ApiRoutes.INVITATION + "/{token}/accept", token).with(testAuthHelper.asUser(member)))
                .andExpect(status().isCreated());
    }

    private static JsonNode rowNamed(JsonNode tree, String name) {
        for (JsonNode row : tree) {
            if (row.get("name").asString().equals(name)) {
                return row;
            }
        }
        throw new AssertionError("No spending row named " + name + " in " + tree);
    }

    private static JsonNode memberRow(JsonNode row, User member) {
        for (JsonNode entry : row.get("members")) {
            if (entry.get("memberId").asLong() == member.getId()) {
                return entry;
            }
        }
        throw new AssertionError("No member row for " + member.getId() + " in " + row);
    }

    private ResultActions fetchSpending(Plan plan, User asUser) throws Exception {
        return mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/spending", plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .param("startDate", today.minusDays(1).toString())
                .param("endDate", today.plusDays(1).toString()));
    }

    private JsonNode readSpending(ResultActions actions) throws Exception {
        MvcResult result = actions.andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
