package com.lcs.findraco.support;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.JsonNode;

/** What the tool ITs share: a client signed in as a user, named plans, and the user's saved zone. */
public abstract class AbstractMcpIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private JWKSource<SecurityContext> jwkSource;

    @Autowired
    protected JdbcTemplate jdbc;

    protected McpClient clientOf(User user) {
        return new McpClient(mockMvc, McpClient.token(jwkSource, user));
    }

    protected Plan plan(User owner, String name, boolean isDefault) {
        Plan plan = fixtures.aPlan(owner);
        jdbc.update("UPDATE plans SET name = ?, is_default = ? WHERE id = ?", name, isDefault, plan.getId());
        return plan;
    }

    protected User userIn(String zone) {
        User user = fixtures.aUser();
        jdbc.update("UPDATE users SET time_zone = ? WHERE id = ?", zone, user.getId());
        return user;
    }

    /** The text of a tool result that is an error; fails when it is not one. */
    protected static String errorText(JsonNode result) {
        assertThat(result.path("isError").asBoolean())
                .as("isError of %s", result)
                .isTrue();
        return result.path("content").path(0).path("text").asString();
    }
}
