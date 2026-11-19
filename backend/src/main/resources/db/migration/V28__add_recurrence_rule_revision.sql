-- A trashed row is restored against the series it left, and that used to compare the series' lock version,
-- which any later change moves (another occurrence deleted, a flag flipped). The revision counts only the
-- changes to what the occurrences are generated from, so an older deletion stays restorable until the series'
-- amount, rule or end changes.
ALTER TABLE recurrence_definitions ADD COLUMN rule_revision bigint NOT NULL DEFAULT 0;

-- Every active series starts at revision 0, so the deletions recorded against the old lock version are
-- restorable unless the rule changes from here on. A deletion that trashed its series whole is compared by
-- state, not by version.
UPDATE transaction_deletions SET definition_version = 0 WHERE definition_trashed = false;
