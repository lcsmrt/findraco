package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanRole;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.CategoryMemberLimitRepository;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Through-the-API proof of per-member limits (spec P2 "Per-member limits", AC 1-3, 7-13; CAT-11,
 * CAT-13, CAT-14): entries are stored per member and replaced as a set, the category limit is the sum
 * of the active entries, invalid entries reject the whole request, and a former member's entry stays
 * dormant until they rejoin or the OWNER removes it.
 */
class CategoryMemberLimitIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    @Autowired
    private CategoryMemberLimitRepository memberLimitRepository;

    // AC 1
    @Test
    void ownerSetsPerMemberLimitsAndOneAmountPerMemberIsStored() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        MvcResult result = create(plan, owner, body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00", partner.getId(), "140.00")))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode created = json(result);
        FinancialTransactionCategory category = categoryRepository.findById(created.get("id").asLong()).orElseThrow();
        Map<Long, BigDecimal> stored = storedAmounts(category);
        assertThat(stored).hasSize(2);
        assertThat(stored.get(owner.getId())).isEqualByComparingTo("260.00");
        assertThat(stored.get(partner.getId())).isEqualByComparingTo("140.00");

        JsonNode entries = created.get("memberLimits");
        assertThat(entries).hasSize(2);
        for (JsonNode entry : entries) {
            assertThat(entry.get("active").asBoolean()).isTrue();
        }
    }

    // AC 2
    @Test
    void categoryLimitIsReportedAsTheSumOfThePerMemberLimits() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        MvcResult result = create(plan, owner, body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00", partner.getId(), "140.00")))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode created = json(result);
        assertThat(created.get("effectiveLimit").decimalValue()).isEqualByComparingTo("400.00");

        JsonNode fetched = json(fetch(plan, owner, created.get("id").asLong()).andExpect(status().isOk()).andReturn());
        assertThat(fetched.get("effectiveLimit").decimalValue()).isEqualByComparingTo("400.00");
    }

    // AC 3
    @Test
    void plainLimitSentWithPerMemberLimitsIsIgnored() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        Map<String, Object> body = body("DEBIT", "Groceries", "999.00",
                limits(owner.getId(), "260.00", partner.getId(), "140.00"));
        JsonNode created = json(create(plan, owner, body).andExpect(status().isCreated()).andReturn());

        assertThat(created.get("effectiveLimit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(created.get("spendingLimit").isNull()).isTrue();
        assertThat(categoryRepository.findById(created.get("id").asLong()).orElseThrow().getSpendingLimit()).isNull();

        // Same on update while entries already exist and the request leaves them untouched.
        Map<String, Object> update = body("DEBIT", "Groceries", "500.00", null);
        JsonNode updated = json(update(plan, owner, created.get("id").asLong(), update)
                .andExpect(status().isOk()).andReturn());
        assertThat(updated.get("effectiveLimit").decimalValue()).isEqualByComparingTo("400.00");
        assertThat(updated.get("spendingLimit").isNull()).isTrue();
    }

    // Edge case: per-member limits all removed → no limit until a plain limit is set.
    @Test
    void removingEveryPerMemberLimitLeavesNoLimitUntilAPlainLimitIsSet() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00"));

        JsonNode cleared = json(update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null, List.of()))
                .andExpect(status().isOk()).andReturn());
        assertThat(cleared.get("memberLimits")).isEmpty();
        assertThat(cleared.get("effectiveLimit").isNull()).isTrue();
        assertThat(memberLimitRepository.findAllByCategory(groceries)).isEmpty();

        JsonNode plain = json(update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", "300.00", List.of()))
                .andExpect(status().isOk()).andReturn());
        assertThat(plain.get("effectiveLimit").decimalValue()).isEqualByComparingTo("300.00");
    }

    // Entries are replaced as a set (implicit-requirement dimension "Idempotency / retry").
    @Test
    void updateReplacesThePerMemberLimitsAsASet() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));

        update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null, limits(owner.getId(), "300.00")))
                .andExpect(status().isOk());

        Map<Long, BigDecimal> stored = storedAmounts(groceries);
        assertThat(stored).containsOnlyKeys(owner.getId());
        assertThat(stored.get(owner.getId())).isEqualByComparingTo("300.00");
    }

    // AC 7
    @Test
    void perMemberLimitForAUserWhoIsNotAnActiveMemberIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User stranger = fixtures.aUser();

        create(plan, owner, body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00", stranger.getId(), "140.00")))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 8
    @Test
    void perMemberLimitsListingTheSameMemberTwiceAreRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00", owner.getId(), "140.00")))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 9
    @Test
    void negativePerMemberLimitIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("DEBIT", "Groceries", null, limits(owner.getId(), "-1.00")))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 10 (CREDIT)
    @Test
    void perMemberLimitsOnACreditCategoryAreRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        create(plan, owner, body("CREDIT", "Salary", null, limits(owner.getId(), "100.00")))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).isEmpty();
    }

    // AC 10 (owned; a child inherits its parent's owner)
    @Test
    void perMemberLimitsOnAnOwnedCategoryAreRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory professional = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Professional");
        professional.setOwner(owner);
        categoryRepository.save(professional);

        Map<String, Object> ownedUpdate = body("DEBIT", "Professional", null, limits(owner.getId(), "100.00"));
        ownedUpdate.put("ownerId", owner.getId()); // PUT is a full replace: the owner is resent (CAT-15)
        update(plan, owner, professional.getId(), ownedUpdate)
                .andExpect(status().isBadRequest());
        create(plan, owner, body("DEBIT", "Courses", null, limits(owner.getId(), "100.00"), professional.getId()))
                .andExpect(status().isBadRequest());

        assertThat(memberLimitRepository.findAllByCategory(professional)).isEmpty();
        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(1);
    }

    // Failure / partial-failure: one invalid entry rejects the whole request and changes nothing.
    @Test
    void invalidEntryOnUpdateLeavesTheStoredLimitsUnchanged() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User stranger = fixtures.aUser();
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00"));

        update(plan, owner, groceries.getId(), body("DEBIT", "Renamed", null,
                limits(owner.getId(), "300.00", stranger.getId(), "100.00")))
                .andExpect(status().isBadRequest());

        Map<Long, BigDecimal> stored = storedAmounts(groceries);
        assertThat(stored).containsOnlyKeys(owner.getId());
        assertThat(stored.get(owner.getId())).isEqualByComparingTo("260.00");
        assertThat(categoryRepository.findById(groceries.getId()).orElseThrow().getDescription()).isEqualTo("Groceries");
    }

    // AC 11
    @Test
    void formerMembersEntryIsKeptButShownInactiveAndLeftOutOfTheSum() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));

        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode fetched = json(fetch(plan, owner, groceries.getId()).andExpect(status().isOk()).andReturn());
        assertThat(fetched.get("effectiveLimit").decimalValue()).isEqualByComparingTo("260.00");
        JsonNode partnerEntry = entryFor(fetched, partner.getId());
        assertThat(partnerEntry.get("active").asBoolean()).isFalse();
        assertThat(partnerEntry.get("amount").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(entryFor(fetched, owner.getId()).get("active").asBoolean()).isTrue();
        assertThat(storedAmounts(groceries)).containsKeys(owner.getId(), partner.getId());
    }

    // AC 11 (dormant entry kept on an update that sends it back unchanged, or omits the list)
    @Test
    void formerMembersEntrySurvivesUpdatesThatKeepIt() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null, null))
                .andExpect(status().isOk());
        update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null,
                limits(owner.getId(), "280.00", partner.getId(), "140.00")))
                .andExpect(status().isOk());

        Map<Long, BigDecimal> stored = storedAmounts(groceries);
        assertThat(stored.get(owner.getId())).isEqualByComparingTo("280.00");
        assertThat(stored.get(partner.getId())).isEqualByComparingTo("140.00");
    }

    // AC 7 + 11: a former member's entry can be kept or removed, never changed.
    @Test
    void changingAFormerMembersAmountIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00", partner.getId(), "200.00")))
                .andExpect(status().isBadRequest());

        assertThat(storedAmounts(groceries).get(partner.getId())).isEqualByComparingTo("140.00");
    }

    // AC 12
    @Test
    void removedMemberWhoIsReInvitedGetsTheirEntryBackActiveWithTheSameAmount() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));

        removeMember(plan, owner, partner).andExpect(status().isNoContent());
        String token = createLinkInvitation(plan, owner);
        mockMvc.perform(post(ApiRoutes.INVITATION + "/{token}/accept", token).with(testAuthHelper.asUser(partner)))
                .andExpect(status().isCreated());

        JsonNode fetched = json(fetch(plan, owner, groceries.getId()).andExpect(status().isOk()).andReturn());
        JsonNode partnerEntry = entryFor(fetched, partner.getId());
        assertThat(partnerEntry.get("active").asBoolean()).isTrue();
        assertThat(partnerEntry.get("amount").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(fetched.get("effectiveLimit").decimalValue()).isEqualByComparingTo("400.00");
    }

    // AC 13
    @Test
    void ownerRemovingAFormerMembersEntryDeletesIt() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = categoryWithLimits(plan, Map.of(owner, "260.00", partner, "140.00"));
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode updated = json(update(plan, owner, groceries.getId(), body("DEBIT", "Groceries", null,
                limits(owner.getId(), "260.00")))
                .andExpect(status().isOk()).andReturn());

        assertThat(updated.get("memberLimits")).hasSize(1);
        assertThat(storedAmounts(groceries)).containsOnlyKeys(owner.getId());
    }

    // CAT-04 / AD-004: only the OWNER manages categories, per-member limits included.
    @Test
    void nonOwnerSettingPerMemberLimitsIsRejectedWith403() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        FinancialTransactionCategory groceries = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");

        update(plan, editor, groceries.getId(), body("DEBIT", "Groceries", null, limits(editor.getId(), "100.00")))
                .andExpect(status().isForbidden());

        assertThat(memberLimitRepository.findAllByCategory(groceries)).isEmpty();
    }

    private FinancialTransactionCategory categoryWithLimits(Plan plan, Map<User, String> amounts) {
        FinancialTransactionCategory category = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries");
        amounts.forEach((member, amount) -> {
            CategoryMemberLimit entry = new CategoryMemberLimit();
            entry.setCategory(category);
            entry.setMember(member);
            entry.setAmount(new BigDecimal(amount));
            memberLimitRepository.save(entry);
        });
        return category;
    }

    private Map<Long, BigDecimal> storedAmounts(FinancialTransactionCategory category) {
        Map<Long, BigDecimal> amounts = new HashMap<>();
        memberLimitRepository.findAllByCategory(category)
                .forEach(entry -> amounts.put(entry.getMember().getId(), entry.getAmount()));
        return amounts;
    }

    private static JsonNode entryFor(JsonNode category, Long memberId) {
        for (JsonNode entry : category.get("memberLimits")) {
            if (entry.get("memberId").asLong() == memberId) {
                return entry;
            }
        }
        throw new AssertionError("No member limit entry for member " + memberId);
    }

    private static List<Map<String, Object>> limits(Object... memberIdAndAmount) {
        List<Map<String, Object>> entries = new ArrayList<>();
        for (int i = 0; i < memberIdAndAmount.length; i += 2) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("memberId", memberIdAndAmount[i]);
            entry.put("amount", new BigDecimal((String) memberIdAndAmount[i + 1]));
            entries.add(entry);
        }
        return entries;
    }

    private static Map<String, Object> body(String type, String description, String spendingLimit,
                                            List<Map<String, Object>> memberLimits) {
        return body(type, description, spendingLimit, memberLimits, null);
    }

    private static Map<String, Object> body(String type, String description, String spendingLimit,
                                            List<Map<String, Object>> memberLimits, Long parentId) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", type);
        body.put("description", description);
        body.put("spendingLimit", spendingLimit == null ? null : new BigDecimal(spendingLimit));
        body.put("parentId", parentId);
        if (memberLimits != null) {
            body.put("memberLimits", memberLimits);
        }
        return body;
    }

    private JsonNode json(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private String createLinkInvitation(Plan plan, User owner) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("role", PlanRole.EDITOR.name());
        body.put("type", "LINK");
        MvcResult result = mockMvc.perform(post(ApiRoutes.PLAN_INVITATION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
        return json(result).get("token").asText();
    }

    private ResultActions removeMember(Plan plan, User asUser, User member) throws Exception {
        return mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}/members/{userId}", plan.getId(), member.getId())
                .with(testAuthHelper.asUser(asUser)));
    }

    private ResultActions fetch(Plan plan, User asUser, Long id) throws Exception {
        return mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser)));
    }

    private ResultActions create(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        return mockMvc.perform(post(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY, plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions update(Plan plan, User asUser, Long id, Map<String, Object> body) throws Exception {
        return mockMvc.perform(put(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }
}
