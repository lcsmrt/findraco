-- A movement kind: a row that moves money without earning or spending it (a transfer between members, a card
-- bill payment, a move to savings) or that gives spending back (a refund). Null is a normal income or expense,
-- so every existing row keeps counting as before until a member marks it.
ALTER TABLE transactions
    ADD COLUMN kind varchar(32) NULL
        CONSTRAINT ck_transactions_kind CHECK (kind IN ('TRANSFER', 'CARD_BILL_PAYMENT', 'SAVINGS', 'REFUND'));
