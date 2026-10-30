-- Hardening: the database guards the invariants that bypass the code (S9). A precondition block
-- counts every violation first and aborts naming it, so no constraint is half applied.
-- backend/scripts/precheck-v16.sql runs the same checks read-only against production beforehand.

DO $$
DECLARE
    violations bigint;
BEGIN
    SELECT count(*) INTO violations FROM public.users WHERE email IS NULL OR name IS NULL OR password IS NULL;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % users have a null email, name or password', violations;
    END IF;

    SELECT count(*) INTO violations FROM (
        SELECT email FROM public.users GROUP BY email HAVING count(*) > 1) duplicated;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % user e-mails are registered more than once', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.categories WHERE description IS NULL OR type IS NULL;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % categories have a null description or type', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.categories WHERE spending_limit < 0;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % categories have a negative spending limit', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.transactions
        WHERE amount IS NULL OR description IS NULL OR type IS NULL OR start_date IS NULL;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % transactions have a null amount, description, type or start date',
            violations;
    END IF;

    SELECT count(*) INTO violations FROM public.transactions WHERE amount <= 0;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % transactions have an amount that is not positive', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.transactions
        WHERE parcels_number IS NOT NULL AND parcels_number NOT BETWEEN 1 AND 420;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % transactions have a parcels number outside 1..420', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.transactions
        WHERE split_mode NOT IN ('EQUAL', 'EXACT', 'PERCENT');
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % transactions have an unknown split mode', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.recurrence_definitions
        WHERE amount <= 0
            OR type NOT IN ('CREDIT', 'DEBIT')
            OR mode NOT IN ('INSTALLMENT', 'RECURRING')
            OR (recurrence_interval IS NOT NULL AND recurrence_interval NOT IN ('MONTHLY'))
            OR split_mode NOT IN ('EQUAL', 'EXACT', 'PERCENT')
            OR (parcels_number IS NOT NULL AND parcels_number NOT BETWEEN 1 AND 420)
            OR (first_parcel IS NOT NULL AND first_parcel < 1)
            OR (end_date IS NOT NULL AND end_date < start_date);
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % series have a non-positive amount, an unknown enum value, '
            'parcels outside 1..420, a first parcel below 1 or an end date before the start', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.transaction_participants WHERE share_amount < 0;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % transaction participants have a negative share', violations;
    END IF;

    SELECT count(*) INTO violations FROM public.recurrence_definition_participants WHERE share_amount < 0;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % series participants have a negative share', violations;
    END IF;

    SELECT count(*) INTO violations FROM (
        SELECT plan_id, external_id FROM public.transactions
        WHERE external_id IS NOT NULL
        GROUP BY plan_id, external_id HAVING count(*) > 1) duplicated;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V16 precondition failed: % imported references appear more than once in a plan', violations;
    END IF;
END
$$;

-- NOT NULL and UNIQUE
ALTER TABLE public.users
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN password SET NOT NULL,
    ADD CONSTRAINT uk_users_email UNIQUE (email);

ALTER TABLE public.categories
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN type SET NOT NULL;

ALTER TABLE public.transactions
    ALTER COLUMN amount SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN start_date SET NOT NULL;

-- CHECK
ALTER TABLE public.categories
    ADD CONSTRAINT ck_categories_spending_limit_non_negative CHECK (spending_limit IS NULL OR spending_limit >= 0);

ALTER TABLE public.transactions
    ADD CONSTRAINT ck_transactions_amount_positive CHECK (amount > 0),
    ADD CONSTRAINT ck_transactions_parcels_number CHECK (parcels_number IS NULL OR parcels_number BETWEEN 1 AND 420),
    ADD CONSTRAINT ck_transactions_split_mode CHECK (split_mode IN ('EQUAL', 'EXACT', 'PERCENT'));

ALTER TABLE public.recurrence_definitions
    ADD CONSTRAINT ck_recurrence_definitions_type CHECK (type IN ('CREDIT', 'DEBIT')),
    ADD CONSTRAINT ck_recurrence_definitions_mode CHECK (mode IN ('INSTALLMENT', 'RECURRING')),
    ADD CONSTRAINT ck_recurrence_definitions_interval
        CHECK (recurrence_interval IS NULL OR recurrence_interval IN ('MONTHLY')),
    ADD CONSTRAINT ck_recurrence_definitions_split_mode CHECK (split_mode IN ('EQUAL', 'EXACT', 'PERCENT')),
    ADD CONSTRAINT ck_recurrence_definitions_amount_positive CHECK (amount > 0),
    ADD CONSTRAINT ck_recurrence_definitions_parcels_number
        CHECK (parcels_number IS NULL OR parcels_number BETWEEN 1 AND 420),
    ADD CONSTRAINT ck_recurrence_definitions_first_parcel CHECK (first_parcel IS NULL OR first_parcel >= 1),
    ADD CONSTRAINT ck_recurrence_definitions_end_after_start CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE public.transaction_participants
    ADD CONSTRAINT ck_transaction_participants_share_non_negative CHECK (share_amount >= 0);

ALTER TABLE public.recurrence_definition_participants
    ADD CONSTRAINT ck_recurrence_definition_participants_share_non_negative CHECK (share_amount >= 0);

