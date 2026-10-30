package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.auth.model.PasswordResetToken;
import com.lcs.findraco.auth.repository.PasswordResetTokenRepository;
import com.lcs.findraco.auth.request.ResetPasswordRequest;
import com.lcs.findraco.shared.config.AppProperties;
import com.lcs.findraco.user.service.UserService;
import java.time.Clock;
import java.time.Duration;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    public static final Duration TOKEN_TTL = Duration.ofMinutes(60);

    private final PasswordResetTokenRepository tokenRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final SessionService sessionService;
    private final Clock clock;
    private final String appUrl;

    public PasswordResetService(
            PasswordResetTokenRepository tokenRepository,
            UserService userService,
            EmailService emailService,
            SessionService sessionService,
            Clock clock,
            AppProperties appProperties) {
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
        userService.findByEmail(email).ifPresent(user -> {
            tokenRepository.deleteAllByUser(user);

            String token = OpaqueTokens.generate();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(OpaqueTokens.hash(token));
            resetToken.setExpiresAt(clock.instant().plus(TOKEN_TTL));
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
    public void resetPassword(ResetPasswordRequest dto) {
        PasswordResetToken resetToken = findValidToken(dto.token())
                .orElseThrow(AuthenticationExceptions.InvalidPasswordResetTokenException::new);

        userService.changePassword(resetToken.getUser(), dto.password());
        tokenRepository.deleteAllByUser(resetToken.getUser());
        sessionService.revokeAll(resetToken.getUser());
    }

    private Optional<PasswordResetToken> findValidToken(String token) {
        return tokenRepository
                .findByTokenHash(OpaqueTokens.hash(token))
                .filter(resetToken -> resetToken.getExpiresAt().isAfter(clock.instant()));
    }
}
