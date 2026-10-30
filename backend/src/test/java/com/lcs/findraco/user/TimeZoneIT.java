package com.lcs.findraco.user;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.TimeZoneInterceptor;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;

class TimeZoneIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void aNewUserStartsAutomaticInTheDefaultZone() throws Exception {
        User user = fixtures.aUser();

        me(user, null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timeZone").value("America/Sao_Paulo"))
                .andExpect(jsonPath("$.timeZoneMode").value("AUTOMATIC"));
    }

    @Test
    void aValidHeaderIsStoredWhileAutomatic() throws Exception {
        User user = fixtures.aUser();

        me(user, "Asia/Tokyo").andExpect(status().isOk());

        assertThat(storedZone(user)).isEqualTo("Asia/Tokyo");
        me(user, null).andExpect(jsonPath("$.timeZone").value("Asia/Tokyo"));
    }

    @Test
    void anInvalidHeaderIsIgnored() throws Exception {
        User user = fixtures.aUser();

        for (String invalid : new String[] {"Mars/Olympus_Mons", "+03:00", "not a zone", ""}) {
            me(user, invalid).andExpect(status().isOk());
        }

        assertThat(storedZone(user)).isEqualTo("America/Sao_Paulo");
    }

    @Test
    void aPinnedZoneIsNotOverwrittenByTheHeader() throws Exception {
        User user = fixtures.aUser();
        setTimeZone(user, "{\"mode\":\"PINNED\",\"zone\":\"Europe/Lisbon\"}", null)
                .andExpect(status().isOk());

        me(user, "Asia/Tokyo").andExpect(status().isOk());

        assertThat(storedZone(user)).isEqualTo("Europe/Lisbon");
    }

    @Test
    void goingBackToAutomaticLetsTheNextHeaderThrough() throws Exception {
        User user = fixtures.aUser();
        setTimeZone(user, "{\"mode\":\"PINNED\",\"zone\":\"Europe/Lisbon\"}", null);

        setTimeZone(user, "{\"mode\":\"AUTOMATIC\"}", null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timeZoneMode").value("AUTOMATIC"));
        me(user, "Asia/Tokyo");

        assertThat(storedZone(user)).isEqualTo("Asia/Tokyo");
    }

    @Test
    void pinningNeedsAnIanaZone() throws Exception {
        User user = fixtures.aUser();

        setTimeZone(user, "{\"mode\":\"PINNED\"}", null)
                .andExpect(problem(HttpStatus.BAD_REQUEST, "malformed-request"));
        setTimeZone(user, "{\"mode\":\"PINNED\",\"zone\":\"+03:00\"}", null)
                .andExpect(problem(HttpStatus.BAD_REQUEST, "malformed-request"));
        setTimeZone(user, "{\"zone\":\"Europe/Lisbon\"}", null)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
    }

    @Test
    void anUnauthenticatedRequestWritesNothing() throws Exception {
        User user = fixtures.aUser();

        mockMvc.perform(get(UserRoutes.USER + "/me").header(TimeZoneInterceptor.HEADER, "Asia/Tokyo"))
                .andExpect(status().isUnauthorized());

        assertThat(storedZone(user)).isEqualTo("America/Sao_Paulo");
    }

    private ResultActions me(User user, String header) throws Exception {
        var request = get(UserRoutes.USER + "/me").with(testAuthHelper.asUser(user));
        if (header != null) {
            request.header(TimeZoneInterceptor.HEADER, header);
        }
        return mockMvc.perform(request);
    }

    private ResultActions setTimeZone(User user, String body, String header) throws Exception {
        var request = patch(UserRoutes.TIME_ZONE)
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body);
        if (header != null) {
            request.header(TimeZoneInterceptor.HEADER, header);
        }
        return mockMvc.perform(request);
    }

    private String storedZone(User user) {
        return jdbc.queryForObject("SELECT time_zone FROM users WHERE id = ?", String.class, user.getId());
    }
}
