package com.lcs.findraco.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.models.User;
import com.lcs.findraco.support.AbstractIntegrationTest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * V12 {@code user_sessions} constraints and the bulk deletes {@code SessionService} relies on
 * (SESS-07, SESS-12). Rows are seeded with plain SQL so each test controls the exact timestamps.
 */
class UserSessionRepositoryIT extends AbstractIntegrationTest {

    private static final LocalDateTime NOW = LocalDateTime.of(2026, 10, 16, 12, 0, 0);

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private JdbcTemplate jdbc;
    private TransactionTemplate transaction;

    @BeforeEach
    void setUp() {
        jdbc = new JdbcTemplate(dataSource);
        transaction = new TransactionTemplate(transactionManager);
    }

    @Test
    void duplicateTokenHashIsRejectedByTheDatabase() {
        User user = fixtures.aUser();
        insertSession(user, UUID.randomUUID(), "hash-a", NOW.plusDays(30));

        assertThatThrownBy(() -> insertSession(user, UUID.randomUUID(), "hash-a", NOW.plusDays(30)))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("uk_user_sessions_token_hash");
    }

    @Test
    void deletingAUserCascadesToTheirSessions() {
        User deleted = fixtures.aUser();
        User kept = fixtures.aUser();
        insertSession(deleted, UUID.randomUUID(), "hash-deleted", NOW.plusDays(30));
        insertSession(kept, UUID.randomUUID(), "hash-kept", NOW.plusDays(30));

        jdbc.update("DELETE FROM users WHERE id = ?", deleted.getId());

        assertThat(tokenHashes()).containsExactly("hash-kept");
    }

    @Test
    void deleteExpiredByUserRemovesOnlyThatUsersRowsExpiredAtOrBeforeNow() {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        UUID family = UUID.randomUUID();
        insertSession(user, family, "user-expired", NOW.minusSeconds(1));
        insertSession(user, family, "user-expires-now", NOW);
        insertSession(user, family, "user-active", NOW.plusSeconds(1));
        insertSession(other, UUID.randomUUID(), "other-expired", NOW.minusDays(1));

        transaction.executeWithoutResult(status -> userSessionRepository.deleteExpiredByUser(user, NOW));

        assertThat(tokenHashes()).containsExactlyInAnyOrder("user-active", "other-expired");
    }

    @Test
    void deleteAllByFamilyIdLeavesOtherFamiliesIntact() {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        UUID revokedFamily = UUID.randomUUID();
        UUID keptFamily = UUID.randomUUID();
        insertSession(user, revokedFamily, "revoked-1", NOW.plusDays(30));
        insertSession(user, revokedFamily, "revoked-2", NOW.plusDays(30));
        insertSession(user, keptFamily, "kept-same-user", NOW.plusDays(30));
        insertSession(other, UUID.randomUUID(), "kept-other-user", NOW.plusDays(30));

        transaction.executeWithoutResult(status -> userSessionRepository.deleteAllByFamilyId(revokedFamily));

        assertThat(tokenHashes()).containsExactlyInAnyOrder("kept-same-user", "kept-other-user");
    }

    private void insertSession(User user, UUID familyId, String tokenHash, LocalDateTime expiresAt) {
        jdbc.update(
                "INSERT INTO user_sessions (user_id, family_id, token_hash, expires_at, created_at) "
                        + "VALUES (?, ?, ?, ?, ?)",
                user.getId(), familyId, tokenHash, Timestamp.valueOf(expiresAt), Timestamp.valueOf(NOW));
    }

    private List<String> tokenHashes() {
        return jdbc.queryForList("SELECT token_hash FROM user_sessions", String.class);
    }
}
