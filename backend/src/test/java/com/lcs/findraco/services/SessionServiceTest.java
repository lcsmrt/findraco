package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.lcs.findraco.exceptions.AuthenticationExceptions;
import com.lcs.findraco.models.User;
import com.lcs.findraco.models.UserSession;
import com.lcs.findraco.repositories.UserSessionRepository;
import com.lcs.findraco.security.JwtService;
import com.lcs.findraco.security.OpaqueTokens;
import com.lcs.findraco.services.SessionService.IssuedSession;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;

/**
 * Session lifecycle rules (SESS-06, SESS-08, SESS-09, SESS-12): 30-day sliding expiry, rotation on
 * every renewal, 30-second grace for a replaced token, family revocation on replay after the grace.
 */
class SessionServiceTest {

    private static final Instant NOW_INSTANT = Instant.parse("2026-10-16T12:00:00Z");
    private static final LocalDateTime NOW = LocalDateTime.ofInstant(NOW_INSTANT, ZoneOffset.UTC);
    private static final Duration THIRTY_DAYS = Duration.ofDays(30);
    private static final Duration THIRTY_SECONDS = Duration.ofSeconds(30);
    private static final String ACCESS_TOKEN = "access-jwt";

    private final UserSessionRepository repository = mock(UserSessionRepository.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final SessionService service = new SessionService(
            repository, jwtService, Clock.fixed(NOW_INSTANT, ZoneOffset.UTC), THIRTY_DAYS, THIRTY_SECONDS);

    private final Logger serviceLogger = (Logger) LoggerFactory.getLogger(SessionService.class);
    private final ListAppender<ILoggingEvent> logs = new ListAppender<>();

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("alice@test.com");
        ReflectionTestUtils.setField(user, "id", 42L);
        when(jwtService.generateToken("alice@test.com")).thenReturn(ACCESS_TOKEN);
        when(repository.save(any(UserSession.class))).thenAnswer(invocation -> invocation.getArgument(0));
        logs.start();
        serviceLogger.addAppender(logs);
    }

    @AfterEach
    void tearDown() {
        serviceLogger.detachAppender(logs);
    }

    // --- open -------------------------------------------------------------------------------

    @Test
    void openDeletesTheUsersExpiredRowsAsOfNow() {
        service.open(user);

        verify(repository).deleteExpiredByUser(user, NOW);
    }

    @Test
    void openSavesOnlyTheHashWithThirtyDayExpiryInANewFamily() {
        IssuedSession first = service.open(user);
        IssuedSession second = service.open(user);

        List<UserSession> saved = savedSessions(2);
        UserSession row = saved.get(0);
        assertThat(row.getUser()).isSameAs(user);
        assertThat(row.getTokenHash())
                .isEqualTo(OpaqueTokens.hash(first.sessionToken()))
                .isNotEqualTo(first.sessionToken());
        assertThat(row.getExpiresAt()).isEqualTo(NOW.plusDays(30));
        assertThat(row.getCreatedAt()).isEqualTo(NOW);
        assertThat(row.getReplacedAt()).isNull();
        assertThat(row.getFamilyId()).isNotNull();
        assertThat(saved.get(1).getFamilyId()).isNotEqualTo(row.getFamilyId());
        assertThat(second.sessionToken()).isNotEqualTo(first.sessionToken());
    }

    @Test
    void openReturnsAnAccessTokenForTheUsersEmail() {
        IssuedSession issued = service.open(user);

        assertThat(issued.accessToken()).isEqualTo(ACCESS_TOKEN);
    }

    // --- rotate: invalid tokens ---------------------------------------------------------------

    @Test
    void rotateUnknownTokenIsInvalid() {
        when(repository.findByTokenHashForUpdate(OpaqueTokens.hash("unknown"))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.rotate("unknown"))
                .isInstanceOf(AuthenticationExceptions.InvalidSessionException.class);
        verify(repository, never()).save(any());
        verify(repository, never()).deleteAllByFamilyId(any());
    }

    @Test
    void rotateTokenExpiringExactlyNowIsInvalid() {
        UserSession stored = storedSession("expiring", UUID.randomUUID(), NOW, null);

        assertThatThrownBy(() -> service.rotate("expiring"))
                .isInstanceOf(AuthenticationExceptions.InvalidSessionException.class);
        assertThat(stored.getReplacedAt()).isNull();
        verify(repository, never()).save(any());
    }

    // --- rotate: current token ----------------------------------------------------------------

