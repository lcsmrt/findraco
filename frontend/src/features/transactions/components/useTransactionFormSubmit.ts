import type {
  FinancialTransaction,
  RecurrenceDefinitionResponse,
} from "@/api/dtos/financialTransaction";
import {
  useCreateFinancialTransaction,
  useCreateFinancialTransactionSeries,
  useUpdateFinancialTransaction,
  useUpdateFinancialTransactionSeries,
} from "@/api/services/useFinancialTransactionService";
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
  transaction?: FinancialTransaction;
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
  const createTransaction = useCreateFinancialTransaction({ onSuccess: onDone });
  const updateTransaction = useUpdateFinancialTransaction({ onSuccess: onDone });
  const createSeries = useCreateFinancialTransactionSeries({ onSuccess: onDone });
  const updateSeries = useUpdateFinancialTransactionSeries({ onSuccess: onDone });

  async function editSeries(values: TransactionFormOutput, seriesId: string) {
    if (!transaction || !definition) return;
    const scope = seriesParcelsChanged(definition, values.parcelsNumber)
      ? "ALL"
      : await chooseScope({ title: "Edit series" });
    if (!scope) return;

    updateSeries.mutate({
      params: { seriesId },
      body: toSeriesEditPayload(
        values,
        transaction,
        definition,
        scope,
        showAttribution,
        currentUserId,
      ),
    });
  }

  async function submit(values: TransactionFormOutput) {
    if (mode === "edit" && transaction?.seriesId) {
      await editSeries(values, transaction.seriesId);
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
