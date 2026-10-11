package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.ResetPasswordRequestDto;
import com.lcs.findraco.exceptions.UserExceptions;
import com.lcs.findraco.models.PasswordResetToken;
import com.lcs.findraco.repositories.PasswordResetTokenRepository;
import com.lcs.findraco.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class PasswordResetService {

    public static final Duration TOKEN_TTL = Duration.ofMinutes(60);

    private static final int TOKEN_BYTES = 32;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final Clock clock;
    private final String appUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            UserService userService,
            EmailService emailService,
            Clock clock,
            @Value("${app.url}") String appUrl
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userService = userService;
        this.emailService = emailService;
        this.clock = clock;
        this.appUrl = appUrl;
    }

    /**
     * Issues a reset link for the account, if one exists. Unknown emails are a silent no-op so
     * the response never reveals whether an account exists. Older links of the account stop
     * working: only the latest one is valid.
     */
    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteAllByUser(user);

            String token = generateToken();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(hash(token));
            resetToken.setExpiresAt(LocalDateTime.now(clock).plus(TOKEN_TTL));
            tokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), appUrl + "/reset-password?token=" + token);
        });
    }

    /** Checks a link without consuming it. */
    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        return findValidToken(token).isPresent();
    }

    /** Sets the new password and consumes the token (single use). */
    @Transactional
    public void resetPassword(ResetPasswordRequestDto dto) {
        PasswordResetToken resetToken = findValidToken(dto.getToken())
                .orElseThrow(UserExceptions.InvalidPasswordResetTokenException::new);

        userService.changePassword(resetToken.getUser(), dto.getPassword());
        tokenRepository.deleteAllByUser(resetToken.getUser());
    }

    private Optional<PasswordResetToken> findValidToken(String token) {
        return tokenRepository.findByTokenHash(hash(token))
                .filter(resetToken -> resetToken.getExpiresAt().isAfter(LocalDateTime.now(clock)));
    }

    private static String generateToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available.", exception);
        }
    }
}
