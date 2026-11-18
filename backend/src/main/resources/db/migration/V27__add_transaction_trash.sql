-- Transaction trash: a delete is one transaction_deletions row. Trashed transactions, and a series deleted
-- whole, point at it and are hidden by the readers' `deletion_id IS NULL`; the daily purge deletes the
-- deletion once it is 30 days old and the cascades carry its rows (participants and items cascade from
-- their transaction already). The columns on the deletion record what a delete changed on the series, so a
-- restore can undo it as one action.

CREATE TABLE transaction_deletions (
    id bigserial NOT NULL,
    plan_id bigint NOT NULL,
    deleted_by_user_id bigint,
    deleted_at timestamptz NOT NULL,
    kind varchar(16) NOT NULL,
    scope varchar(32),
    recurrence_definition_id bigint,
    definition_version bigint,
    exception_date date,
    previous_end_date date,
    previous_parcels_number integer,
    definition_trashed boolean NOT NULL DEFAULT false,
    CONSTRAINT pk_transaction_deletions PRIMARY KEY (id),
    CONSTRAINT fk_transaction_deletions_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_deletions_deleted_by FOREIGN KEY (deleted_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT ck_transaction_deletions_kind CHECK (kind IN ('TRANSACTION', 'SERIES'))
);

CREATE INDEX idx_transaction_deletions_plan_deleted_at ON transaction_deletions (plan_id, deleted_at DESC);
CREATE INDEX idx_transaction_deletions_deleted_by ON transaction_deletions (deleted_by_user_id);

-- The transactions' cascade is declared first so that, when a series deleted whole is purged, its rows go
-- before the definition they reference.
ALTER TABLE transactions ADD COLUMN deletion_id bigint;
ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_deletion FOREIGN KEY (deletion_id) REFERENCES transaction_deletions (id)
        ON DELETE CASCADE;
CREATE INDEX idx_transactions_deletion_id ON transactions (deletion_id);

ALTER TABLE recurrence_definitions ADD COLUMN deletion_id bigint;
ALTER TABLE recurrence_definitions
    ADD CONSTRAINT fk_recurrence_definitions_deletion FOREIGN KEY (deletion_id) REFERENCES transaction_deletions (id)
        ON DELETE CASCADE;
CREATE INDEX idx_recurrence_definitions_deletion_id ON recurrence_definitions (deletion_id);
