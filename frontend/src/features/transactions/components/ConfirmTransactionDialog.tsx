import type { Transaction } from "@/api/dtos/transaction";
import { useConfirmTransaction } from "@/api/services/useTransactionService";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  toConfirmFormValues,
  toConfirmPayload,
  type ConfirmTransactionFormOutput,
} from "./confirmTransactionForm";
import { ConfirmTransactionDialogView } from "./ConfirmTransactionDialogView";

type ConfirmTransactionDialogProps = {
  /** The occurrence being confirmed; the dialog is open while there is one. */
  transaction: Transaction | null;
  onClose: () => void;
};

export function ConfirmTransactionDialog({ transaction, onClose }: ConfirmTransactionDialogProps) {
  const { t } = useTranslation();

  const { mutate: confirm, isPending } = useConfirmTransaction({
    onSuccess: onClose,
    // A stale occurrence reloads the list: the dialog has nothing left to confirm.
    onStale: onClose,
  });
  const initialValues = useMemo(
    () => (transaction ? toConfirmFormValues(transaction) : { amount: null, date: new Date() }),
    [transaction],
  );

  function handleConfirm(values: ConfirmTransactionFormOutput) {
    if (transaction) confirm(toConfirmPayload(transaction, values));
  }

  return (
    <ConfirmTransactionDialogView
      open={transaction !== null}
      onOpenChange={(open) => !open && onClose()}
      initialValues={initialValues}
      description={t("transactions.confirmTransactionDialog.enterWhatWasReallyCharged", {
        description: transaction?.description ?? "",
      })}
      isSaving={isPending}
      onConfirm={handleConfirm}
    />
  );
}
