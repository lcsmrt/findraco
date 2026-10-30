-- The bank's own text for an imported row, kept apart from the description a member may edit. Rows
-- imported before this column exist keep null: the text cannot be recovered for them.

ALTER TABLE public.transactions ADD COLUMN source_text character varying(512);
