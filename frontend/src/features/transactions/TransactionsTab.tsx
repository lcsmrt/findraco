import {
  FinancialTransaction,
  FinancialTransactionSortBy,
} from "@/api/dtos/financialTransaction";
import {
  useDeleteFinancialTransaction,
  useDeleteFinancialTransactionSeries,
  useGetFinancialTransactions,
  useImportNubankCsv,
  useUpdateFinancialTransaction,
} from "@/api/services/useFinancialTransactionService";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useConfirm } from "@/components/dialog/useConfirm";
import { Sorting } from "@/components/table/components/TableHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import { useTransactionFilters } from "./filters/useTransactionFilters";
import { useTransactionFilterChips } from "./useTransactionFilterChips";
import { useTransactionsPage } from "./useTransactionsPage";
import { useSeriesScope } from "./components/useSeriesScope";
import {
  AppliedFilters,
  TransactionFilterPopover,
} from "./components/TransactionFilterPopover";
import { TransactionFormDrawer } from "./components/TransactionFormDrawer";
import { buildTransactionColumns, InlineSaveBody } from "./components/transactionColumns";
import { TransactionsTabView } from "./TransactionsTabView";

const SEARCH_DEBOUNCE_MS = 400;

// The table's column ids and the API's sort fields differ (`participants` sorts by `attributedTo`),
// so sorting translates both ways.
const SORTABLE_FIELDS: Record<string, FinancialTransactionSortBy> = {
  startDate: "startDate",
  amount: "amount",
  description: "description",
  category: "category",
  participants: "attributedTo",
};
const SORT_COLUMNS: Record<
  FinancialTransactionSortBy,
  keyof FinancialTransaction
> = {
  startDate: "startDate",
  endDate: "endDate",
  amount: "amount",
  description: "description",
  category: "category",
  attributedTo: "participants",
};

type TransactionsTabProps = {
  /** Opens the Categories tab; the tab row belongs to the home page, not to this tab. */
  onManageCategories: () => void;
};

