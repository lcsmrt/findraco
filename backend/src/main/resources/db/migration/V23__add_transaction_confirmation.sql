-- Actual vs forecast: each transaction stores how it becomes actual (BY_DATE, REQUIRED or CONFIRMED) and
-- each series stores whether its occurrences need a confirmation. Existing rows become BY_DATE and existing
-- series false, so past rows stay actual, future rows of existing series stay forecast and none is pending.
ALTER TABLE recurrence_definitions ADD COLUMN requires_confirmation boolean NOT NULL DEFAULT false;
ALTER TABLE recurrence_definitions ALTER COLUMN requires_confirmation DROP DEFAULT;
ALTER TABLE transactions ADD COLUMN confirmation varchar(16) NOT NULL DEFAULT 'BY_DATE';
ALTER TABLE transactions ALTER COLUMN confirmation DROP DEFAULT;
ALTER TABLE transactions ADD CONSTRAINT ck_transactions_confirmation
    CHECK (confirmation IN ('BY_DATE', 'REQUIRED', 'CONFIRMED'));
