-- One name per domain: financial_transactions -> transactions, financial_transaction_categories ->
-- categories, with their sequences, keys, checks, foreign keys and indexes renamed to the
-- pk_/uk_/fk_/idx_/ck_ convention. Renames are metadata only; references are by internal id.

DO $$
BEGIN
    IF to_regclass('public.financial_transactions') IS NULL
            OR to_regclass('public.financial_transaction_categories') IS NULL THEN
        RAISE EXCEPTION 'V13 precondition failed: financial_transactions and financial_transaction_categories must exist';
    END IF;
    IF to_regclass('public.transactions') IS NOT NULL OR to_regclass('public.categories') IS NOT NULL THEN
        RAISE EXCEPTION 'V13 precondition failed: transactions or categories already exists';
    END IF;
END $$;

-- categories
ALTER TABLE public.financial_transaction_categories RENAME TO categories;
ALTER SEQUENCE public.financial_transaction_categories_id_seq RENAME TO categories_id_seq;
ALTER TABLE public.categories RENAME CONSTRAINT financial_transaction_categories_pkey TO pk_categories;
ALTER TABLE public.categories RENAME CONSTRAINT financial_transaction_categories_type_check TO ck_categories_type;
ALTER TABLE public.categories RENAME CONSTRAINT fk_ftc_plan TO fk_categories_plans;
ALTER TABLE public.categories RENAME CONSTRAINT fk_ftc_parent TO fk_categories_parent;
ALTER TABLE public.categories RENAME CONSTRAINT fk_ftc_owner TO fk_categories_owner_user;
ALTER INDEX public.idx_ftc_parent RENAME TO idx_categories_parent_id;

-- transactions
ALTER TABLE public.financial_transactions RENAME TO transactions;
ALTER SEQUENCE public.financial_transactions_id_seq RENAME TO transactions_id_seq;
ALTER TABLE public.transactions RENAME CONSTRAINT financial_transactions_pkey TO pk_transactions;
ALTER TABLE public.transactions RENAME CONSTRAINT financial_transactions_type_check TO ck_transactions_type;
ALTER TABLE public.transactions RENAME CONSTRAINT fk_ft_plan TO fk_transactions_plans;
ALTER TABLE public.transactions RENAME CONSTRAINT fk_ft_created_by TO fk_transactions_created_by;
ALTER TABLE public.transactions
    RENAME CONSTRAINT fk_financial_transactions_financial_transaction_categories TO fk_transactions_categories;
ALTER TABLE public.transactions RENAME CONSTRAINT fk_ft_recurrence_definition TO fk_transactions_recurrence_definitions;
ALTER INDEX public.idx_financial_transactions_start_date RENAME TO idx_transactions_start_date;
ALTER INDEX public.idx_ft_plan_id RENAME TO idx_transactions_plan_id;
ALTER INDEX public.idx_ft_plan_id_start_date RENAME TO idx_transactions_plan_id_start_date;
ALTER INDEX public.idx_ft_plan_id_series_id RENAME TO idx_transactions_plan_id_series_id;
ALTER INDEX public.idx_ft_recurrence_definition_id RENAME TO idx_transactions_recurrence_definition_id;
