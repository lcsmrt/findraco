import type { Transaction } from "@/api/dtos/transaction";
import { useGetContactStatement } from "@/api/services/useContactService";
import { useEffect, useRef } from "react";
import {
  useWatch,
  type Control,
  type UseFieldArrayReturn,
  type UseFormGetValues,
} from "react-hook-form";
import { openAllocationRows, withAllocations, withSuggestion } from "../utils/allocationRows";
import type { TransactionFormMode, TransactionFormOutput, TransactionFormValues } from "./transactionForm";

type UseRepaymentAllocationsArgs = {
  control: Control<TransactionFormValues, unknown, TransactionFormOutput>;
  allocations: UseFieldArrayReturn<TransactionFormValues, "allocations">;
  getValues: UseFormGetValues<TransactionFormValues>;
  mode: TransactionFormMode;
  transaction?: Transaction;
  open: boolean;
};

/**
 * Keeps the allocation list of a contact payment: the contact's open purchases, oldest first, ticked as the
 * amount is typed until the user ticks or edits one by hand. An edited payment starts from what it settles.
 */
export function useRepaymentAllocations({
  control,
  allocations,
  getValues,
  mode,
  transaction,
  open,
}: UseRepaymentAllocationsArgs) {
  const [kind, contact, amount] = useWatch({ control, name: ["kind", "repaymentContact", "amount"] });
  const contactId = contact?.id ?? null;
  const isRepayment = kind === "REPAYMENT";
  const statement = useGetContactStatement(contactId, { enabled: open && isRepayment });
  // Once the user ticks or edits a purchase, typing the amount no longer rewrites their choice.
  const touchedRef = useRef(false);
  const { replace } = allocations;

  useEffect(() => {
    const stored = mode === "edit" && transaction?.repayment?.contactId === contactId;
    const own = stored ? (transaction?.repayment?.allocations ?? []) : [];
    const rows = openAllocationRows(statement.data, own);
    touchedRef.current = own.length > 0;
    replace(own.length > 0 ? withAllocations(rows, own) : withSuggestion(rows, getValues("amount")));
  }, [statement.data, contactId, open, mode, transaction, replace, getValues]);

  useEffect(() => {
    if (!isRepayment || touchedRef.current) return;
    replace(withSuggestion(getValues("allocations") ?? [], amount));
  }, [amount, isRepayment, replace, getValues]);

  function markTouched() {
    touchedRef.current = true;
  }

  return {
    markTouched,
    isLoading: isRepayment && contactId !== null && statement.isPending,
    isError: isRepayment && contactId !== null && statement.isError,
    retry: () => void statement.refetch(),
  };
}
