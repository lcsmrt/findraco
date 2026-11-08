package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.user.model.User;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import tools.jackson.databind.JsonNode;

/** {@code list_plans}, how a tool finds its plan, and what every tool call does around its body. */
@Import(McpPlanToolsIT.ProbeToolsConfig.class)
class McpPlanToolsIT extends AbstractMcpIntegrationTest {

    /** Tools only this test knows: one that names the plan it resolved, one that fails the way a bug would. */
    @TestConfiguration
    static class ProbeToolsConfig {

        @Bean
        ProbeTools probeTools(McpToolRunner runner) {
            return new ProbeTools(runner);
        }
    }

    public static class ProbeTools {

        private final McpToolRunner runner;

        ProbeTools(McpToolRunner runner) {
            this.runner = runner;
        }

        @McpTool(name = "plan_probe", description = "Test tool: names the plan the call resolved to.")
        public CallToolResult planProbe(
                @McpToolParam(required = false, description = "The plan") String plan,
                @McpToolParam(required = false, description = "Free text the log must not carry") String description) {
            return runner.inPlan(
                    "plan_probe", plan, resolved -> Map.of("id", resolved.ctx().planId(), "name", resolved.name()));
        }

        @McpTool(name = "break_down", description = "Test tool: always fails unexpectedly.")
        public CallToolResult breakDown() {
            return runner.onUser("break_down", userId -> {
                throw new IllegalStateException("secret internals");
            });
        }
    }

    private static JsonNode row(JsonNode rows, String name) {
        for (JsonNode row : rows) {
            if (row.path("name").asString().equals(name)) {
                return row;
            }
        }
        throw new AssertionError("no row named " + name + " in " + rows);
    }

    @Test
    void listPlansShowsActivePlans() throws Exception {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        Plan home = plan(user, "Home", true);
        fixtures.addMember(plan(other, "Trip", false), user, PlanRole.VIEWER);
        Plan archived = plan(user, "Old", false);
        jdbc.update("UPDATE plans SET deleted_at = now() WHERE id = ?", archived.getId());

        JsonNode plans = clientOf(user).callJson("list_plans", Map.of());

        assertThat(plans).hasSize(2);
        JsonNode homeRow = row(plans, "Home");
        assertThat(homeRow.path("id").asLong()).isEqualTo(home.getId());
        assertThat(homeRow.path("role").asString()).isEqualTo("OWNER");
        assertThat(homeRow.path("isDefault").asBoolean()).isTrue();
        JsonNode tripRow = row(plans, "Trip");
        assertThat(tripRow.path("role").asString()).isEqualTo("VIEWER");
        assertThat(tripRow.path("isDefault").asBoolean()).isFalse();
    }

    @Test
    void planResolvesByDefaultNameOrId() throws Exception {
        User user = fixtures.aUser();
        Plan home = plan(user, "Home", true);
        Plan trip = plan(user, "Viagem à Praia", false);
        McpClient client = clientOf(user);

        assertThat(client.callJson("plan_probe", Map.of()).path("id").asLong()).isEqualTo(home.getId());
        assertThat(client.callJson("plan_probe", Map.of("plan", "viagem a praia"))
                        .path("id")
                        .asLong())
                .isEqualTo(trip.getId());
        assertThat(client.callJson("plan_probe", Map.of("plan", String.valueOf(trip.getId())))
                        .path("name")
                        .asString())
                .isEqualTo("Viagem à Praia");
    }

    @Test
    void unknownOrAmbiguousPlanIsToolError() throws Exception {
        User user = fixtures.aUser();
        User stranger = fixtures.aUser();
        plan(user, "Home", true);
        plan(user, "Twin", false);
        Plan twin = plan(user, "TWIN", false);
        Plan secret = plan(stranger, "Secret", true);
        McpClient client = clientOf(user);

        String unknown = errorText(client.callTool("plan_probe", Map.of("plan", "Nowhere")));
        assertThat(unknown).contains("Home", "Twin").doesNotContain("Secret");

        String ambiguous = errorText(client.callTool("plan_probe", Map.of("plan", "twin")));
        assertThat(ambiguous).contains("id " + twin.getId());

        String someoneElses = errorText(
                client.callTool("plan_probe", Map.of("plan", secret.getId().toString())));
        assertThat(someoneElses).contains("Home").doesNotContain("Secret");
        assertThat(errorText(client.callTool("plan_probe", Map.of("plan", "Secret"))))
                .contains("Home")
                .doesNotContain("id " + secret.getId());
    }

    @Test
    void unexpectedFailureIsGenericToolError() throws Exception {
        User user = fixtures.aUser();
        McpClient client = clientOf(user);

        try (CapturedLogs logs = CapturedLogs.of(McpToolRunner.class)) {
            String text = errorText(client.callTool("break_down", Map.of()));

            assertThat(text).matches("Something went wrong \\(ref [0-9a-f-]{36}\\)\\.");
            assertThat(logs.events())
                    .filteredOn(event -> event.getLevel() == Level.ERROR)
                    .singleElement()
                    .satisfies(event -> {
                        assertThat(event.getFormattedMessage()).contains("break_down", "user " + user.getId());
                        assertThat(event.getThrowableProxy().getMessage()).isEqualTo("secret internals");
                    });
        }
    }

    @Test
    void callLogOmitsArguments() throws Exception {
        User user = fixtures.aUser();
        Plan home = plan(user, "Home", true);
        McpClient client = clientOf(user);

        try (CapturedLogs logs = CapturedLogs.of(McpToolRunner.class)) {
            client.callJson("plan_probe", Map.of("description", "dentist 350.00"));

            assertThat(logs.events())
                    .filteredOn(event -> event.getLevel() == Level.INFO)
                    .singleElement()
                    .extracting(ILoggingEvent::getFormattedMessage)
                    .asString()
                    .matches("MCP tool=plan_probe user=%d plan=%d outcome=ok durationMs=\\d+"
                            .formatted(user.getId(), home.getId()))
                    .doesNotContain("dentist", "350");
        }
    }

    @Test
    void unknownArgumentIsToolError() throws Exception {
        User user = fixtures.aUser();
        plan(user, "Home", true);
        Plan trip = plan(user, "Trip", false);
        McpClient client = clientOf(user);

        assertThat(errorText(client.callTool("list_categories", Map.of("bogus", 1))))
                .contains("bogus");
        // A misspelled plan must not fall back to the default plan: nothing is created.
        assertThat(errorText(client.callTool(
                        "create_transaction",
                        Map.of("type", "DEBIT", "amount", 42, "description", "Posto", "plano", trip.getName()))))
                .contains("plano");
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isZero();
        // A tool that knows the argument still takes it.
        assertThat(client.callTool("list_categories", Map.of("plan", "Trip"))
                        .path("isError")
                        .asBoolean())
                .isFalse();
    }

    @Test
    void wrongTypeAndEnumErrorsAreEnglish() throws Exception {
        User user = fixtures.aUser();
        plan(user, "Home", true);
        McpClient client = clientOf(user);

        assertThat(errorText(client.callTool(
                        "create_transaction", Map.of("type", "DEBIT", "amount", "abc", "description", "Posto"))))
                .contains("/amount", "found", "expected");
        assertThat(errorText(client.callTool(
                        "create_transaction", Map.of("type", "SIDEWAYS", "amount", 42, "description", "Posto"))))
                .contains("/type");
    }
}
