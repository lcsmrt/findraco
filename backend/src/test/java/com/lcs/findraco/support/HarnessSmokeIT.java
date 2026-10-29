package com.lcs.findraco.support;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.user.model.User;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Proves the harness end to end: a real Postgres carrying the full Flyway chain,
 * ddl-auto=validate, truncate-between-tests isolation, and an authenticated MockMvc
 * round-trip.
 */
class HarnessSmokeIT extends AbstractIntegrationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ConfigurableEnvironment environment;

    @Test
    void bootsAgainstTheContainerWithTheFlywayChainApplied() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        Integer failedMigrations = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success = false", Integer.class);
        Integer appliedMigrations = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success = true", Integer.class);

        assertThat(failedMigrations).isZero();
        assertThat(appliedMigrations).isGreaterThan(0);
    }

    @Test
    void authenticatedRequestSucceedsAndUnauthenticatedIsRejected() throws Exception {
        User user = fixtures.aUser();

        mockMvc.perform(get(ApiRoutes.PLAN).with(testAuthHelper.asUser(user))).andExpect(status().is2xxSuccessful());

        mockMvc.perform(get(ApiRoutes.PLAN)).andExpect(status().is4xxClientError());
    }

    @Test
    void truncateAllIsolatesStateBetweenTests() {
        long userCountBeforeAnyFixtureInThisTest =
                new JdbcTemplate(dataSource).queryForObject("SELECT COUNT(*) FROM users", Long.class);

        assertThat(userCountBeforeAnyFixtureInThisTest)
                .as("truncateAll must have cleared users left over from the previous test method")
                .isZero();
    }

    @Test
    void neverReadsTheDevelopersDotEnv() {
        assertThat(environment.getPropertySources().stream().map(PropertySource::getName))
                .as("a test run must match CI, where backend/.env does not exist (and must never send real mail)")
                .noneMatch(name -> name.contains(".env"));
    }
}
