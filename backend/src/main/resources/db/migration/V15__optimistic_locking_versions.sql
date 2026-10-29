-- Optimistic locking on the guarded entities: an edit sends back the version it read, and a stale one
-- is refused instead of silently overwriting a concurrent change. Existing rows start at 0.

ALTER TABLE public.transactions ADD COLUMN version bigint NOT NULL DEFAULT 0;
ALTER TABLE public.recurrence_definitions ADD COLUMN version bigint NOT NULL DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN version bigint NOT NULL DEFAULT 0;
