package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.config.SessionProperties;
import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.auth.model.UserSession;
import com.lcs.findraco.auth.repository.UserSessionRepository;
import com.lcs.findraco.user.model.User;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Session lifecycle: a sign-in opens a family (one device's chain of session tokens); every
 * renewal rotates the token within that family and slides the expiry. A replaced token presented
 * again after the reuse grace window is treated as stolen and its whole family is revoked.
 */
@Service
public class SessionService {

    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    private final UserSessionRepository sessionRepository;
    private final JwtService jwtService;
    private final Clock clock;
    private final Duration ttl;
    private final Duration reuseGrace;

    public SessionService(
            UserSessionRepository sessionRepository, JwtService jwtService, Clock clock, SessionProperties properties) {
        this.sessionRepository = sessionRepository;
        this.jwtService = jwtService;
        this.clock = clock;
        this.ttl = properties.ttl();
        this.reuseGrace = properties.reuseGrace();
    }

    public record IssuedSession(String accessToken, String sessionToken) {}

    /** Starts a new session family for the user, dropping the user's expired session rows first. */
    @Transactional
    public IssuedSession open(User user) {
        Instant now = clock.instant();
        sessionRepository.deleteExpiredByUser(user, now);

        return issue(user, UUID.randomUUID(), now);
    }

    /**
     * Exchanges a session token for a new access token and a new session token. A missing token is
     * invalid like an unknown one. Does not roll back
     * on {@link AuthenticationExceptions.InvalidSessionException} so a replay's family revocation
     * is committed together with the {@code 401}.
     */
    @Transactional(noRollbackFor = AuthenticationExceptions.InvalidSessionException.class)
    public IssuedSession rotate(String sessionToken) {
        if (sessionToken == null || sessionToken.isBlank()) {
            throw new AuthenticationExceptions.InvalidSessionException();
        }
        Instant now = clock.instant();
        UserSession presented = sessionRepository
                .findByTokenHashForUpdate(OpaqueTokens.hash(sessionToken))
                .orElseThrow(AuthenticationExceptions.InvalidSessionException::new);

        if (!presented.getExpiresAt().isAfter(now)) {
            throw new AuthenticationExceptions.InvalidSessionException();
        }

        if (presented.getReplacedAt() == null) {
            presented.setReplacedAt(now);
        } else if (now.isAfter(presented.getReplacedAt().plus(reuseGrace))) {
            sessionRepository.deleteAllByFamilyId(presented.getFamilyId());
            logger.warn(
                    "Session token replay detected; revoked family {} of user {}",
                    presented.getFamilyId(),
                    presented.getUser().getId());
            throw new AuthenticationExceptions.InvalidSessionException();
        }

        return issue(presented.getUser(), presented.getFamilyId(), now);
    }

    /** Ends the device session the token belongs to. A missing or unknown token is a no-op. */
    @Transactional
    public void revoke(String sessionToken) {
        if (sessionToken == null || sessionToken.isBlank()) {
            return;
        }
        sessionRepository
                .findByTokenHashForUpdate(OpaqueTokens.hash(sessionToken))
                .ifPresent(session -> sessionRepository.deleteAllByFamilyId(session.getFamilyId()));
    }

    /** Ends every session of the user, on every device. */
    @Transactional
    public void revokeAll(User user) {
        sessionRepository.deleteAllByUser(user);
    }

    private IssuedSession issue(User user, UUID familyId, Instant now) {
        String sessionToken = OpaqueTokens.generate();

        UserSession session = new UserSession();
        session.setUser(user);
        session.setFamilyId(familyId);
        session.setTokenHash(OpaqueTokens.hash(sessionToken));
        session.setExpiresAt(now.plus(ttl));
        session.setCreatedAt(now);
        sessionRepository.save(session);

        return new IssuedSession(jwtService.generateToken(user.getEmail()), sessionToken);
    }
}
