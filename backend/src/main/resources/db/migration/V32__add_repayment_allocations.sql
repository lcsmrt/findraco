-- Door 4 of R17: a repayment's allocations. Each row says how much of one contact share a repayment settles; what a
-- repayment pays beyond its allocations is the contact's credit and has no row. A service rule, under a lock on the
-- contact row, keeps the allocations of a share within the share; the checks here keep each row meaningful.
-- Removing a repayment or a share removes its allocations: the paid amount becomes credit.

CREATE TABLE repayment_allocations (
    id bigserial NOT NULL,
    repayment_id bigint NOT NULL,
    participant_id bigint NOT NULL,
    amount numeric(38, 2) NOT NULL,
    CONSTRAINT pk_repayment_allocations PRIMARY KEY (id),
    CONSTRAINT fk_repayment_allocations_repayment FOREIGN KEY (repayment_id) REFERENCES transactions (id) ON DELETE CASCADE,
    CONSTRAINT fk_repayment_allocations_participant FOREIGN KEY (participant_id) REFERENCES transaction_participants (id) ON DELETE CASCADE,
    CONSTRAINT ck_repayment_allocations_amount CHECK (amount > 0),
    CONSTRAINT uk_repayment_allocations_repayment_participant UNIQUE (repayment_id, participant_id)
);

CREATE INDEX idx_repayment_allocations_participant_id ON repayment_allocations (participant_id);
