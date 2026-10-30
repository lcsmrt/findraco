-- PERCENT was accepted by the API but never supported (the split resolver rejected it). It leaves the
-- enum and the checks; the migration refuses to run while a stored row still uses it, so no data is
-- silently orphaned.

DO $$
DECLARE
    stored bigint;
BEGIN
    SELECT (SELECT count(*) FROM public.transactions WHERE split_mode = 'PERCENT')
         + (SELECT count(*) FROM public.recurrence_definitions WHERE split_mode = 'PERCENT')
        INTO stored;
    IF stored > 0 THEN
        RAISE EXCEPTION 'V19 precondition failed: % rows use the PERCENT split mode', stored;
    END IF;
END $$;

ALTER TABLE public.transactions
    DROP CONSTRAINT ck_transactions_split_mode,
    ADD CONSTRAINT ck_transactions_split_mode CHECK (split_mode IN ('EQUAL', 'EXACT'));

ALTER TABLE public.recurrence_definitions
    DROP CONSTRAINT ck_recurrence_definitions_split_mode,
    ADD CONSTRAINT ck_recurrence_definitions_split_mode CHECK (split_mode IN ('EQUAL', 'EXACT'));
