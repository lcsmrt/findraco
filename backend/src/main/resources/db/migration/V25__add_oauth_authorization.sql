-- Spring Authorization Server's JDBC schema (oauth2-authorization-schema.sql and
-- oauth2-authorization-consent-schema.sql), adapted for PostgreSQL as its header says (blob -> text,
-- timestamp -> timestamptz) and to our naming rules. Clients have no table: they are the allowlisted
-- Client ID Metadata Documents, so registered_client_id holds the document's URL.
CREATE TABLE oauth2_authorization (
    id varchar(100) NOT NULL,
    registered_client_id varchar(500) NOT NULL,
    principal_name varchar(200) NOT NULL,
    authorization_grant_type varchar(100) NOT NULL,
    authorized_scopes varchar(1000),
    attributes text,
    state varchar(500),
    authorization_code_value text,
    authorization_code_issued_at timestamptz,
    authorization_code_expires_at timestamptz,
    authorization_code_metadata text,
    access_token_value text,
    access_token_issued_at timestamptz,
    access_token_expires_at timestamptz,
    access_token_metadata text,
    access_token_type varchar(100),
    access_token_scopes varchar(1000),
    oidc_id_token_value text,
    oidc_id_token_issued_at timestamptz,
    oidc_id_token_expires_at timestamptz,
    oidc_id_token_metadata text,
    refresh_token_value text,
    refresh_token_issued_at timestamptz,
    refresh_token_expires_at timestamptz,
    refresh_token_metadata text,
    user_code_value text,
    user_code_issued_at timestamptz,
    user_code_expires_at timestamptz,
    user_code_metadata text,
    device_code_value text,
    device_code_issued_at timestamptz,
    device_code_expires_at timestamptz,
    device_code_metadata text,
    CONSTRAINT pk_oauth2_authorization PRIMARY KEY (id)
);

-- A password reset deletes every grant of the user (principal_name is the user id).
CREATE INDEX idx_oauth2_authorization_principal_name ON oauth2_authorization (principal_name);

CREATE TABLE oauth2_authorization_consent (
    registered_client_id varchar(500) NOT NULL,
    principal_name varchar(200) NOT NULL,
    authorities varchar(1000) NOT NULL,
    CONSTRAINT pk_oauth2_authorization_consent PRIMARY KEY (registered_client_id, principal_name)
);
