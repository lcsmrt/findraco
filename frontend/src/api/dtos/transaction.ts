import { Category } from ".";

export type TransactionType = "CREDIT" | "DEBIT";

export type SplitMode = "EQUAL" | "EXACT";

export type ParticipantShare = {
  id: number;
  name: string;
  shareAmount: number;
};

export type TransactionItem = {
  id: number;
  description: string;
  amount: number;
  quantity: number;
  category?: Category;
};

/** `PENDING` is a forecast whose date has passed without a confirmation. */
export type TransactionStatus = "ACTUAL" | "FORECAST" | "PENDING";

/**
 * What a row is besides income or expense. TRANSFER, CARD_BILL_PAYMENT and SAVINGS count in no total;
 * REFUND is a credit that lowers the spending of its (expense) category.
 */
export type TransactionKind = "TRANSFER" | "CARD_BILL_PAYMENT" | "SAVINGS" | "REFUND";

/** The list filter: `NEUTRAL` matches every kind, a kind matches itself. */
export type TransactionKindFilter = "NEUTRAL" | TransactionKind;

export type Transaction = {
  id: number;
  /** Sent back on edit; an edit of a version that changed since answers 409 `stale-version`. */
  version: number;
  category?: Category;
  type: TransactionType;
  /** Null for a normal income or expense. */
  kind?: TransactionKind | null;
  amount: number;
  description: string;
  parcelsNumber?: number;
  startDate: string;
  endDate: string;
  seriesId?: string;
  createdBy?: {
    id: number;
    name: string;
  };
  splitMode: SplitMode;
  participants: ParticipantShare[];
  items: TransactionItem[];
  /** Computed by the server from the reader's today. */
  status: TransactionStatus;
  /** True for an occurrence of a series that needs a confirmation to become actual. */
  requiresConfirmation: boolean;
  /** What the current member may do with this row, as the server decides it. */
  permissions: TransactionPermissions;
};

export type TransactionPermissions = {
  edit: boolean;
  delete: boolean;
};

export type ParticipantInput = {
  memberId: number;
  /** Only used when splitMode is EXACT. */
  shareAmount?: number;
};

export type ItemInput = {
  description: string;
  amount: number;
  categoryId?: number;
  quantity?: number;
};

export type TransactionSortBy =
  | "startDate"
  | "endDate"
  | "amount"
  | "description"
  | "category"
  | "attributedTo";

export type PagedTransactionsFilter = {
  type?: TransactionType;
  kind?: TransactionKindFilter;
  categoryId?: number;
  memberId?: number;
  description?: string;
  startDateFrom?: string;
  startDateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export type CreateTransactionRequest = {
  body: {
    type: TransactionType;
    /** Omitted means a normal row; the PUT clears the stored kind when it is omitted. */
    kind?: TransactionKind;
    amount: number;
    description: string;
    categoryId?: number;
    /** Installments only; an edit sends back the stored count, or the PUT clears it. */
    parcelsNumber?: number;
    startDate: string;
    endDate?: string;
    splitMode?: SplitMode;
    participants?: ParticipantInput[];
    items?: ItemInput[];
  };
};

/** A full replace: `items` is required, and an empty list removes the transaction's items. */
export type UpdateTransactionRequest = {
  params: { id: number };
  body: Omit<CreateTransactionRequest["body"], "items"> & { items: ItemInput[]; version: number };
};

export type RecurrenceMode = "INSTALLMENT" | "RECURRING";

export type RecurrenceInterval = "MONTHLY";

export type CreateTransactionSeriesRequest = {
  body: {
    type: TransactionType;
    amount: number;
    description: string;
    categoryId?: number;
    mode: RecurrenceMode;
    /** For installments, the month of the current parcel; for recurring, the first occurrence. */
    startDate: string;
    parcelsNumber?: number;
    currentParcel?: number;
    interval?: RecurrenceInterval;
    endDate?: string;
    splitMode?: SplitMode;
    participants?: ParticipantInput[];
    /** Omitted means required: the server stamps a new series as requiring confirmation. */
    requiresConfirmation?: boolean;
  };
};

export type TransactionSeriesResponse = {
  seriesId: string;
  count: number;
  occurrences: Transaction[];
};

export type SeriesEditScope = "THIS_ONE" | "THIS_AND_FOLLOWING" | "ALL";

export type RecurrenceDefinitionParticipantTemplate = {
  memberId: number;
  shareAmount: number;
};

export type RecurrenceDefinitionResponse = {
  id: number;
  /** Sent back on a series edit, whatever its scope. */
  version: number;
  seriesId: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId?: number;
  mode: RecurrenceMode;
  interval?: RecurrenceInterval;
  parcelsNumber?: number;
  firstParcel?: number;
  startDate: string;
  endDate?: string;
  splitMode: SplitMode;
  participants: RecurrenceDefinitionParticipantTemplate[];
  requiresConfirmation: boolean;
};

export type DeleteTransactionSeriesRequest = {
  seriesId: string;
  scope: SeriesEditScope;
  pivotOccurrenceId?: number;
};

export type UpdateTransactionSeriesRequest = {
  params: { seriesId: string };
  body: {
    scope: SeriesEditScope;
    pivotOccurrenceId?: number;
    /** The pivot occurrence's new date; null or omitted leaves it. Not with the "ALL" scope. */
    pivotDate?: string | null;
    /** The series as the create request describes it. */
    series: CreateTransactionSeriesRequest["body"];
    version: number;
    /** Omitted leaves the pivot's confirmation as it is. */
    pivotConfirmed?: boolean;
  };
};

export type ConfirmTransactionRequest = {
  params: { id: number };
  body: { amount: number; startDate: string; version: number };
};

/** What an import did: rows stored, and rows skipped because the bank's id was already stored. */
export type ImportResultResponse = {
  imported: number;
  skippedDuplicates: number;
};

/** The body of a delete: the id that restores everything that delete took, until the trash purge. */
export type DeletionResponse = {
  deletionId: number;
};

export type RestoreDeletionResponse = {
  /** How many transactions came back. */
  restored: number;
};

export type TransactionTrashKind = "TRANSACTION" | "SERIES";

/** One deletion in the plan's trash. */
export type TransactionTrashEntry = {
  id: number;
  kind: TransactionTrashKind;
  /** The series scope of a series deletion; null for a single transaction. */
  scope: SeriesEditScope | null;
  description: string;
  /** How many transactions the deletion took. */
  count: number;
  /** The total of those transactions. */
  amount: number;
  type: TransactionType;
  /** ISO instant. */
  deletedAt: string;
  deletedBy: { id: number; name: string } | null;
  /** ISO instant: the deletion plus the retention period. */
  expiresAt: string;
};

/** A row with no kind whose bank text looks like a neutral movement, and the kind it proposes. */
export type NeutralCandidate = {
  transaction: Transaction;
  proposedKind: Extract<TransactionKind, "TRANSFER" | "CARD_BILL_PAYMENT">;
};

/** Sets the kind of one row; the version guards a concurrent edit (409 `stale-version`). */
export type SetTransactionKindRequest = {
  params: { id: number };
  body: { kind: TransactionKind; version: number };
};
