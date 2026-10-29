import type {
  Transaction,
  RecurrenceDefinitionResponse,
} from "@/api/dtos/transaction";
import {
  useCreateTransaction,
  useCreateTransactionSeries,
  useUpdateTransaction,
  useUpdateTransactionSeries,
} from "@/api/services/useTransactionService";
import {
  seriesParcelsChanged,
  toPayload,
  toSeriesCreatePayload,
  toSeriesEditPayload,
  type TransactionFormMode,
  type TransactionFormOutput,
} from "./transactionForm";
import type { SeriesScopeDialogContextValue } from "./useSeriesScope";

type UseTransactionFormSubmitArgs = {
  mode: TransactionFormMode;
  transaction?: Transaction;
  /** The edited series' definition; a series edit waits for it. */
  definition?: RecurrenceDefinitionResponse;
  showAttribution: boolean;
  currentUserId?: number;
  /** Asks which occurrences a series edit applies to; `null` cancels the edit. */
  chooseScope: SeriesScopeDialogContextValue["chooseScope"];
  onDone: () => void;
};

/**
 * Submits the transaction form: creates or updates a transaction, creates a series, or edits a
 * series after asking for its scope. Duplicate creates a new transaction.
 */
export function useTransactionFormSubmit({
  mode,
  transaction,
  definition,
  showAttribution,
  currentUserId,
  chooseScope,
  onDone,
}: UseTransactionFormSubmitArgs) {
  const createTransaction = useCreateTransaction({ onSuccess: onDone });
  const updateTransaction = useUpdateTransaction({ onSuccess: onDone });
  const createSeries = useCreateTransactionSeries({ onSuccess: onDone });
  const updateSeries = useUpdateTransactionSeries({ onSuccess: onDone });

  async function editSeries(
    values: TransactionFormOutput,
    seriesTransaction: Transaction,
    seriesId: string,
  ) {
    // Unreachable from the drawer, which disables Save until the definition loads; it narrows
    // the type, and returning keeps a series edit from falling through to a plain update.
    if (!definition) return;
    const scope = seriesParcelsChanged(definition, values.parcelsNumber)
      ? "ALL"
      : await chooseScope({ title: "Edit series" });
    if (!scope) return;

    updateSeries.mutate({
      params: { seriesId },
      body: toSeriesEditPayload(
        values,
        seriesTransaction,
        definition,
        scope,
        showAttribution,
        currentUserId,
      ),
    });
  }

  async function submit(values: TransactionFormOutput) {
    if (mode === "edit" && transaction?.seriesId) {
      await editSeries(values, transaction, transaction.seriesId);
      return;
    }

    if (mode === "create" && values.recurring && values.recurrenceMode) {
      createSeries.mutate({ body: toSeriesCreatePayload(values, showAttribution, currentUserId) });
      return;
    }

    const body = toPayload(values, showAttribution, currentUserId);
    if (mode === "edit" && transaction) {
      updateTransaction.mutate({ params: { id: transaction.id }, body });
      return;
    }
    createTransaction.mutate({ body });
  }

  return {
    submit,
    isSubmitting:
      createTransaction.isPending ||
      updateTransaction.isPending ||
      createSeries.isPending ||
      updateSeries.isPending,
  };
}
