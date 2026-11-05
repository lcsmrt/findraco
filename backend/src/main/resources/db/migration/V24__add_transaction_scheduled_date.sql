-- Series slot (iCalendar RECURRENCE-ID): the date the series scheduled an occurrence on. A confirmation may
-- move start_date; the slot stays, so a series edit matches each occurrence to its slot, never by its
-- current date. Existing occurrences sit on their slot; one-off transactions have none.
ALTER TABLE transactions ADD COLUMN scheduled_date date;
UPDATE transactions SET scheduled_date = start_date WHERE series_id IS NOT NULL;