export function TransactionsTab({ onManageCategories }: TransactionsTabProps) {
  const { transactions, updateTransactions, clearTransactions } =
    useTransactionFilters();
  const { chips, category, member, seedCategory } = useTransactionFilterChips();
  const { filter, sort, size } = transactions;

  const [page, onPageChange] = useTransactionsPage(transactions);

  // The search box keeps its own draft so a keystroke does not rewrite the URL and refetch; the
  // `q` param follows once typing settles.
  const urlDescription = filter.description ?? "";
  const [description, setDescription] = useState(urlDescription);
  const debouncedDescription = useDebounce(description, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    // Only once typing has settled, so a stale debounced value never overwrites `q`.
    if (
      debouncedDescription === description &&
      debouncedDescription !== urlDescription
    ) {
      updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, description: debouncedDescription || undefined },
      }));
    }
  }, [debouncedDescription, description, urlDescription, updateTransactions]);

  const queryParams = {
    page,
    size,
    filter,
    ...(sort ? { sort } : {}),
  };

  const sorting = useMemo<Sorting[]>(
    () =>
      sort ? [{ by: SORT_COLUMNS[sort.by], direction: sort.direction }] : [],
    [sort],
  );

  const appliedFilters: AppliedFilters = {
    filter,
    categoryForDisplay: category,
    memberForDisplay: member,
  };

  function onApplyFilters(applied: AppliedFilters) {
    if (applied.categoryForDisplay) seedCategory(applied.categoryForDisplay);
    updateTransactions((t) => ({
      ...t,
      filter: { ...applied.filter, description: t.filter.description },
    }));
  }

  function onClearFilters() {
    setDescription("");
    clearTransactions();
  }

  function onPageSizeChange(s: number) {
    updateTransactions((t) => ({ ...t, size: s }));
  }

  function onSortChange(next: Sorting[]) {
    const active = next[0];
    const by = active ? SORTABLE_FIELDS[active.by] : undefined;
    updateTransactions((t) => ({
      ...t,
      sort: by ? { by, direction: active.direction } : null,
    }));
  }

  const { data: financialTransactionsData, isLoading: isLoadingTransactions } =
    useGetFinancialTransactions(queryParams);
  const { activePlanId } = usePlanContext();
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const { canAttributeToOthers } = usePlanPermissions();
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteFinancialTransaction();
  const { mutate: deleteFinancialTransactionSeries } =
    useDeleteFinancialTransactionSeries();
  const { mutate: updateTransaction } = useUpdateFinancialTransaction();

  const confirm = useConfirm();
  const chooseScope = useSeriesScope();

  const { mutate: importCsv, isPending: isImporting } = useImportNubankCsv();

  type DrawerState =
    | { open: false }
    | { open: true; mode: "create" }
    | {
        open: true;
        mode: "edit" | "duplicate";
        transaction: FinancialTransaction;
      };

  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false });

  const pagination = financialTransactionsData
    ? {
        number: financialTransactionsData.page,
        size: financialTransactionsData.size,
        totalElements: financialTransactionsData.totalElements,
        totalPages: financialTransactionsData.totalPages,
        first: financialTransactionsData.page === 0,
        last: financialTransactionsData.last,
      }
    : undefined;

  function handleOpenCreate() {
    setDrawerState({ open: true, mode: "create" });
  }

  function handleEdit(transaction: FinancialTransaction) {
    setDrawerState({ open: true, mode: "edit", transaction });
  }

  function handleDuplicate(transaction: FinancialTransaction) {
    setDrawerState({ open: true, mode: "duplicate", transaction });
  }

  async function handleDelete(transaction: FinancialTransaction) {
    if (transaction.seriesId) {
      const scope = await chooseScope({
        title: "Delete series",
        description: "Choose which occurrences to delete.",
        confirmLabel: "Delete",
        confirmVariant: "destructive",
      });
      if (!scope) return;

      deleteFinancialTransactionSeries({
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

    if (confirmed) {
      deleteTransaction(transaction.id);
    }
  }

  function handleInlineSave(
    transaction: FinancialTransaction,
    change: InlineSaveBody,
  ) {
    updateTransaction({
      params: { id: transaction.id },
      body: {
        type: transaction.type,
        description: change.description ?? transaction.description,
        amount: change.amount ?? transaction.amount,
        categoryId: change.categoryId ?? transaction.category?.id,
        startDate: change.startDate ?? transaction.startDate.split("T")[0],
        splitMode: change.splitMode ?? transaction.splitMode,
        participants:
          change.participants ??
          transaction.participants.map((p) => ({
            memberId: p.id,
            shareAmount:
              transaction.splitMode === "EXACT" ? p.shareAmount : undefined,
          })),
      },
    });
  }

  const columns = buildTransactionColumns({
    onDuplicate: handleDuplicate,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSave: handleInlineSave,
    isDeleting,
    showParticipantsColumn: members.length > 1,
    canEditParticipants: canAttributeToOthers && members.length > 1,
    members,
  });

  return (
    <>
      <TransactionsTabView
        search={description}
        onSearchChange={setDescription}
        filters={
          <TransactionFilterPopover
            appliedFilters={appliedFilters}
            onApply={onApplyFilters}
            members={members}
          />
        }
        chips={chips}
        onClearFilters={onClearFilters}
        onManageCategories={onManageCategories}
        onImport={importCsv}
        isImporting={isImporting}
        onCreate={handleOpenCreate}
        transactions={financialTransactionsData?.content || []}
        isLoading={isLoadingTransactions}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        columns={columns}
        sorting={sorting}
        onSortChange={onSortChange}
        onEdit={handleEdit}
      />

      <TransactionFormDrawer
        open={drawerState.open}
        onOpenChange={(open) => {
          if (!open) setDrawerState({ open: false });
        }}
        transaction={
          drawerState.open && drawerState.mode !== "create"
            ? drawerState.transaction
            : undefined
        }
        mode={drawerState.open ? drawerState.mode : "create"}
        onDuplicate={handleDuplicate}
        onDelete={(transaction) => {
          setDrawerState({ open: false });
          void handleDelete(transaction);
        }}
      />
    </>
  );
}
