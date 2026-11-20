-- A trashed row is restored against the series it left, and that used to compare the series' lock version,
-- which any later change moves (another occurrence deleted, a flag flipped). The revision counts only the
-- changes to what an occurrence carries (amount, description, category, split, installment parcels), so an
-- older deletion stays restorable until one of them changes.
ALTER TABLE recurrence_definitions ADD COLUMN rule_revision bigint NOT NULL DEFAULT 0;

-- Every active series starts at revision 0, so the deletions recorded against the old lock version are
-- restorable unless the rule changes from here on. A deletion that trashed its series whole is compared by
-- state, not by version.
UPDATE transaction_deletions SET definition_version = 0 WHERE definition_trashed = false;

-- A "this and following" deletion records the end it cut the series to, so its restore is refused only when
-- the end moved since. Existing ones take the series' current end, which their old version check had found
-- unchanged.
ALTER TABLE transaction_deletions ADD COLUMN cut_parcels_number integer;
ALTER TABLE transaction_deletions ADD COLUMN cut_end_date date;
UPDATE transaction_deletions d
SET cut_parcels_number = rd.parcels_number, cut_end_date = rd.end_date
FROM recurrence_definitions rd
WHERE d.recurrence_definition_id = rd.id AND d.scope = 'THIS_AND_FOLLOWING' AND d.definition_trashed = false;
