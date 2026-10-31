package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.controller.PlanContextArgumentResolver;
import com.lcs.findraco.plan.controller.PlanRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Drives the real security filter chain + {@link PlanContextArgumentResolver} +
 * {@link PlanAuthorization} end-to-end (real JWTs via {@code testAuthHelper.asUser}, no
 * {@code @WithMockUser} — see design TD-6) across the full role matrix: OWNER / EDITOR /
 * CONTRIBUTOR / VIEWER / non-member, for the five representative actions read, create,
 * edit-own, edit-others and manage-plan. Per AD-004: everyone on a plan can read everything,
 * a CONTRIBUTOR may only edit their own rows, only the OWNER manages the plan, and a
 * non-member must see 404 (not 403) so plan existence never leaks. The permission flags in the plan and
 * transaction responses agree with the endpoints: false if and only if the call is refused.
 */
class PlanAuthorizationMatrixIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    record PlanCast(Plan plan, User owner, User editor, User contributor, User viewer, User nonMember) {}

    private PlanCast castPlan() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = fixtures.aUser();
        User contributor = fixtures.aUser();
        User viewer = fixtures.aUser();
        User nonMember = fixtures.aUser();
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        return new PlanCast(plan, owner, editor, contributor, viewer, nonMember);
    }

    @Test
    void readAllowedForEveryRoleRegardlessOfRowOwnership() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("50.00"), TransactionType.DEBIT);

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor(), cast.viewer())) {
            mockMvc.perform(get(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    tx.getId())
                            .with(testAuthHelper.asUser(member)))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void readDeniedForNonMemberAsNotFoundNotForbidden() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("50.00"), TransactionType.DEBIT);

        mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), tx.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
    }

    @Test
    void createAllowedForOwnerEditorAndContributor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor())) {
            mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionBody("30.00", "Groceries")))
                    .andExpect(status().isCreated());
        }
    }

    @Test
    void createDeniedForViewerAndLeavesNoPartialRow() throws Exception {
        PlanCast cast = castPlan();
        long countBefore = transactionRepository.count();

        mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionBody("30.00", "Groceries")))
                .andExpect(status().isForbidden());

        assertThat(transactionRepository.count()).isEqualTo(countBefore);
    }

    @Test
    void createDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionBody("30.00", "Groceries")))
                .andExpect(status().isNotFound());
    }

    @Test
    void editOwnAllowedForOwnerEditorAndContributor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor())) {
            Transaction own =
                    fixtures.aTransaction(cast.plan(), member, new BigDecimal("40.00"), TransactionType.DEBIT);

            mockMvc.perform(put(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    own.getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionEditBody("41.00", "Updated by owner of the row")))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void editOwnDeniedForViewerEvenOnTheirOwnRow() throws Exception {
        // A VIEWER never legitimately creates a row, but PlanAuthorization#requireCanModifyTransaction
        // checks the role gate before row-ownership, so even a row a viewer happens to own is denied.
        PlanCast cast = castPlan();
        Transaction ownedByViewer =
                fixtures.aTransaction(cast.plan(), cast.viewer(), new BigDecimal("40.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByViewer.getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByViewer.getId(), "40.00");
    }

    @Test
    void editOthersAllowedForOwnerAndEditor() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor())) {
            Transaction ownedByContributor = fixtures.aTransaction(
                    cast.plan(), cast.contributor(), new BigDecimal("60.00"), TransactionType.DEBIT);

            mockMvc.perform(put(
                                    TransactionRoutes.TRANSACTION + "/{id}",
                                    cast.plan().getId(),
                                    ownedByContributor.getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(transactionEditBody("61.00", "Edited by non-owner-of-the-row")))
                    .andExpect(status().isOk());
        }
    }

    @Test
    void editOthersDeniedForContributorAndFailsClosedWithNoPartialWrite() throws Exception {
        PlanCast cast = castPlan();
        Transaction ownedByOwner =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                        .with(testAuthHelper.asUser(cast.contributor()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByOwner.getId(), "70.00");

        MvcResult getResult = mockMvc.perform(
                        get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                                .with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode persisted = objectMapper.readTree(getResult.getResponse().getContentAsString());
        assertThat(persisted.get("amount").decimalValue()).isEqualByComparingTo("70.00");
        assertThat(persisted.get("description").asString()).isEqualTo("Test transaction");
    }

    @Test
    void editOthersDeniedForViewer() throws Exception {
        PlanCast cast = castPlan();
        Transaction ownedByOwner =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), ownedByOwner.getId())
                        .with(testAuthHelper.asUser(cast.viewer()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isForbidden());

        assertUnchanged(ownedByOwner.getId(), "70.00");
    }

    @Test
    void editDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();
        Transaction tx =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("70.00"), TransactionType.DEBIT);

        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), tx.getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(transactionEditBody("999.00", "Should not persist")))
                .andExpect(status().isNotFound());

        assertUnchanged(tx.getId(), "70.00");
    }

    @Test
    void managePlanAllowedForOwnerOnly() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.owner()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Renamed by owner"))))
                .andExpect(status().isOk());
    }

    @Test
    void managePlanDeniedForNonOwnerMembers() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.editor(), cast.contributor(), cast.viewer())) {
            mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of("name", "Should not persist"))))
                    .andExpect(status().isForbidden());
        }

        mockMvc.perform(get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    JsonNode plan = objectMapper.readTree(result.getResponse().getContentAsString());
                    assertThat(plan.get("name").asString())
                            .isEqualTo(cast.plan().getName());
                });
    }

    @Test
    void managePlanDeniedForNonMemberAsNotFound() throws Exception {
        PlanCast cast = castPlan();

        mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                        .with(testAuthHelper.asUser(cast.nonMember()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Should not persist"))))
                .andExpect(status().isNotFound());
    }

    // ---- The matrix: every plan-scoped endpoint against every role ----

    enum Who {
        OWNER,
        EDITOR,
        CONTRIBUTOR,
        VIEWER,
        NON_MEMBER
    }

    /** Everything one call of the matrix needs: the cast, who calls, and one of each thing a route can address. */
    record Scene(
            PlanCast cast,
            User caller,
            User target,
            Transaction row,
            Category category,
            String seriesId,
            long seriesVersion,
            long invitationId) {}

    /** A route and the status each role gets; a non-member always gets 404 (the plan does not exist for them). */
    record Row(String key, Function<Scene, RequestBuilder> call, int owner, int editor, int contributor, int viewer) {

        int expected(Who who) {
            return switch (who) {
                case OWNER -> owner;
                case EDITOR -> editor;
                case CONTRIBUTOR -> contributor;
                case VIEWER -> viewer;
                case NON_MEMBER -> 404;
            };
        }
    }

    private static final LocalDate TODAY = LocalDate.of(2026, 7, 15);
    private static final String PLAN_ID = ApiRoutes.PLAN + "/{id}";
    private static final String TX = TransactionRoutes.TRANSACTION;
    private static final String CAT = CategoryRoutes.CATEGORY;

    /**
     * The routes that answer the same to every caller whatever their role on a plan: public, or about the caller
     * themselves, or addressed by a token. A new route lands here or in {@link #rows()}, never nowhere.
     */
    private static final Set<String> NOT_ROLE_SCOPED = Set.of(
            "POST " + ApiRoutes.PLAN,
            "GET " + ApiRoutes.PLAN,
            "GET " + PlanRoutes.INVITATION + "/{token}",
            "POST " + PlanRoutes.INVITATION + "/{token}/accept",
            "POST /api/findraco/auth/login",
            "POST /api/findraco/auth/refresh",
            "POST /api/findraco/auth/logout",
            "POST /api/findraco/auth/forgot-password",
            "GET /api/findraco/auth/reset-password/validate",
            "POST /api/findraco/auth/reset-password",
            "POST /api/findraco/user",
            "GET /api/findraco/user/me",
            "PUT /api/findraco/user",
            "PATCH /api/findraco/user/me/time-zone");

    private static List<Row> rows() {
        return List.of(
                new Row("GET " + PLAN_ID, s -> get(PLAN_ID, s.cast().plan().getId()), 200, 200, 200, 200),
                new Row(
                        "GET " + PLAN_ID + "/members",
                        s -> get(PLAN_ID + "/members", s.cast().plan().getId()),
                        200,
                        200,
                        200,
                        200),
                new Row(
                        "PUT " + PLAN_ID,
                        s -> put(PLAN_ID, s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"Renamed\"}"),
                        200,
                        403,
                        403,
                        403),
                // The owner of a plan holds a second plan, so the deletion is not the last-plan refusal.
                new Row(
                        "DELETE " + PLAN_ID,
                        s -> delete(PLAN_ID, s.cast().plan().getId()),
                        204,
                        403,
                        403,
                        403),
                // The owner cannot leave (409 last-owner); a member with another plan can.
                new Row(
                        "POST " + PLAN_ID + "/leave",
                        s -> post(PLAN_ID + "/leave", s.cast().plan().getId()),
                        409,
                        204,
                        204,
                        204),
                new Row(
                        "POST " + PLAN_ID + "/transfer",
                        s -> post(PLAN_ID + "/transfer", s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"newOwnerUserId\":" + s.target().getId() + "}"),
                        204,
                        403,
                        403,
                        403),
                new Row(
                        "PUT " + PLAN_ID + "/members/{userId}",
                        s -> put(
                                        PLAN_ID + "/members/{userId}",
                                        s.cast().plan().getId(),
                                        s.target().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"role\":\"VIEWER\"}"),
                        200,
                        403,
                        403,
                        403),
                new Row(
                        "DELETE " + PLAN_ID + "/members/{userId}",
                        s -> delete(
                                PLAN_ID + "/members/{userId}",
                                s.cast().plan().getId(),
                                s.target().getId()),
                        204,
                        403,
                        403,
                        403),
                new Row(
                        "POST " + PlanRoutes.PLAN_INVITATION,
                        s -> post(PlanRoutes.PLAN_INVITATION, s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"role\":\"EDITOR\",\"type\":\"LINK\"}"),
                        201,
                        403,
                        403,
                        403),
                new Row(
                        "GET " + PlanRoutes.PLAN_INVITATION,
                        s -> get(PlanRoutes.PLAN_INVITATION, s.cast().plan().getId()),
                        200,
                        403,
                        403,
                        403),
                new Row(
                        "DELETE " + PlanRoutes.PLAN_INVITATION + "/{invitationId}",
                        s -> delete(
                                PlanRoutes.PLAN_INVITATION + "/{invitationId}",
                                s.cast().plan().getId(),
                                s.invitationId()),
                        204,
                        403,
                        403,
                        403),
                new Row(
                        "GET " + TX + "/{id}",
                        s -> get(TX + "/{id}", s.cast().plan().getId(), s.row().getId()),
                        200,
                        200,
                        200,
                        200),
                new Row("GET " + TX, s -> get(TX, s.cast().plan().getId()), 200, 200, 200, 200),
                new Row(
                        "POST " + TX,
                        s -> post(TX, s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(transactionJson()),
                        201,
                        201,
                        201,
                        403),
                new Row(
                        "POST " + TX + "/series",
                        s -> post(TX + "/series", s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json(installment())),
                        201,
                        201,
                        201,
                        403),
                // The row belongs to the owner: a contributor edits and deletes only their own.
                new Row(
                        "PUT " + TX + "/{id}",
                        s -> put(TX + "/{id}", s.cast().plan().getId(), s.row().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(editJson()),
                        200,
                        200,
                        403,
                        403),
                new Row(
                        "POST " + TX + "/import",
                        s -> multipart(TX + "/import", s.cast().plan().getId())
                                .file(new MockMultipartFile(
                                        "file",
                                        "bank.csv",
                                        "text/csv",
                                        "date,amount,id,description\n15/07/2026,-50.00,ref-1,Coffee\n"
                                                .getBytes(StandardCharsets.UTF_8))),
                        201,
                        201,
                        201,
                        403),
                new Row(
                        "DELETE " + TX + "/{id}",
                        s -> delete(
                                TX + "/{id}", s.cast().plan().getId(), s.row().getId()),
                        204,
                        204,
                        403,
                        403),
                new Row(
                        "DELETE " + TX + "/series/{seriesId}",
                        s -> delete(TX + "/series/{seriesId}", s.cast().plan().getId(), s.seriesId())
                                .param("scope", "ALL"),
                        204,
                        204,
                        403,
                        403),
                new Row(
                        "GET " + TX + "/series/{seriesId}",
                        s -> get(TX + "/series/{seriesId}", s.cast().plan().getId(), s.seriesId()),
                        200,
                        200,
                        200,
                        200),
                new Row(
                        "PUT " + TX + "/series/{seriesId}",
                        s -> put(TX + "/series/{seriesId}", s.cast().plan().getId(), s.seriesId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json(editSeriesBody(s))),
                        200,
                        200,
                        403,
                        403),
                new Row(
                        "GET " + CAT + "/spending",
                        s -> get(CAT + "/spending", s.cast().plan().getId())
                                .param("startDate", "2026-01-01")
                                .param("endDate", "2026-12-31"),
                        200,
                        200,
                        200,
                        200),
                new Row(
                        "GET " + CAT + "/{id}",
                        s -> get(
                                CAT + "/{id}",
                                s.cast().plan().getId(),
                                s.category().getId()),
                        200,
                        200,
                        200,
                        200),
                new Row(
                        "GET " + CAT + "/{id}/usage",
                        s -> get(
                                CAT + "/{id}/usage",
                                s.cast().plan().getId(),
                                s.category().getId()),
                        200,
                        200,
                        200,
                        200),
                new Row("GET " + CAT, s -> get(CAT, s.cast().plan().getId()), 200, 200, 200, 200),
                new Row(
                        "POST " + CAT,
                        s -> post(CAT, s.cast().plan().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"type\":\"DEBIT\",\"description\":\"New category\"}"),
                        201,
                        403,
                        403,
                        403),
                new Row(
                        "PUT " + CAT + "/{id}",
                        s -> put(
                                        CAT + "/{id}",
                                        s.cast().plan().getId(),
                                        s.category().getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"type\":\"DEBIT\",\"description\":\"Renamed\",\"version\":0}"),
                        200,
                        403,
                        403,
                        403),
                new Row(
                        "DELETE " + CAT + "/{id}",
                        s -> delete(
                                CAT + "/{id}",
                                s.cast().plan().getId(),
                                s.category().getId()),
                        204,
                        403,
                        403,
                        403),
                new Row(
                        "GET " + DashboardRoutes.DASHBOARD,
                        s -> get(DashboardRoutes.DASHBOARD, s.cast().plan().getId())
                                .param("startDate", "2026-01-01")
                                .param("endDate", "2026-12-31"),
                        200,
                        200,
                        200,
                        200),
                new Row(
                        "GET " + DashboardRoutes.DASHBOARD + "/trend",
                        s -> get(
                                        DashboardRoutes.DASHBOARD + "/trend",
                                        s.cast().plan().getId())
                                .param("startDate", "2026-01-01")
                                .param("endDate", "2026-12-31"),
                        200,
                        200,
                        200,
                        200));
    }

    static Stream<Arguments> everyRouteForEveryRole() {
        return rows().stream()
                .flatMap(row ->
                        Stream.of(Who.values()).map(who -> Arguments.argumentSet(row.key() + " as " + who, row, who)));
    }

    @ParameterizedTest
    @MethodSource("everyRouteForEveryRole")
    void eachRouteAnswersEachRoleAsTheMatrixSays(Row row, Who who) throws Exception {
        Scene scene = scene(who);

        RequestBuilder call = row.call().apply(scene);
        RequestBuilder signedIn =
                context -> testAuthHelper.asUser(scene.caller()).postProcessRequest(call.buildRequest(context));
        int status = mockMvc.perform(signedIn).andReturn().getResponse().getStatus();

        assertThat(status).as("%s as %s", row.key(), who).isEqualTo(row.expected(who));
    }

    @Autowired
    @Qualifier("requestMappingHandlerMapping")
    private RequestMappingHandlerMapping handlerMapping;

    @Test
    void everyEndpointOfTheApplicationHasAMatrixRowOrIsListedAsNotRoleScoped() {
        Set<String> endpoints = new TreeSet<>();
        for (var entry : handlerMapping.getHandlerMethods().entrySet()) {
            HandlerMethod handler = entry.getValue();
            if (!handler.getBeanType().getPackageName().startsWith("com.lcs.findraco")
                    || handler.getBeanType().getSimpleName().equals("ProblemErrorController")) {
                continue;
            }
            RequestMappingInfo info = entry.getKey();
            for (String pattern : info.getPathPatternsCondition().getPatternValues()) {
                for (HttpMethod method : info.getMethodsCondition().getMethods().stream()
                        .map(m -> HttpMethod.valueOf(m.name()))
                        .toList()) {
                    endpoints.add(method + " " + pattern);
                }
            }
        }
        Set<String> covered = new TreeSet<>(NOT_ROLE_SCOPED);
        rows().forEach(row -> covered.add(row.key()));

        assertThat(endpoints).as("an endpoint without a matrix row").isSubsetOf(covered);
        assertThat(covered).as("a matrix row for a route that no longer exists").isSubsetOf(endpoints);
    }

    private Scene scene(Who who) throws Exception {
        PlanCast cast = castPlan();
        User target = fixtures.aUser();
        fixtures.addMember(cast.plan(), target, PlanRole.EDITOR);
        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor(), cast.viewer())) {
            fixtures.aPlan(member);
        }
        Transaction row =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("50.00"), TransactionType.DEBIT);
        Category category = fixtures.aCategory(cast.plan(), TransactionType.DEBIT, "Matrix");

        String seriesId = objectMapper
                .readTree(mockMvc.perform(post(TX + "/series", cast.plan().getId())
                                .with(testAuthHelper.asUser(cast.owner()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json(installment())))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString())
                .get("seriesId")
                .asString();
        long invitationId = objectMapper
                .readTree(mockMvc.perform(
                                post(PlanRoutes.PLAN_INVITATION, cast.plan().getId())
                                        .with(testAuthHelper.asUser(cast.owner()))
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content("{\"role\":\"VIEWER\",\"type\":\"LINK\"}"))
                        .andExpect(status().isCreated())
                        .andReturn()
                        .getResponse()
                        .getContentAsString())
                .get("id")
                .asLong();

        User caller =
                switch (who) {
                    case OWNER -> cast.owner();
                    case EDITOR -> cast.editor();
                    case CONTRIBUTOR -> cast.contributor();
                    case VIEWER -> cast.viewer();
                    case NON_MEMBER -> cast.nonMember();
                };
        return new Scene(cast, caller, target, row, category, seriesId, fixtures.seriesVersion(seriesId), invitationId);
    }

    private static Map<String, Object> editSeriesBody(Scene scene) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("scope", "ALL");
        body.put("series", installment());
        body.put("version", scene.seriesVersion());
        return body;
    }

    private static Map<String, Object> installment() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("100.00"));
        body.put("description", "Laptop");
        body.put("mode", "INSTALLMENT");
        body.put("startDate", TODAY.toString());
        body.put("parcelsNumber", 2);
        body.put("splitMode", "EQUAL");
        return body;
    }

    private static String json(Object value) {
        return new ObjectMapper().writeValueAsString(value);
    }

    private static String transactionJson() {
        return json(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("30.00"),
                "description",
                "Groceries",
                "startDate",
                TODAY.toString()));
    }

    private static String editJson() {
        return json(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("41.00"),
                "description",
                "Edited",
                "startDate",
                TODAY.toString(),
                "items",
                List.of(),
                "version",
                0));
    }

    // ---- Flags agree with the guards: for every role and action, false if and only if the call is refused ----

    @Test
    void planFlagsAgreeWithThePlanWideEndpointsForEveryRole() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.editor(), cast.contributor(), cast.viewer(), cast.owner(), cast.nonMember())) {
            JsonNode permissions = planPermissions(cast, member);

            assertAgree(
                    member,
                    "createTransactions",
                    permissions,
                    mockMvc.perform(
                            post(TransactionRoutes.TRANSACTION, cast.plan().getId())
                                    .with(testAuthHelper.asUser(member))
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(transactionBody("30.00", "Groceries"))));
            assertAgree(
                    member,
                    "attributeToOthers",
                    permissions,
                    mockMvc.perform(post(
                                    TransactionRoutes.TRANSACTION, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(attributedBody(cast.editor().equals(member) ? cast.owner() : cast.editor()))));
            assertAgree(
                    member,
                    "manageCategories",
                    permissions,
                    mockMvc.perform(post(CategoryRoutes.CATEGORY, cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(
                                    Map.of("type", "DEBIT", "description", "Food " + member.getId())))));
            // Renaming last: the owner's rename succeeds without changing anyone's role.
            assertAgree(
                    member,
                    "managePlan",
                    permissions,
                    mockMvc.perform(put(ApiRoutes.PLAN + "/{id}", cast.plan().getId())
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of("name", "Renamed")))));
        }
    }

    @Test
    void transactionFlagsAgreeWithEditAndDeleteForEveryRoleAndRow() throws Exception {
        PlanCast cast = castPlan();

        for (User member : List.of(cast.owner(), cast.editor(), cast.contributor(), cast.viewer())) {
            User other = member.equals(cast.owner()) ? cast.editor() : cast.owner();
            for (User rowCreator : List.of(member, other)) {
                Transaction row =
                        fixtures.aTransaction(cast.plan(), rowCreator, new BigDecimal("40.00"), TransactionType.DEBIT);
                JsonNode permissions = read(mockMvc.perform(get(
                                                TransactionRoutes.TRANSACTION + "/{id}",
                                                cast.plan().getId(),
                                                row.getId())
                                        .with(testAuthHelper.asUser(member)))
                                .andExpect(status().isOk()))
                        .get("permissions");

                assertAgree(
                        member,
                        "edit",
                        permissions,
                        mockMvc.perform(put(
                                        TransactionRoutes.TRANSACTION + "/{id}",
                                        cast.plan().getId(),
                                        row.getId())
                                .with(testAuthHelper.asUser(member))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(transactionEditBody("41.00", "Edited"))));
                assertAgree(
                        member,
                        "delete",
                        permissions,
                        mockMvc.perform(delete(
                                        TransactionRoutes.TRANSACTION + "/{id}",
                                        cast.plan().getId(),
                                        row.getId())
                                .with(testAuthHelper.asUser(member))));
            }
        }

        Transaction row =
                fixtures.aTransaction(cast.plan(), cast.owner(), new BigDecimal("40.00"), TransactionType.DEBIT);
        mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", cast.plan().getId(), row.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete(
                                TransactionRoutes.TRANSACTION + "/{id}",
                                cast.plan().getId(),
                                row.getId())
                        .with(testAuthHelper.asUser(cast.nonMember())))
                .andExpect(status().isNotFound());
    }

    @Test
    void planFlagsFollowTheRole() throws Exception {
        PlanCast cast = castPlan();

        JsonNode owner = read(mockMvc.perform(
                        get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(cast.owner())))
                .andExpect(status().isOk()));
        assertThat(owner.get("isDefault").isBoolean()).isTrue();
        assertThat(owner.get("permissions").properties())
                .extracting(Map.Entry::getKey)
                .containsExactlyInAnyOrder("createTransactions", "attributeToOthers", "manageCategories", "managePlan");

        assertThat(flags(planPermissions(cast, cast.owner()))).containsExactly(true, true, true, true);
        assertThat(flags(planPermissions(cast, cast.editor()))).containsExactly(true, true, false, false);
        assertThat(flags(planPermissions(cast, cast.contributor()))).containsExactly(true, false, false, false);
        assertThat(flags(planPermissions(cast, cast.viewer()))).containsExactly(false, false, false, false);
    }

    private static List<Boolean> flags(JsonNode permissions) {
        return List.of(
                permissions.get("createTransactions").asBoolean(),
                permissions.get("attributeToOthers").asBoolean(),
                permissions.get("manageCategories").asBoolean(),
                permissions.get("managePlan").asBoolean());
    }

    /** A member's flags from the plan they read; a non-member reads nothing (404), so every flag is false. */
    private JsonNode planPermissions(PlanCast cast, User member) throws Exception {
        MvcResult result = mockMvc.perform(
                        get(ApiRoutes.PLAN + "/{id}", cast.plan().getId()).with(testAuthHelper.asUser(member)))
                .andReturn();
        if (result.getResponse().getStatus() == 404) {
            return objectMapper.readTree("{}");
        }
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("permissions");
    }

    /** The flag is true exactly when the endpoint accepts the call (2xx); a refusal is 403, or 404 off the plan. */
    private static void assertAgree(User member, String flag, JsonNode permissions, ResultActions call) {
        int status = call.andReturn().getResponse().getStatus();
        boolean allowed = permissions.has(flag) && permissions.get(flag).asBoolean();
        assertThat(status >= 200 && status < 300)
                .as("user %d, %s: flag %s, status %d", member.getId(), flag, allowed, status)
                .isEqualTo(allowed);
        if (!allowed) {
            assertThat(status).as("user %d, %s refused", member.getId(), flag).isIn(403, 404);
        }
    }

    private JsonNode read(ResultActions call) throws Exception {
        return objectMapper.readTree(call.andReturn().getResponse().getContentAsString());
    }

    private String attributedBody(User attributedTo) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal("30.00"),
                "description",
                "For a partner",
                "startDate",
                today().toString(),
                "participants",
                List.of(Map.of("memberId", attributedTo.getId()))));
    }

    /** An edit of a transaction the test has just created, so at its first version. */
    private String transactionEditBody(String amount, String description) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                description,
                "startDate",
                today().toString(),
                "items",
                List.of(),
                "version",
                0));
    }

    private String transactionBody(String amount, String description) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "type",
                "DEBIT",
                "amount",
                new BigDecimal(amount),
                "description",
                description,
                "startDate",
                today().toString()));
    }

    private void assertUnchanged(Long transactionId, String expectedAmount) {
        Transaction reloaded = transactionRepository.findById(transactionId).orElseThrow();
        assertThat(reloaded.getAmount()).isEqualByComparingTo(expectedAmount);
        assertThat(reloaded.getDescription()).isEqualTo("Test transaction");
    }
}
