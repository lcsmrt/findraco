-- A series remembers the dates a member deleted on purpose (iCalendar EXDATE), so a later edit or
-- top-up never brings them back; and a plan remembers how far its open-ended series are generated,
-- so a read can tell in one comparison whether it needs to extend them.

CREATE TABLE public.recurrence_exceptions (
    definition_id bigint NOT NULL,
    exception_date date NOT NULL,
    CONSTRAINT pk_recurrence_exceptions PRIMARY KEY (definition_id, exception_date),
    CONSTRAINT fk_recurrence_exceptions_definitions FOREIGN KEY (definition_id)
        REFERENCES public.recurrence_definitions (id) ON DELETE CASCADE
);

ALTER TABLE public.plans ADD COLUMN series_generated_until date;
