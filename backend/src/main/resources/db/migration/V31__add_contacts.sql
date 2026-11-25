-- Contacts: people of a plan without a login. A share of a transaction can go to a contact instead of a member;
-- it then adds to what the contact owes and counts in no total of the plan (R17).
--
-- Door 1: the contact. A name is unique among the plan's active contacts, ignoring case, so a split picker and the
-- connector never face two of the same name; an archived contact frees its name.
-- Door 2: a participant is a member or a contact, never both and never neither, on a transaction and on a series.
-- Door 3 (columns only): a repayment is a transaction of kind REPAYMENT that names the contact it came from. The
-- kind is nullable, so the check is written to pass a null kind with no contact.

CREATE TABLE contacts (
    id bigserial NOT NULL,
    plan_id bigint NOT NULL,
    name varchar(60) NOT NULL,
    archived_at timestamptz,
    created_at timestamptz NOT NULL,
    version bigint NOT NULL DEFAULT 0,
    CONSTRAINT pk_contacts PRIMARY KEY (id),
    CONSTRAINT fk_contacts_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE
);

CREATE INDEX idx_contacts_plan_id ON contacts (plan_id);
CREATE UNIQUE INDEX uk_contacts_plan_name ON contacts (plan_id, lower(name)) WHERE archived_at IS NULL;

ALTER TABLE transaction_participants ALTER COLUMN member_user_id DROP NOT NULL;
ALTER TABLE transaction_participants ADD COLUMN contact_id bigint;
ALTER TABLE transaction_participants
    ADD CONSTRAINT fk_transaction_participants_contact FOREIGN KEY (contact_id) REFERENCES contacts (id);
ALTER TABLE transaction_participants
    ADD CONSTRAINT ck_txn_participants_member_or_contact CHECK ((member_user_id IS NULL) <> (contact_id IS NULL));
ALTER TABLE transaction_participants
    ADD CONSTRAINT uk_txn_participants_txn_contact UNIQUE (transaction_id, contact_id);
CREATE INDEX idx_transaction_participants_contact ON transaction_participants (contact_id);

ALTER TABLE recurrence_definition_participants ALTER COLUMN member_user_id DROP NOT NULL;
ALTER TABLE recurrence_definition_participants ADD COLUMN contact_id bigint;
ALTER TABLE recurrence_definition_participants
    ADD CONSTRAINT fk_recurrence_definition_participants_contact FOREIGN KEY (contact_id) REFERENCES contacts (id);
ALTER TABLE recurrence_definition_participants
    ADD CONSTRAINT ck_rec_def_participants_member_or_contact CHECK ((member_user_id IS NULL) <> (contact_id IS NULL));
ALTER TABLE recurrence_definition_participants
    ADD CONSTRAINT uk_recdef_participants_def_contact UNIQUE (recurrence_definition_id, contact_id);
CREATE INDEX idx_recurrence_definition_participants_contact ON recurrence_definition_participants (contact_id);

-- The kind list takes REPAYMENT now so the pair of checks below can be proven in the schema; no code writes it yet.
ALTER TABLE transactions DROP CONSTRAINT ck_transactions_kind;
ALTER TABLE transactions
    ADD CONSTRAINT ck_transactions_kind
        CHECK (kind IN ('TRANSFER', 'CARD_BILL_PAYMENT', 'SAVINGS', 'REFUND', 'REPAYMENT'));

ALTER TABLE transactions ADD COLUMN repayment_contact_id bigint;
ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_repayment_contact FOREIGN KEY (repayment_contact_id) REFERENCES contacts (id);
ALTER TABLE transactions
    ADD CONSTRAINT ck_transactions_repayment_contact
        CHECK ((kind IS NOT DISTINCT FROM 'REPAYMENT') = (repayment_contact_id IS NOT NULL));
CREATE INDEX idx_transactions_repayment_contact_id ON transactions (repayment_contact_id);
