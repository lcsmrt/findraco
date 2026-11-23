-- The day of the month a series' occurrences fall on. It used to be read from start_date, which cannot hold a
-- day a short month lacks (a series starting on 28/02 would put every later month on the 28th) and which the
-- installment numbering counts from, so a day change could not move it. Existing series take the day of their
-- start date, which is the day their occurrences already fall on.
ALTER TABLE recurrence_definitions ADD COLUMN day_of_month smallint;
UPDATE recurrence_definitions SET day_of_month = EXTRACT(DAY FROM start_date);
ALTER TABLE recurrence_definitions ALTER COLUMN day_of_month SET NOT NULL;
ALTER TABLE recurrence_definitions
    ADD CONSTRAINT ck_recurrence_definitions_day_of_month CHECK (day_of_month BETWEEN 1 AND 31);
