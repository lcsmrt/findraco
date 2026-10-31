-- Read-only precheck for V20__lowercase_emails.sql. Run it on production BEFORE deploying the
-- case-insensitive e-mail slice, for example:
--
--   docker exec -i <postgres-container> psql -U <user> -d <database> < backend/scripts/precheck-v20.sql
--
-- Every query must return ZERO rows. A row names e-mails that would collapse into one once trimmed and
-- lower-cased, which makes V20 abort (and the deploy fail at start-up): merge or remove them first, then
-- run the precheck again. Nothing here writes.

\echo '1. user e-mails that collide once trimmed and lower-cased'
SELECT lower(trim(email)) AS email, count(*) AS users FROM users GROUP BY lower(trim(email)) HAVING count(*) > 1;

\echo '2. pending invitations to the same plan that collide once trimmed and lower-cased'
SELECT plan_id, lower(trim(email)) AS email, count(*) AS invitations FROM plan_invitations
WHERE status = 'PENDING' AND email IS NOT NULL
GROUP BY plan_id, lower(trim(email)) HAVING count(*) > 1;
