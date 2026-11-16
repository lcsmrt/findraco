package com.lcs.findraco.auth.service;

import java.sql.Timestamp;
import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The grants the authorization server issued to MCP clients (Claude), one row each in {@code oauth2_authorization},
 * whose principal name is the user id.
 */
@Service
public class McpGrantService {

    private static final Logger log = LoggerFactory.getLogger(McpGrantService.class);

    private final JdbcOperations jdbc;
    private final Clock clock;

    public McpGrantService(JdbcOperations jdbc, Clock clock) {
        this.jdbc = jdbc;
        this.clock = clock;
    }

    /** Ends every grant of the user: their refresh tokens fail and no new access token is issued. */
    @Transactional
    public void revokeAll(long userId) {
        jdbc.update("DELETE FROM oauth2_authorization WHERE principal_name = ?", String.valueOf(userId));
    }

    /**
     * Deletes the grants whose last token has expired, once a day ({@code app.oauth.grant-purge-cron}); a grant left
     * waiting for consent has no token and stays.
     */
    @Scheduled(cron = "${app.oauth.grant-purge-cron}")
    @Transactional
    public void purgeExpired() {
        int purged = jdbc.update(
                "DELETE FROM oauth2_authorization WHERE COALESCE(refresh_token_expires_at, access_token_expires_at, "
                        + "authorization_code_expires_at) < ?",
                Timestamp.from(clock.instant()));
        log.info("Purged {} expired MCP grants", purged);
    }
}
