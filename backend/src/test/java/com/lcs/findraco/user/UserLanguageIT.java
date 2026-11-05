package com.lcs.findraco.user;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;

class UserLanguageIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void storesTheLanguageAndReturnsIt() throws Exception {
        User user = fixtures.aUser();
        mockMvc.perform(get(UserRoutes.USER + "/me").with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.language").isEmpty());

        setLanguage(user, "{\"language\":\"pt-BR\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.language").value("pt-BR"));

        assertThat(storedLanguage(user)).isEqualTo("pt-BR");
        mockMvc.perform(get(UserRoutes.USER + "/me").with(testAuthHelper.asUser(user)))
                .andExpect(jsonPath("$.language").value("pt-BR"));
    }

    @Test
    void rejectsAnUnknownLanguage() throws Exception {
        User user = fixtures.aUser();
        setLanguage(user, "{\"language\":\"en\"}").andExpect(status().isOk());

        setLanguage(user, "{\"language\":\"fr\"}")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
        setLanguage(user, "{}").andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));

        assertThat(storedLanguage(user)).isEqualTo("en");
    }

    private ResultActions setLanguage(User user, String body) throws Exception {
        return mockMvc.perform(patch(UserRoutes.LANGUAGE)
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    private String storedLanguage(User user) {
        return jdbc.queryForObject("SELECT language FROM users WHERE id = ?", String.class, user.getId());
    }
}