-- The bank's reference of an imported row, unique per plan.
ALTER TABLE public.transactions RENAME COLUMN external_id TO source_ref;

CREATE UNIQUE INDEX uk_transactions_plan_source_ref
    ON public.transactions (plan_id, source_ref) WHERE source_ref IS NOT NULL;

-- Indexes on the foreign keys that had none (a composite starting with the column counts).
CREATE INDEX idx_categories_plan_id ON public.categories (plan_id);
CREATE INDEX idx_categories_owner_user_id ON public.categories (owner_user_id);
CREATE INDEX idx_category_member_limits_member ON public.category_member_limits (member_user_id);
CREATE INDEX idx_plan_invitations_plan_id ON public.plan_invitations (plan_id);
CREATE INDEX idx_plan_invitations_invited_by ON public.plan_invitations (invited_by);
CREATE INDEX idx_plan_memberships_user_id ON public.plan_memberships (user_id);
CREATE INDEX idx_plans_created_by ON public.plans (created_by);
CREATE INDEX idx_recurrence_definitions_created_by ON public.recurrence_definitions (created_by);
CREATE INDEX idx_recurrence_definitions_category_id ON public.recurrence_definitions (category_id);
CREATE INDEX idx_transactions_created_by ON public.transactions (created_by);
CREATE INDEX idx_transactions_category_id ON public.transactions (category_id);

-- Names under the S9 convention (pk_, fk_, ck_) for what earlier migrations left to the defaults.
ALTER TABLE public.category_member_limits RENAME CONSTRAINT category_member_limits_pkey TO pk_category_member_limits;
ALTER TABLE public.category_member_limits RENAME CONSTRAINT fk_cml_category TO fk_category_member_limits_category;
ALTER TABLE public.category_member_limits RENAME CONSTRAINT fk_cml_member TO fk_category_member_limits_member;
ALTER TABLE public.password_reset_tokens RENAME CONSTRAINT password_reset_tokens_pkey TO pk_password_reset_tokens;
ALTER TABLE public.plan_invitations RENAME CONSTRAINT plan_invitations_pkey TO pk_plan_invitations;
ALTER TABLE public.plan_invitations RENAME CONSTRAINT plan_invitations_role_check TO ck_plan_invitations_role;
ALTER TABLE public.plan_invitations RENAME CONSTRAINT plan_invitations_status_check TO ck_plan_invitations_status;
ALTER TABLE public.plan_invitations RENAME CONSTRAINT plan_invitations_type_check TO ck_plan_invitations_type;
ALTER TABLE public.plan_memberships RENAME CONSTRAINT plan_memberships_pkey TO pk_plan_memberships;
ALTER TABLE public.plan_memberships RENAME CONSTRAINT plan_memberships_role_check TO ck_plan_memberships_role;
ALTER TABLE public.plans RENAME CONSTRAINT plans_pkey TO pk_plans;
ALTER TABLE public.recurrence_definition_participants
    RENAME CONSTRAINT recurrence_definition_participants_pkey TO pk_recurrence_definition_participants;
ALTER TABLE public.recurrence_definition_participants
    RENAME CONSTRAINT fk_recdef_participants_definition TO fk_recurrence_definition_participants_definition;
ALTER TABLE public.recurrence_definition_participants
    RENAME CONSTRAINT fk_recdef_participants_member TO fk_recurrence_definition_participants_member;
ALTER TABLE public.recurrence_definitions RENAME CONSTRAINT recurrence_definitions_pkey TO pk_recurrence_definitions;
ALTER TABLE public.recurrence_definitions RENAME CONSTRAINT fk_recdef_category TO fk_recurrence_definitions_category;
ALTER TABLE public.recurrence_definitions RENAME CONSTRAINT fk_recdef_created_by TO fk_recurrence_definitions_created_by;
ALTER TABLE public.recurrence_definitions RENAME CONSTRAINT fk_recdef_plan TO fk_recurrence_definitions_plan;
ALTER TABLE public.transaction_items RENAME CONSTRAINT transaction_items_pkey TO pk_transaction_items;
ALTER TABLE public.transaction_items RENAME CONSTRAINT transaction_items_amount_check TO ck_transaction_items_amount;
ALTER TABLE public.transaction_items RENAME CONSTRAINT transaction_items_quantity_check TO ck_transaction_items_quantity;
ALTER TABLE public.transaction_items RENAME CONSTRAINT fk_txn_items_category TO fk_transaction_items_category;
ALTER TABLE public.transaction_items RENAME CONSTRAINT fk_txn_items_transaction TO fk_transaction_items_transaction;
ALTER TABLE public.transaction_participants RENAME CONSTRAINT transaction_participants_pkey TO pk_transaction_participants;
ALTER TABLE public.transaction_participants
    RENAME CONSTRAINT fk_txn_participants_member TO fk_transaction_participants_member;
ALTER TABLE public.transaction_participants
    RENAME CONSTRAINT fk_txn_participants_transaction TO fk_transaction_participants_transaction;
ALTER TABLE public.user_sessions RENAME CONSTRAINT user_sessions_pkey TO pk_user_sessions;
ALTER TABLE public.users RENAME CONSTRAINT users_pkey TO pk_users;
