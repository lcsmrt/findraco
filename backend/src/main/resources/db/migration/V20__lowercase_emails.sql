-- E-mail is case-insensitive from now on: the API stores trim + lower-case. Existing rows are rewritten the
-- same way, and the migration refuses to run when that would merge two accounts or two pending invitations.
-- backend/scripts/precheck-v20.sql runs the same checks read-only against production beforehand.

DO $$
DECLARE
    violations bigint;
BEGIN
    SELECT count(*) INTO violations FROM (
        SELECT lower(trim(email)) FROM public.users GROUP BY lower(trim(email)) HAVING count(*) > 1) duplicated;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V20 precondition failed: % user e-mails collide once trimmed and lower-cased', violations;
    END IF;

    SELECT count(*) INTO violations FROM (
        SELECT plan_id, lower(trim(email)) FROM public.plan_invitations
        WHERE status = 'PENDING' AND email IS NOT NULL
        GROUP BY plan_id, lower(trim(email)) HAVING count(*) > 1) duplicated;
    IF violations > 0 THEN
        RAISE EXCEPTION 'V20 precondition failed: % pending invitations collide once trimmed and lower-cased',
            violations;
    END IF;
END $$;

UPDATE public.users SET email = lower(trim(email)) WHERE email <> lower(trim(email));
UPDATE public.plan_invitations SET email = lower(trim(email)) WHERE email IS NOT NULL AND email <> lower(trim(email));
