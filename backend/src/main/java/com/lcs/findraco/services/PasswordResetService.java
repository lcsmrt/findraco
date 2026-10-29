package com.lcs.findraco.services;

import com.lcs.findraco.config.AppProperties;
import com.lcs.findraco.dtos.request.ResetPasswordRequestDto;
import com.lcs.findraco.exceptions.UserExceptions;
import com.lcs.findraco.models.PasswordResetToken;
import com.lcs.findraco.repositories.PasswordResetTokenRepository;
import com.lcs.findraco.repositories.UserRepository;
import com.lcs.findraco.security.OpaqueTokens;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    public static final Duration TOKEN_TTL = Duration.ofMinutes(60);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final SessionService sessionService;
    private final Clock clock;
    private final String appUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            UserService userService,
            EmailService emailService,
            SessionService sessionService,
            Clock clock,
            AppProperties appProperties) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userService = userService;
        this.emailService = emailService;
        this.sessionService = sessionService;
        this.clock = clock;
        this.appUrl = appProperties.url();
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

            String token = OpaqueTokens.generate();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(OpaqueTokens.hash(token));
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

    /** Sets the new password, consumes the token (single use) and signs the user out everywhere. */
    @Transactional
    public void resetPassword(ResetPasswordRequestDto dto) {
        PasswordResetToken resetToken =
                findValidToken(dto.getToken()).orElseThrow(UserExceptions.InvalidPasswordResetTokenException::new);

        userService.changePassword(resetToken.getUser(), dto.getPassword());
        tokenRepository.deleteAllByUser(resetToken.getUser());
        sessionService.revokeAll(resetToken.getUser());
    }

    private Optional<PasswordResetToken> findValidToken(String token) {
        return tokenRepository
                .findByTokenHash(OpaqueTokens.hash(token))
                .filter(resetToken -> resetToken.getExpiresAt().isAfter(LocalDateTime.now(clock)));
    }
}
