package com.lcs.findraco.auth;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

/** Argon2id for new hashes; BCrypt hashes written before the switch keep working and upgrade on login. */
class PasswordHashingIT extends AbstractIntegrationTest {

    private static final String ARGON2ID = "{argon2}$argon2id$";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    private String storedHash(User user) {
        return userRepository.findById(user.getId()).orElseThrow().getPassword();
    }

    @Test
    void aBcryptUserLogsInAndTheHashBecomesArgon2id() throws Exception {
        User user = fixtures.aUser();
        assertThat(storedHash(user)).startsWith("$2");

        login(user.getEmail(), "password").andExpect(status().isOk());

        assertThat(storedHash(user)).startsWith(ARGON2ID);
        login(user.getEmail(), "password").andExpect(status().isOk());
        login(user.getEmail(), "wrong-password").andExpect(status().isUnauthorized());
    }

    @Test
    void aWrongPasswordLeavesTheBcryptHashAsItWas() throws Exception {
        User user = fixtures.aUser();
        String before = storedHash(user);

        login(user.getEmail(), "wrong-password").andExpect(status().isUnauthorized());

        assertThat(storedHash(user)).isEqualTo(before);
    }

    @Test
    void aNewAccountIsHashedWithArgon2id() throws Exception {
        String email = "new-" + System.nanoTime() + "@test.com";

        mockMvc.perform(post(UserRoutes.USER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("name", "New User", "email", email, "password", "password123"))))
                .andExpect(status().isCreated());

        assertThat(userRepository.findByEmail(email).orElseThrow().getPassword())
                .startsWith(ARGON2ID);
        login(email, "password123").andExpect(status().isOk());
    }

    // BST-15 AC 1-4: the policy answers 422 with the code of the rule, and login normalises like sign-up.

    private ResultActions register(String email, String password) throws Exception {
        return mockMvc.perform(post(UserRoutes.USER)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("name", "New User", "email", email, "password", password))));
    }

    @Test
    void aTooShortPasswordIsRefusedWithItsCode() throws Exception {
        register("short-" + System.nanoTime() + "@test.com", "1234567")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[?(@.field == 'password')].code").value("PasswordLength"));
    }

    @Test
    void aPasswordWithAnInvisibleCharacterIsRefusedWithItsCode() throws Exception {
        register(
                        "zero-width-" + System.nanoTime() + "@test.com",
                        "pass" + new String(Character.toChars(0x200B)) + "word1")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"))
                .andExpect(jsonPath("$.errors[?(@.field == 'password')].code").value("PasswordCharacters"));
    }

    @Test
    void anAccentTypedAsTwoCodePointsSignsInWithTheSingleCodePointSpelling() throws Exception {
        String email = "accent-" + System.nanoTime() + "@test.com";
        String decomposed =
                "senha-ac" + new String(Character.toChars('c')) + new String(Character.toChars(0x327)) + "ao";
        String composed = "senha-ac" + new String(Character.toChars(0xE7)) + "ao";
        register(email, decomposed).andExpect(status().isCreated());

        login(email, composed).andExpect(status().isOk());
        login(email, decomposed).andExpect(status().isOk());
    }
}