    @Test
    void rotateCurrentTokenMarksItReplacedAndIssuesASuccessorInTheSameFamily() {
        UUID family = UUID.randomUUID();
        UserSession current = storedSession("current", family, NOW.plusSeconds(1), null);

        IssuedSession issued = service.rotate("current");

        assertThat(current.getReplacedAt()).isEqualTo(NOW);
        UserSession successor = savedSessions(1).get(0);
        assertThat(successor.getFamilyId()).isEqualTo(family);
        assertThat(successor.getUser()).isSameAs(user);
        assertThat(successor.getExpiresAt()).isEqualTo(NOW.plusDays(30));
        assertThat(successor.getReplacedAt()).isNull();
        assertThat(successor.getTokenHash()).isEqualTo(OpaqueTokens.hash(issued.sessionToken()));
        assertThat(issued.sessionToken()).isNotEqualTo("current");
        assertThat(issued.accessToken()).isEqualTo(ACCESS_TOKEN);
    }

    // --- rotate: replaced token, grace window -------------------------------------------------

    @Test
    void rotateTokenReplacedExactlyThirtySecondsAgoIssuesAnotherSuccessorWithoutRevoking() {
        UUID family = UUID.randomUUID();
        UserSession replaced = storedSession("replaced", family, NOW.plusDays(29), NOW.minusSeconds(30));

        IssuedSession issued = service.rotate("replaced");

        UserSession successor = savedSessions(1).get(0);
        assertThat(successor.getFamilyId()).isEqualTo(family);
        assertThat(successor.getExpiresAt()).isEqualTo(NOW.plusDays(30));
        assertThat(successor.getTokenHash()).isEqualTo(OpaqueTokens.hash(issued.sessionToken()));
        assertThat(replaced.getReplacedAt()).isEqualTo(NOW.minusSeconds(30));
        verify(repository, never()).deleteAllByFamilyId(any());
        verify(repository, never()).deleteAllByUser(any());
        assertThat(logs.list).isEmpty();
    }

    @Test
    void rotateTokenReplacedThirtyOneSecondsAgoRevokesTheFamilyLogsAWarningAndIsInvalid() {
        UUID family = UUID.randomUUID();
        storedSession("replayed", family, NOW.plusDays(29), NOW.minusSeconds(31));

        assertThatThrownBy(() -> service.rotate("replayed"))
                .isInstanceOf(AuthenticationExceptions.InvalidSessionException.class);

        verify(repository).deleteAllByFamilyId(family);
        verify(repository, never()).save(any());
        assertThat(logs.list).singleElement().satisfies(event -> {
            assertThat(event.getLevel()).isEqualTo(Level.WARN);
            assertThat(event.getFormattedMessage()).contains(family.toString()).contains("42");
        });
    }

    // --- revoke / revokeAll -------------------------------------------------------------------

    @Test
    void revokeDeletesTheTokensFamily() {
        UUID family = UUID.randomUUID();
        storedSession("device", family, NOW.plusDays(30), null);

        service.revoke("device");

        verify(repository).deleteAllByFamilyId(family);
    }

    @Test
    void revokeUnknownTokenIsANoOp() {
        when(repository.findByTokenHashForUpdate(OpaqueTokens.hash("unknown"))).thenReturn(Optional.empty());

        service.revoke("unknown");

        verify(repository, never()).deleteAllByFamilyId(any());
        verify(repository, never()).deleteAllByUser(any());
    }

    @Test
    void revokeAllDeletesEveryRowOfTheUser() {
        service.revokeAll(user);

        verify(repository).deleteAllByUser(user);
    }

    private UserSession storedSession(String rawToken, UUID family, LocalDateTime expiresAt, LocalDateTime replacedAt) {
        UserSession session = new UserSession();
        session.setUser(user);
        session.setFamilyId(family);
        session.setTokenHash(OpaqueTokens.hash(rawToken));
        session.setExpiresAt(expiresAt);
        session.setReplacedAt(replacedAt);
        session.setCreatedAt(NOW.minusDays(1));
        when(repository.findByTokenHashForUpdate(OpaqueTokens.hash(rawToken))).thenReturn(Optional.of(session));
        return session;
    }

    private List<UserSession> savedSessions(int expected) {
        ArgumentCaptor<UserSession> captor = ArgumentCaptor.forClass(UserSession.class);
        verify(repository, times(expected)).save(captor.capture());
        return captor.getAllValues();
    }
}
