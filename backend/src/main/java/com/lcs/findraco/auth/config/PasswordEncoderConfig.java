package com.lcs.findraco.auth.config;

import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * The one {@link PasswordEncoder} of the application: sign-up, reset, login and the timing-attack dummy hash
 * all use this bean. New hashes are Argon2id (stored as {@code {argon2}$argon2id$...}, no length ceiling).
 * Hashes written before the switch have no {@code {id}} prefix and are BCrypt (cost 12): they still match,
 * and {@code DaoAuthenticationProvider} re-hashes them to Argon2id on the user's next successful login.
 */
@Configuration
public class PasswordEncoderConfig {

    static final String ARGON2 = "argon2";
    static final String BCRYPT = "bcrypt";
    private static final int BCRYPT_COST = 12;

    @Bean
    public PasswordEncoder passwordEncoder() {
        PasswordEncoder bcrypt = new BCryptPasswordEncoder(BCRYPT_COST);
        DelegatingPasswordEncoder encoder = new DelegatingPasswordEncoder(
                ARGON2, Map.of(ARGON2, Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8(), BCRYPT, bcrypt));
        encoder.setDefaultPasswordEncoderForMatches(bcrypt);
        return encoder;
    }
}
