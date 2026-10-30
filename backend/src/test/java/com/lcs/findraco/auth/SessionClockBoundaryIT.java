package com.lcs.findraco.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.auth.config.SessionProperties;
import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.auth.model.UserSession;
import com.lcs.findraco.auth.repository.UserSessionRepository;
import com.lcs.findraco.auth.service.JwtService;
import com.lcs.findraco.auth.service.OpaqueTokens;
import com.lcs.findraco.auth.service.SessionService;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.user.model.User;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * The instants at which a session token stops being good, to the second. {@link SessionIT} cannot reach them (it
 * moves time by rewriting rows, and real time keeps running), so the service is built here with a fixed clock over
 * the real repository.
 */
class SessionClockBoundaryIT extends AbstractIntegrationTest {

    private static final Instant NOW = Instant.parse("2026-10-16T12:00:00Z");
    private static final Duration GRACE = Duration.ofSeconds(30);

    @Autowired
    private UserSessionRepository repository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TransactionTemplate transactionTemplate;

    private SessionService service() {
        return new SessionService(
                repository,
                jwtService,
                Clock.fixed(NOW, ZoneOffset.UTC),
                new SessionProperties(Duration.ofDays(30), GRACE, true));
    }

    @Test
    void aTokenExpiringExactlyNowIsInvalidAndOneSecondLeftStillRenews() {
        User user = fixtures.aUser();
        stored(user, "expiring", UUID.randomUUID(), NOW, null);
        stored(user, "lastSecond", UUID.randomUUID(), NOW.plusSeconds(1), null);

        inTransaction(() -> assertThatThrownBy(() -> service().rotate("expiring"))
                .isInstanceOf(AuthenticationExceptions.InvalidSessionException.class));
        inTransaction(() -> service().rotate("lastSecond"));

        assertThat(repository.findAll()).hasSize(3);
    }

    @Test
    void aTokenReplacedExactlyAtTheGraceLimitStillRenewsWithoutRevoking() {
        User user = fixtures.aUser();
        UUID family = UUID.randomUUID();
        stored(user, "replaced", family, NOW.plus(Duration.ofDays(29)), NOW.minus(GRACE));

        try (CapturedLogs logs = CapturedLogs.of(SessionService.class)) {
            inTransaction(() -> service().rotate("replaced"));

            assertThat(logs.events()).isEmpty();
        }
        assertThat(repository.findAll())
                .hasSize(2)
                .allMatch(session -> session.getFamilyId().equals(family));
    }

    @Test
    void aTokenReplacedJustPastTheGraceLimitRevokesItsFamilyAndWarns() {
        User user = fixtures.aUser();
        UUID family = UUID.randomUUID();
        stored(
                user,
                "replayed",
                family,
                NOW.plus(Duration.ofDays(29)),
                NOW.minus(GRACE).minusMillis(1));
        stored(user, "sibling", family, NOW.plus(Duration.ofDays(29)), null);

        try (CapturedLogs logs = CapturedLogs.of(SessionService.class)) {
            // The exception is caught inside the transaction: the service commits the revocation with it.
            inTransaction(() -> assertThatThrownBy(() -> service().rotate("replayed"))
                    .isInstanceOf(AuthenticationExceptions.InvalidSessionException.class));

            assertThat(logs.lines()).singleElement().asString().contains(family.toString());
        }
        assertThat(repository.findAll()).isEmpty();
    }

    private void stored(User user, String rawToken, UUID family, Instant expiresAt, Instant replacedAt) {
        UserSession session = new UserSession();
        session.setUser(user);
        session.setFamilyId(family);
        session.setTokenHash(OpaqueTokens.hash(rawToken));
        session.setExpiresAt(expiresAt);
        session.setReplacedAt(replacedAt);
        session.setCreatedAt(NOW.minus(Duration.ofDays(1)));
        repository.save(session);
    }

    private void inTransaction(Runnable work) {
        transactionTemplate.executeWithoutResult(status -> work.run());
    }
}
