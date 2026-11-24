package com.lcs.findraco.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.ObjectMapper;

/** What a new account starts with, taken from the device that signs up, and what a recovered plan is called. */
class SignUpDefaultsIT extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private ObjectMapper objectMapper;

    @ParameterizedTest
    @CsvSource(
            value = {
                "'pt-BR,pt;q=0.9', Meu plano",
                "pt-PT, Meu plano",
                "en-US, My plan",
                "fr-FR, My plan",
                "NONE, My plan"
            },
            ignoreLeadingAndTrailingWhitespace = true)
    void namesFirstPlanFromDeviceLanguage(String acceptLanguage, String expectedName) throws Exception {
        MockHttpServletRequestBuilder request = signUp();
        if (!acceptLanguage.equals("NONE")) {
            request.header("Accept-Language", acceptLanguage);
        }

        long userId =
                idOf(mockMvc.perform(request).andExpect(status().isCreated()).andReturn());

        assertThat(planNamesOf(userId)).containsExactly(expectedName);
    }

    @ParameterizedTest
    @CsvSource(
            value = {"Europe/Lisbon, Europe/Lisbon", "Mars/Base, America/Sao_Paulo", "NONE, America/Sao_Paulo"},
            ignoreLeadingAndTrailingWhitespace = true)
    void storesDeviceTimeZone(String timeZone, String expectedZone) throws Exception {
        MockHttpServletRequestBuilder request = signUp();
        if (!timeZone.equals("NONE")) {
            request.header("Time-Zone", timeZone);
        }

        MvcResult result = mockMvc.perform(request)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.timeZone").value(expectedZone))
                .andReturn();

        assertThat(jdbc.queryForObject("SELECT time_zone FROM users WHERE id = ?", String.class, idOf(result)))
                .isEqualTo(expectedZone);
    }

    @ParameterizedTest
    @CsvSource(
            value = {"pt-BR, Meu plano", "en, My plan", "NONE, My plan"},
            ignoreLeadingAndTrailingWhitespace = true)
    void namesRecoveredPlanFromSavedLanguage(String savedLanguage, String expectedName) throws Exception {
        User owner = fixtures.aUser();
        Plan sharedPlan = fixtures.aPlan(owner);
        User member = fixtures.aUser();
        fixtures.addMember(sharedPlan, member, PlanRole.EDITOR);
        if (!savedLanguage.equals("NONE")) {
            mockMvc.perform(patch(UserRoutes.LANGUAGE)
                            .with(testAuthHelper.asUser(member))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of("language", savedLanguage))))
                    .andExpect(status().isOk());
        }

        mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}/members/{userId}", sharedPlan.getId(), member.getId())
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isNoContent());

        assertThat(planNamesOf(member.getId())).containsExactly(expectedName);
    }

    private MockHttpServletRequestBuilder signUp() throws Exception {
        return post(UserRoutes.USER)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "name", "New User",
                        "email", "new-" + UUID.randomUUID() + "@test.com",
                        "password", "password123")));
    }

    private long idOf(MvcResult signUpResult) throws Exception {
        return objectMapper
                .readTree(signUpResult.getResponse().getContentAsString())
                .get("id")
                .asLong();
    }

    /** The names the user sees on their plan list, read through the API as that user. */
    private List<String> planNamesOf(long userId) throws Exception {
        User user = userRepository.findById(userId).orElseThrow();
        String json = mockMvc.perform(get(ApiRoutes.PLAN).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(json).findValues("name").stream()
                .map(name -> name.asString())
                .toList();
    }
}
