-- The refresh tokens a rotation replaced, by SHA-256 hash, so a replayed one is recognised and its whole grant
-- revoked (Spring's authorization server only refuses it). A grant's rows go with the grant.
CREATE TABLE oauth2_rotated_refresh_tokens (
    token_hash varchar(64) NOT NULL,
    authorization_id varchar(100) NOT NULL,
    CONSTRAINT pk_oauth2_rotated_refresh_tokens PRIMARY KEY (token_hash),
    CONSTRAINT fk_oauth2_rotated_refresh_tokens_authorization FOREIGN KEY (authorization_id)
        REFERENCES oauth2_authorization (id) ON DELETE CASCADE
);

CREATE INDEX idx_oauth2_rotated_refresh_tokens_authorization_id ON oauth2_rotated_refresh_tokens (authorization_id);
