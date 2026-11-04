-- Permanent plan deletion (V21) — every foreign key to plans cascades, so deleting a plans row removes
-- the plan's memberships, invitations, transactions, series definitions and categories (and, through
-- their own cascades, items, participants, exceptions and member limits) in the same statement.
-- Archiving stays a soft delete (plans.deleted_at); the cascade only ever runs on a permanent deletion.
-- Constraint names and the indexes on the plan_id columns are unchanged.

ALTER TABLE public.plan_memberships
    DROP CONSTRAINT fk_plan_memberships_plan,
    ADD CONSTRAINT fk_plan_memberships_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE;

ALTER TABLE public.plan_invitations
    DROP CONSTRAINT fk_plan_invitations_plan,
    ADD CONSTRAINT fk_plan_invitations_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE;

ALTER TABLE public.recurrence_definitions
    DROP CONSTRAINT fk_recurrence_definitions_plan,
    ADD CONSTRAINT fk_recurrence_definitions_plan FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE;

ALTER TABLE public.transactions
    DROP CONSTRAINT fk_transactions_plans,
    ADD CONSTRAINT fk_transactions_plans FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE;

ALTER TABLE public.categories
    DROP CONSTRAINT fk_categories_plans,
    ADD CONSTRAINT fk_categories_plans FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE CASCADE;
