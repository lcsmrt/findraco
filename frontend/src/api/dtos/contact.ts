/** A person outside the plan who can take a share of a purchase and pay it back. */
export type Contact = {
  id: number;
  name: string;
  archived: boolean;
  /** What the contact owes: its actual shares minus its payments, never negative. */
  owed: number;
  /** What the contact paid beyond what it owed, never negative. */
  credit: number;
  /** Sent back on a rename; a rename of a version that changed since answers 409 `stale-version`. */
  version: number;
};

/** `PLANNED` is a share of a transaction that has not happened yet; it stays out of the balance. */
export type ContactShareStatus = "PLANNED" | "OPEN" | "PARTIAL" | "PAID";

export type ContactStatementShare = {
  /** The id of the contact's share: what a repayment's allocation points at. */
  participantId: number;
  transactionId: number;
  /** `yyyy-MM-dd`. */
  date: string;
  description: string;
  share: number;
  /** What live repayments settled of this share. */
  allocated: number;
  status: ContactShareStatus;
};

export type ContactStatementRepayment = {
  transactionId: number;
  /** `yyyy-MM-dd`. */
  date: string;
  amount: number;
  /** The part of the payment that settles no share: it is the contact's credit. */
  unallocated: number;
};

/** One calendar month of a statement; its shares and payments come oldest first. */
export type ContactStatementMonth = {
  /** `yyyy-MM`. */
  month: string;
  shares: ContactStatementShare[];
  repayments: ContactStatementRepayment[];
};

/** What a contact owes and for what; the months come newest first. */
export type ContactStatement = {
  contact: Contact;
  owed: number;
  credit: number;
  months: ContactStatementMonth[];
};

export type ContactsFilter = {
  /** True lists the archived contacts too, each flagged; the default lists the active ones. */
  archived?: boolean;
};

export type CreateContactRequest = {
  body: { name: string };
};

export type UpdateContactRequest = {
  params: { id: number };
  body: { name: string; version: number };
};

export type ContactRequest = {
  params: { id: number };
};
