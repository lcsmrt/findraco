package com.lcs.findraco.category;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.MemberLimit;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
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
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of owned categories (spec P3 "Owned categories", AC 1-4, 7, 8; CAT-14,
 * CAT-15): an owner is set on roots only, must be an active member, is inherited by children, stays
 * dormant when they leave the plan and applies again when they rejoin.
 */
class CategoryOwnerIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    // AC 1
    @Test
    void ownerSetsAnOwnerOnARootAndItIsStored() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        JsonNode created = json(create(plan, owner, body("Professional", null, partner.getId()))
                .andExpect(status().isCreated())
                .andReturn());

        assertThat(created.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(created.get("ownerName").asString()).isEqualTo(partner.getName());
        assertThat(created.get("ownerActive").asBoolean()).isTrue();
        Category persisted =
                categoryRepository.findById(created.get("id").asLong()).orElseThrow();
        assertThat(persisted.getOwner().getId()).isEqualTo(partner.getId());
    }

    // AC 1 (edit) + AC 7 (clear)
    @Test
    void ownerSetsAndClearsTheOwnerOfAnExistingRoot() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category professional = fixtures.aCategory(plan, TransactionType.DEBIT, "Professional");

        JsonNode owned = json(update(plan, owner, professional.getId(), body("Professional", null, owner.getId()))
                .andExpect(status().isOk())
                .andReturn());
        assertThat(owned.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(categoryRepository
                        .findById(professional.getId())
                        .orElseThrow()
                        .getOwner()
                        .getId())
                .isEqualTo(owner.getId());

        JsonNode shared = json(update(plan, owner, professional.getId(), body("Professional", null, null))
                .andExpect(status().isOk())
                .andReturn());
        assertThat(shared.get("ownerId").isNull()).isTrue();
        assertThat(shared.get("ownerActive").isNull()).isTrue();
        assertThat(categoryRepository
                        .findById(professional.getId())
                        .orElseThrow()
                        .getOwner())
                .isNull();
    }

    // AC 2
    @Test
    void childReportsTheOwnerOfItsParent() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category professional = ownedCategory(plan, "Professional", owner);
        Category courses = fixtures.aCategory(plan, TransactionType.DEBIT, "Courses", professional);

        JsonNode fetched = json(
                fetch(plan, owner, courses.getId()).andExpect(status().isOk()).andReturn());

        assertThat(fetched.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(fetched.get("ownerActive").asBoolean()).isTrue();
        assertThat(categoryRepository.findById(courses.getId()).orElseThrow().getOwner())
                .isNull();
    }

    // AC 3
    @Test
    void ownerSentForAChildIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category delivery = fixtures.aCategory(plan, TransactionType.DEBIT, "Delivery", food);

        create(plan, owner, body("Dining out", food.getId(), owner.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-owner-on-subcategory"));
        update(plan, owner, delivery.getId(), body("Delivery", food.getId(), owner.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-owner-on-subcategory"));

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(2);
        assertThat(categoryRepository.findById(delivery.getId()).orElseThrow().getOwner())
                .isNull();
    }

    // AC 4
    @Test
    void ownerWhoIsNotAnActiveMemberIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User stranger = fixtures.aUser();
        Category rent = fixtures.aCategory(plan, TransactionType.DEBIT, "Rent");

        create(plan, owner, body("Professional", null, stranger.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-owner-not-member"));
        update(plan, owner, rent.getId(), body("Rent", null, stranger.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-owner-not-member"));

        assertThat(categoryRepository.findAllByPlan(plan)).hasSize(1);
        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner())
                .isNull();
    }

    // AC 7: a removed owner is kept and shown as a former member.
    @Test
    void removedOwnerIsKeptAndShownInactive() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Category professional = ownedCategory(plan, "Professional", partner);

        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode fetched = json(fetch(plan, owner, professional.getId())
                .andExpect(status().isOk())
                .andReturn());
        assertThat(fetched.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(fetched.get("ownerActive").asBoolean()).isFalse();
        assertThat(categoryRepository
                        .findById(professional.getId())
                        .orElseThrow()
                        .getOwner()
                        .getId())
                .isEqualTo(partner.getId());
    }

    // AC 7: the OWNER may keep, change or clear a former member's ownership.
    @Test
    void formerMembersOwnershipCanBeKeptChangedOrCleared() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Category professional = ownedCategory(plan, "Professional", partner);
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        JsonNode kept = json(update(plan, owner, professional.getId(), body("Professional", null, partner.getId()))
                .andExpect(status().isOk())
                .andReturn());
        assertThat(kept.get("ownerId").asLong()).isEqualTo(partner.getId());
        assertThat(kept.get("ownerActive").asBoolean()).isFalse();

        JsonNode changed = json(update(plan, owner, professional.getId(), body("Professional", null, owner.getId()))
                .andExpect(status().isOk())
                .andReturn());
        assertThat(changed.get("ownerId").asLong()).isEqualTo(owner.getId());
        assertThat(changed.get("ownerActive").asBoolean()).isTrue();

        update(plan, owner, professional.getId(), body("Professional", null, null))
                .andExpect(status().isOk());
        assertThat(categoryRepository
                        .findById(professional.getId())
                        .orElseThrow()
                        .getOwner())
                .isNull();
    }

    // AC 7: once changed away, a former member cannot be set back as owner.
    @Test
    void formerMemberCannotBecomeTheOwnerOfAnotherCategory() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        ownedCategory(plan, "Professional", partner);
        Category rent = fixtures.aCategory(plan, TransactionType.DEBIT, "Rent");
        removeMember(plan, owner, partner).andExpect(status().isNoContent());

        update(plan, owner, rent.getId(), body("Rent", null, partner.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-owner-not-member"));

        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner())
                .isNull();
    }

    // AC 7: when the owner rejoins, the ownership applies again.
    @Test
    void ownerWhoRejoinsIsActiveAgainWithoutReconfiguration() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Category professional = ownedCategory(plan, "Professional", partner);

        removeMember(plan, owner, partner).andExpect(status().isNoContent());
        String token = createLinkInvitation(plan, owner);
        mockMvc.perform(post(PlanRoutes.INVITATION + "/{token}/accept", token).with(testAuthHelper.asUser(partner)))
                .andExpect(status().isCreated());

        JsonNode fetched = json(fetch(plan, owner, professional.getId())
                .andExpect(status().isOk())
                .andReturn());
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
        Category professional = ownedCategory(plan, "Professional", owner);
        Transaction course =
                fixtures.aTransaction(plan, owner, new BigDecimal("80.00"), TransactionType.DEBIT, professional);

        JsonNode categories =
                json(mockMvc.perform(get(CategoryRoutes.CATEGORY, plan.getId()).with(testAuthHelper.asUser(viewer)))
                        .andExpect(status().isOk())
                        .andReturn());
        List<JsonNode> listed = StreamSupport.stream(categories.get("content").spliterator(), false)
                .toList();
        assertThat(listed).singleElement().satisfies(category -> {
            assertThat(category.get("id").asLong()).isEqualTo(professional.getId());
            assertThat(category.get("ownerId").asLong()).isEqualTo(owner.getId());
        });

        JsonNode transactions = json(
                mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(viewer)))
                        .andExpect(status().isOk())
                        .andReturn());
        assertThat(StreamSupport.stream(transactions.get("content").spliterator(), false)
                        .map(transaction -> transaction.get("id").asLong()))
                .containsExactly(course.getId());
    }

    // P2 AC 10 through inheritance: a root whose children have per-member limits cannot become owned.
    @Test
    void ownerOnARootWhoseChildHasPerMemberLimitsIsRejectedWith422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Category groceries = fixtures.aCategory(plan, TransactionType.DEBIT, "Groceries", food);
        groceries.changeLimits(null, List.of(new MemberLimit(owner, new BigDecimal("260.00"))));
        categoryRepository.save(groceries);

        update(plan, owner, food.getId(), body("Food", null, owner.getId()))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "category-member-limits-on-owned"));

        assertThat(categoryRepository.findById(food.getId()).orElseThrow().getOwner())
                .isNull();
    }

    // CAT-04 / AD-004: only the OWNER manages categories, owners included.
    @Test
    void nonOwnerSettingAnOwnerIsRejectedWith403() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        Category rent = fixtures.aCategory(plan, TransactionType.DEBIT, "Rent");

        update(plan, editor, rent.getId(), body("Rent", null, editor.getId())).andExpect(status().isForbidden());

        assertThat(categoryRepository.findById(rent.getId()).orElseThrow().getOwner())
                .isNull();
    }

    private Category ownedCategory(Plan plan, String name, User member) {
        Category category = fixtures.aCategory(plan, TransactionType.DEBIT, name);
        category.assignOwner(member);
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
        MvcResult result = mockMvc.perform(post(PlanRoutes.PLAN_INVITATION, plan.getId())
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
        return mockMvc.perform(
                get(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(asUser)));
    }

    private ResultActions create(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        return mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions update(Plan plan, User asUser, Long id, Map<String, Object> body) throws Exception {
        return mockMvc.perform(put(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }
}
