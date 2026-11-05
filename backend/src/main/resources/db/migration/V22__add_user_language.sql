-- The language a user picked (NULL until they pick one: the app follows the device language meanwhile).
ALTER TABLE public.users ADD COLUMN language VARCHAR(5);
ALTER TABLE public.users ADD CONSTRAINT ck_users_language CHECK (language IN ('en', 'pt-BR'));
