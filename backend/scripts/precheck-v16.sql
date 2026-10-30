-- Read-only precheck for V16__hardening_constraints.sql. Run it on production BEFORE deploying the
-- hardening slice, for example:
--
--   docker exec -i <postgres-container> psql -U <user> -d <database> < backend/scripts/precheck-v16.sql
--
-- Every query must return ZERO rows. A row names a record that would make V16 abort (and the deploy
-- fail at start-up): fix or remove it first, then run the precheck again. Nothing here writes.

\echo '1. users with a null e-mail, name or password'
SELECT id, email, name FROM users WHERE email IS NULL OR name IS NULL OR password IS NULL;

\echo '2. user e-mails registered more than once'
SELECT email, count(*) AS users FROM users GROUP BY email HAVING count(*) > 1;

\echo '3. categories with a null description or type, or a negative spending limit'
SELECT id, plan_id, description, type, spending_limit FROM categories
WHERE description IS NULL OR type IS NULL OR spending_limit < 0;

\echo '4. transactions with a null amount, description, type or start date'
SELECT id, plan_id, amount, description, type, start_date FROM transactions
WHERE amount IS NULL OR description IS NULL OR type IS NULL OR start_date IS NULL;

\echo '5. transactions with an amount that is not positive, parcels outside 1..420 or an unknown split mode'
SELECT id, plan_id, amount, parcels_number, split_mode FROM transactions
WHERE amount <= 0
   OR (parcels_number IS NOT NULL AND parcels_number NOT BETWEEN 1 AND 420)
   OR split_mode NOT IN ('EQUAL', 'EXACT', 'PERCENT');

\echo '6. series with a non-positive amount, an unknown enum value, bad parcels or an end before the start'
SELECT id, plan_id, amount, type, mode, recurrence_interval, split_mode, parcels_number, first_parcel,
       start_date, end_date
FROM recurrence_definitions
WHERE amount <= 0
   OR type NOT IN ('CREDIT', 'DEBIT')
   OR mode NOT IN ('INSTALLMENT', 'RECURRING')
   OR (recurrence_interval IS NOT NULL AND recurrence_interval NOT IN ('MONTHLY'))
   OR split_mode NOT IN ('EQUAL', 'EXACT', 'PERCENT')
   OR (parcels_number IS NOT NULL AND parcels_number NOT BETWEEN 1 AND 420)
   OR (first_parcel IS NOT NULL AND first_parcel < 1)
   OR (end_date IS NOT NULL AND end_date < start_date);

\echo '7. participants with a negative share'
SELECT 'transaction' AS kind, id, share_amount FROM transaction_participants WHERE share_amount < 0
UNION ALL
SELECT 'series', id, share_amount FROM recurrence_definition_participants WHERE share_amount < 0;

\echo '8. imported references that appear more than once in a plan'
SELECT plan_id, external_id, count(*) AS transactions FROM transactions
WHERE external_id IS NOT NULL
GROUP BY plan_id, external_id HAVING count(*) > 1;
