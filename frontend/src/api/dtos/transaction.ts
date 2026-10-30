import { Category } from ".";

export type TransactionType = "CREDIT" | "DEBIT";

export type SplitMode = "EQUAL" | "EXACT" | "PERCENT";

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

export type Transaction = {
  id: number;
  /** Sent back on edit; an edit of a version that changed since answers 409 `stale-version`. */
  version: number;
  category?: Category;
  type: TransactionType;
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
    amount: number;
    description: string;
    categoryId?: number;
    startDate: string;
    endDate?: string;
    splitMode?: SplitMode;
    participants?: ParticipantInput[];
    items?: ItemInput[];
  };
};

export type UpdateTransactionRequest = {
  params: { id: number };
  body: CreateTransactionRequest["body"] & { version: number };
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
    /** The series as the create request describes it. */
    series: CreateTransactionSeriesRequest["body"];
    version: number;
  };
};
