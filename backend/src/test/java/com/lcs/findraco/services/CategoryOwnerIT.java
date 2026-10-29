package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransaction;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Through-the-API proof of owned categories (spec P3 "Owned categories", AC 1-4, 7, 8; CAT-14,
 * CAT-15): an owner is set on roots only, must be an active member, is inherited by children, stays
 * dormant when they leave the plan and applies again when they rejoin.
 */
class CategoryOwnerIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialTransactionCategoryRepository categoryRepository;

    @Autowired
    private CategoryMemberLimitRepository memberLimitRepository;

    // AC 1
    @Test
    void ownerSetsAnOwnerOnARootAndItIsStored() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        JsonNode created = json(create(plan, owner, body("Professional", null, partner.getId()))
                .andExpect(status().isCreated()).andReturn());

        assertThat(created.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(created.get("ownerName").asString()).isEqualTo(partner.getName());
        assertThat(created.get("ownerActive").asBoolean()).isTrue();
        FinancialTransactionCategory persisted = categoryRepository.findById(created.get("id").asLong()).orElseThrow();
        assertThat(persisted.getOwner().getId()).isEqualTo(partner.getId());
    }

    // AC 1 (edit) + AC 7 (clear)
    @Test
    void ownerSetsAndClearsTheOwnerOfAnExistingRoot() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory professional = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Professional");

        JsonNode owned = json(update(plan, owner, professional.getId(), body("Professional", null, owner.getId()))
                .andExpect(status().isOk()).andReturn());
        assertThat(owned.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(categoryRepository.findById(professional.getId()).orElseThrow().getOwner().getId())
                .isEqualTo(owner.getId());

        JsonNode shared = json(update(plan, owner, professional.getId(), body("Professional", null, null))
                .andExpect(status().isOk()).andReturn());
        assertThat(shared.get("ownerId").isNull()).isTrue();
        assertThat(shared.get("ownerActive").isNull()).isTrue();
        assertThat(categoryRepository.findById(professional.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 2
    @Test
    void childReportsTheOwnerOfItsParent() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory professional = ownedCategory(plan, "Professional", owner);
        FinancialTransactionCategory courses = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Courses", professional);

        JsonNode fetched = json(fetch(plan, owner, courses.getId()).andExpect(status().isOk()).andReturn());

        assertThat(fetched.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(fetched.get("ownerActive").asBoolean()).isTrue();
        assertThat(categoryRepository.findById(courses.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 3
    @Test
    void ownerSentForAChildIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory delivery = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Delivery", food);

        create(plan, owner, body("Dining out", food.getId(), owner.getId()))
                .andExpect(status().isBadRequest());
        update(plan, owner, delivery.getId(), body("Delivery", food.getId(), owner.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 4
    @Test
    void ownerWhoIsNotAnActiveMemberIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User stranger = fixtures.aUser();
        FinancialTransactionCategory rent = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");

        create(plan, owner, body("Professional", null, stranger.getId()))
                .andExpect(status().isBadRequest());
        update(plan, owner, rent.getId(), body("Rent", null, stranger.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(1);
        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 7: a removed owner is kept and shown as a former member.
    @Test
    void removedOwnerIsKeptAndShownInactive() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory professional = ownedCategory(plan, "Professional", partner);

        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode fetched = json(fetch(plan, owner, professional.getId()).andExpect(status().isOk()).andReturn());
        assertThat(fetched.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(fetched.get("ownerActive").asBoolean()).isFalse();
        assertThat(categoryRepository.findById(professional.getId()).orElseThrow().getOwner().getId())
                .isEqualTo(partner.getId());
    }

    // AC 7: the OWNER may keep, change or clear a former member's ownership.
    @Test
    void formerMembersOwnershipCanBeKeptChangedOrCleared() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory professional = ownedCategory(plan, "Professional", partner);
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode kept = json(update(plan, owner, professional.getId(), body("Professional", null, partner.getId()))
                .andExpect(status().isOk()).andReturn());
        assertThat(kept.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(kept.get("ownerActive").asBoolean()).isFalse();

        JsonNode changed = json(update(plan, owner, professional.getId(), body("Professional", null, owner.getId()))
                .andExpect(status().isOk()).andReturn());
        assertThat(changed.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(changed.get("ownerActive").asBoolean()).isTrue();

        update(plan, owner, professional.getId(), body("Professional", null, null))
                .andExpect(status().isOk());
        assertThat(categoryRepository.findById(professional.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 7: once changed away, a former member cannot be set back as owner.
    @Test
    void formerMemberCannotBecomeTheOwnerOfAnotherCategory() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        ownedCategory(plan, "Professional", partner);
        FinancialTransactionCategory rent = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        update(plan, owner, rent.getId(), body("Rent", null, partner.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner()).isNull();
    }

    // AC 7: when the owner rejoins, the ownership applies again.
    @Test
    void ownerWhoRejoinsIsActiveAgainWithoutReconfiguration() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        FinancialTransactionCategory professional = ownedCategory(plan, "Professional", partner);

        removeMember(plan, owner, partner).andExpect(status().isNoContent());
        String token = createLinkInvitation(plan, owner);
        mockMvc.perform(post(ApiRoutes.INVITATION + "/{token}/accept", token).with(testAuthHelper.asUser(partner)))
                .andExpect(status().isCreated());

        JsonNode fetched = json(fetch(plan, owner, professional.getId()).andExpect(status().isOk()).andReturn());
        assertThat(fetched.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(fetched.get("ownerActive").asBoolean()).isTrue();
    }

    // AC 8: every member sees owned categories and their transactions.
    @Test
    void ownedCategoriesAndTheirTransactionsAreVisibleToEveryMember() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        FinancialTransactionCategory professional = ownedCategory(plan, "Professional", owner);
        FinancialTransaction course = fixtures.aTransaction(
                plan, owner, new BigDecimal("80.00"), FinancialTransactionType.DEBIT, professional);

        JsonNode categories = json(mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY, plan.getId())
                        .with(testAuthHelper.asUser(viewer)))
                .andExpect(status().isOk()).andReturn());
        List<JsonNode> listed = StreamSupport.stream(categories.get("content").spliterator(), false).toList();
        assertThat(listed).singleElement().satisfies(category -> {
            assertThat(category.get("id").asLong()).isEqualTo(professional.getId());
            assertThat(category.get("ownerId").asLong()).isEqualTo(owner.getId());
        });

        JsonNode transactions = json(mockMvc.perform(get(ApiRoutes.FINANCIAL_TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(viewer)))
                .andExpect(status().isOk()).andReturn());
        assertThat(StreamSupport.stream(transactions.get("content").spliterator(), false)
                .map(transaction -> transaction.get("id").asLong()))
                .containsExactly(course.getId());
    }

    // P2 AC 10 through inheritance: a root whose children have per-member limits cannot become owned.
    @Test
    void ownerOnARootWhoseChildHasPerMemberLimitsIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        FinancialTransactionCategory food = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Food");
        FinancialTransactionCategory groceries = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Groceries", food);
        CategoryMemberLimit entry = new CategoryMemberLimit();
        entry.setCategory(groceries);
        entry.setMember(owner);
        entry.setAmount(new BigDecimal("260.00"));
        memberLimitRepository.save(entry);

        update(plan, owner, food.getId(), body("Food", null, owner.getId()))
                .andExpect(status().isBadRequest());

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getOwner()).isNull();
    }

    // CAT-04 / AD-004: only the OWNER manages categories, owners included.
    @Test
    void nonOwnerSettingAnOwnerIsRejectedWith403() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        FinancialTransactionCategory rent = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, "Rent");

        update(plan, editor, rent.getId(), body("Rent", null, editor.getId()))
                .andExpect(status().isForbidden());

        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner()).isNull();
    }

    private FinancialTransactionCategory ownedCategory(Plan plan, String name, User member) {
        FinancialTransactionCategory category = fixtures.aCategory(plan, FinancialTransactionType.DEBIT, name);
        category.setOwner(member);
        return categoryRepository.save(category);
    }

    private static Map<String, Object> body(String description, Long parentId, Long ownerId) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", "DEBIT");
        body.put("description", description);
        body.put("parentId", parentId);
        body.put("ownerId", ownerId);
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
        return json(result).get("token").asString();
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
