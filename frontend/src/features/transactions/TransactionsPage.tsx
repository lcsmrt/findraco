import type { Transaction } from "@/api/dtos/transaction";
import {
  useGetTransactions,
  useUpdateTransaction,
} from "@/api/services/useTransactionService";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { toPagination } from "@/api/utils/toPagination";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import type { Sorting } from "@/components/table/components/TableHeader";
import { useMemo } from "react";
import { useTransactionFilters } from "./filters/useTransactionFilters";
import { useTransactionFilterChips } from "./useTransactionFilterChips";
import { useTransactionPeriod } from "./useTransactionPeriod";
import { useTransactionsPage } from "./useTransactionsPage";
import {
  AppliedFilters,
  TransactionFilterPopover,
} from "./components/TransactionFilterPopover";
import { TransactionFormDrawer } from "./components/TransactionFormDrawer";
import { buildTransactionColumns, InlineSaveBody } from "./components/transactionColumns";
import { toInlineSavePayload } from "./components/transactionForm";
import { toSorting, toTransactionSort } from "./utils/transactionSort";
import { useCsvImport } from "./components/useCsvImport";
import { useTransactionActions } from "./components/useTransactionActions";
import { useTransactionSearch } from "./components/useTransactionSearch";
import { TransactionsPageView } from "./TransactionsPageView";

export function TransactionsPage() {
  const { transactions, updateTransactions, clearTransactions } =
    useTransactionFilters();
  const { chips, category, member, seedCategory } = useTransactionFilterChips();
  const { filter, sort, size } = transactions;
  const [page, onPageChange] = useTransactionsPage(transactions);
  const { search, setSearch, clearSearch } = useTransactionSearch();
  const actions = useTransactionActions();
  const { importCsv, isImporting } = useCsvImport();

  const { range, navigator } = useTransactionPeriod();

  const { data, isLoading } = useGetTransactions({
    page,
    size,
    filter: { ...filter, startDateFrom: range.startDate, startDateTo: range.endDate },
    ...(sort ? { sort } : {}),
  });
  const { activePlanId } = usePlanContext();
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const { canAttributeToOthers } = usePlanPermissions();
  const { mutate: updateTransaction } = useUpdateTransaction();
  const sorting = useMemo(() => toSorting(sort), [sort]);

  function onApplyFilters(applied: AppliedFilters) {
    if (applied.categoryForDisplay) seedCategory(applied.categoryForDisplay);
    updateTransactions((t) => ({
      ...t,
      filter: { ...applied.filter, description: t.filter.description },
    }));
  }

  function onClearFilters() {
    clearSearch();
    clearTransactions();
  }

  function onPageSizeChange(s: number) {
    updateTransactions((t) => ({ ...t, size: s }));
  }

  function onSortChange(next: Sorting[]) {
    updateTransactions((t) => ({ ...t, sort: toTransactionSort(next) }));
  }

  function onInlineSave(transaction: Transaction, change: InlineSaveBody) {
    updateTransaction(toInlineSavePayload(transaction, change));
  }

  const columns = buildTransactionColumns({
    onDuplicate: actions.duplicate,
    onEdit: actions.edit,
    onDelete: actions.remove,
    onSave: onInlineSave,
    isDeleting: actions.isDeleting,
    showParticipantsColumn: members.length > 1,
    canEditParticipants: canAttributeToOthers && members.length > 1,
    members,
  });

  return (
    <>
      <TransactionsPageView
        navigator={navigator}
        search={search}
        onSearchChange={setSearch}
        filters={
          <TransactionFilterPopover
            appliedFilters={{ filter, categoryForDisplay: category, memberForDisplay: member }}
            onApply={onApplyFilters}
            members={members}
          />
        }
        chips={chips}
        onClearFilters={onClearFilters}
        onImport={importCsv}
        isImporting={isImporting}
        transactions={data?.content ?? []}
        isLoading={isLoading}
        pagination={data && toPagination(data)}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        columns={columns}
        sorting={sorting}
        onSortChange={onSortChange}
        onEdit={actions.edit}
      />

      <TransactionFormDrawer
        open={actions.drawer.open}
        onOpenChange={actions.closeDrawer}
        transaction={actions.drawer.transaction}
        mode={actions.drawer.mode}
        onDuplicate={actions.duplicate}
        onDelete={actions.removeFromDrawer}
      />
    </>
  );
}
