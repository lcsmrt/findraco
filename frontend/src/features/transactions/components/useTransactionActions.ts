import type { Transaction } from "@/api/dtos/transaction";
import {
  useDeleteTransaction,
  useDeleteTransactionSeries,
} from "@/api/services/useTransactionService";
import { useConfirm } from "@/components/dialog/useConfirm";
import { useState } from "react";
import type { TransactionFormMode } from "./transactionForm";
import { useSeriesScope } from "./useSeriesScope";

type DrawerState =
  | { open: false }
  | {
      open: true;
      mode: "edit" | "duplicate";
      transaction: Transaction;
    };

/** What the transaction drawer renders from: closed, or editing/duplicating a transaction. */
export type TransactionDrawer = {
  open: boolean;
  mode: TransactionFormMode;
  transaction?: Transaction;
};

function toDrawer(state: DrawerState): TransactionDrawer {
  if (!state.open) return { open: false, mode: "create" };
  return { open: true, mode: state.mode, transaction: state.transaction };
}

/**
 * A transaction's row actions and the drawer they open: edit, duplicate, and delete, which
 * asks for the occurrences to delete when the transaction belongs to a series and for a plain
 * confirmation otherwise.
 */
export function useTransactionActions() {
  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false });
  const confirm = useConfirm();
  const chooseScope = useSeriesScope();
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const { mutate: deleteSeries } = useDeleteTransactionSeries();

  function edit(transaction: Transaction) {
    setDrawerState({ open: true, mode: "edit", transaction });
  }

  function duplicate(transaction: Transaction) {
    setDrawerState({ open: true, mode: "duplicate", transaction });
  }

  async function remove(transaction: Transaction) {
    if (transaction.seriesId) {
      const scope = await chooseScope({
        title: "Delete series",
        description: "Choose which occurrences to delete.",
        confirmLabel: "Delete",
        confirmVariant: "destructive",
      });
      if (!scope) return;

      deleteSeries({
        seriesId: transaction.seriesId,
        scope,
        pivotOccurrenceId: transaction.id,
      });
      return;
    }

    const confirmed = await confirm({
      title: "Confirm Deletion",
      description:
        "Are you sure you want to delete this transaction? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
    });
    if (confirmed) deleteTransaction(transaction.id);
  }

  /** The drawer has no trigger of its own, so it only ever asks to close. */
  function closeDrawer() {
    setDrawerState({ open: false });
  }

  /** The drawer closes first, so the delete dialog is not stacked on top of it. */
  function removeFromDrawer(transaction: Transaction) {
    setDrawerState({ open: false });
    void remove(transaction);
  }

  return {
    drawer: toDrawer(drawerState),
    edit,
    duplicate,
    remove,
    closeDrawer,
    removeFromDrawer,
    isDeleting,
  };
}
