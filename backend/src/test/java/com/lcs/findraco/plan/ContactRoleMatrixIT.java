package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.util.List;
import java.util.function.BiFunction;
import java.util.stream.Stream;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * Every contact route against every role: any member reads, only an OWNER or an EDITOR writes, a caller outside the plan
 * and a contact of another plan are not found.
 */
class ContactRoleMatrixIT extends AbstractIntegrationTest {

    enum Who {
        OWNER,
        EDITOR,
        CONTRIBUTOR,
        VIEWER,
        OUTSIDER
    }

    /** A route, built for a plan and the contact it addresses, and the status each member role gets. */
    record Row(
            String key,
            BiFunction<Plan, Contact, MockHttpServletRequestBuilder> call,
            int owner,
            int editor,
            int contributor,
            int viewer,
            boolean addressesAContact) {

        int expected(Who who) {
            return switch (who) {
                case OWNER -> owner;
                case EDITOR -> editor;
                case CONTRIBUTOR -> contributor;
                case VIEWER -> viewer;
                case OUTSIDER -> 404;
            };
        }
    }

    private static final String CONTACT = ContactRoutes.CONTACT;

    private static List<Row> rows() {
        return List.of(
                new Row("GET " + CONTACT, (plan, contact) -> get(CONTACT, plan.getId()), 200, 200, 200, 200, false),
                new Row(
                        "GET " + CONTACT + "/{id}/statement",
                        (plan, contact) -> get(CONTACT + "/{id}/statement", plan.getId(), contact.getId()),
                        200,
                        200,
                        200,
                        200,
                        true),
                new Row(
                        "POST " + CONTACT,
                        (plan, contact) -> post(CONTACT, plan.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"New\"}"),
                        201,
                        201,
                        403,
                        403,
                        false),
                new Row(
                        "PUT " + CONTACT + "/{id}",
                        (plan, contact) -> put(CONTACT + "/{id}", plan.getId(), contact.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"Renamed\",\"version\":0}"),
                        200,
                        200,
                        403,
                        403,
                        true),
                new Row(
                        "POST " + CONTACT + "/{id}/archive",
                        (plan, contact) -> post(CONTACT + "/{id}/archive", plan.getId(), contact.getId()),
                        200,
                        200,
                        403,
                        403,
                        true),
                new Row(
                        "POST " + CONTACT + "/{id}/unarchive",
                        (plan, contact) -> post(CONTACT + "/{id}/unarchive", plan.getId(), contact.getId()),
                        200,
                        200,
                        403,
                        403,
                        true),
                new Row(
                        "DELETE " + CONTACT + "/{id}",
                        (plan, contact) -> delete(CONTACT + "/{id}", plan.getId(), contact.getId()),
                        204,
                        204,
                        403,
                        403,
                        true));
    }

    static Stream<Arguments> everyRouteForEveryRole() {
        return rows().stream()
                .flatMap(row ->
                        Stream.of(Who.values()).map(who -> Arguments.argumentSet(row.key() + " as " + who, row, who)));
    }

    static Stream<Arguments> everyRouteThatAddressesAContact() {
        return rows().stream().filter(Row::addressesAContact).map(row -> Arguments.argumentSet(row.key(), row));
    }

    @ParameterizedTest
    @MethodSource("everyRouteForEveryRole")
    void eachRouteAnswersEachRoleAsTheMatrixSays(Row row, Who who) throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User editor = member(plan, PlanRole.EDITOR);
        User contributor = member(plan, PlanRole.CONTRIBUTOR);
        User viewer = member(plan, PlanRole.VIEWER);
        User outsider = fixtures.aUser();
        Contact contact = fixtures.aContact(plan, "Mãe");
        User caller =
                switch (who) {
                    case OWNER -> owner;
                    case EDITOR -> editor;
                    case CONTRIBUTOR -> contributor;
                    case VIEWER -> viewer;
                    case OUTSIDER -> outsider;
                };

        int status = mockMvc.perform(row.call().apply(plan, contact).with(testAuthHelper.asUser(caller)))
                .andReturn()
                .getResponse()
                .getStatus();

        assertThat(status).as("%s as %s", row.key(), who).isEqualTo(row.expected(who));
    }

    @ParameterizedTest
    @MethodSource("everyRouteThatAddressesAContact")
    void aContactOfAnotherPlanIsNotFoundWhoeverAsks(Row row) throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Plan other = fixtures.aPlan(owner);
        Contact foreign = fixtures.aContact(other, "Elsewhere");
        User editor = member(plan, PlanRole.EDITOR);

        for (User caller : List.of(owner, editor)) {
            int status = mockMvc.perform(row.call().apply(plan, foreign).with(testAuthHelper.asUser(caller)))
                    .andReturn()
                    .getResponse()
                    .getStatus();

            assertThat(status).as("%s by %s", row.key(), caller.getId()).isEqualTo(404);
        }
        assertThat(fixtures.contactVersion(foreign.getId())).isZero();
    }

    private User member(Plan plan, PlanRole role) {
        User user = fixtures.aUser();
        fixtures.addMember(plan, user, role);
        return user;
    }
}
