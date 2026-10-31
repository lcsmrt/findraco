-- Instants become timestamptz. The old columns were written by a JVM running in UTC (the
-- production container sets no TZ and Temurin defaults to UTC), so they are read as UTC.
ALTER TABLE public.password_reset_tokens
    ALTER COLUMN expires_at TYPE timestamptz USING expires_at AT TIME ZONE 'UTC';

ALTER TABLE public.user_sessions
    ALTER COLUMN expires_at TYPE timestamptz USING expires_at AT TIME ZONE 'UTC',
    ALTER COLUMN replaced_at TYPE timestamptz USING replaced_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';

ALTER TABLE public.plans
    ALTER COLUMN deleted_at TYPE timestamptz USING deleted_at AT TIME ZONE 'UTC';

ALTER TABLE public.plan_invitations
    ALTER COLUMN expires_at TYPE timestamptz USING expires_at AT TIME ZONE 'UTC';

-- The user's IANA zone: taken from the device while AUTOMATIC, kept as is while PINNED.
-- Existing users start in America/Sao_Paulo.
ALTER TABLE public.users
    ADD COLUMN time_zone varchar(64) NOT NULL DEFAULT 'America/Sao_Paulo',
    ADD COLUMN time_zone_mode varchar(16) NOT NULL DEFAULT 'AUTOMATIC',
    ADD CONSTRAINT ck_users_time_zone_mode CHECK (time_zone_mode IN ('AUTOMATIC', 'PINNED'));
