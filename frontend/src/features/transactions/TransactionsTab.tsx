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
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { useConfirm } from "@/components/dialog/useConfirm";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { Table, TableContent, TablePagination } from "@/components/table";
import { Sorting } from "@/components/table/components/TableHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { PlusIcon, SearchIcon, TagIcon, UploadIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTransactionFilters } from "./filters/useTransactionFilters";
import { useTransactionFilterChips } from "./useTransactionFilterChips";
import { useTransactionsPage } from "./useTransactionsPage";
import { useSeriesScope } from "./components/useSeriesScope";
import {
  AppliedFilters,
  TransactionFilterPopover,
} from "./components/TransactionFilterPopover";
import { TransactionFormDrawer } from "./components/TransactionFormDrawer";
import { TransactionMobileList } from "./components/TransactionMobileList";
import { buildTransactionColumns, InlineSaveBody } from "./components/transactionColumns";

const SEARCH_DEBOUNCE_MS = 400;

// Table column key -> API sort field, and back.
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

export const TransactionsTab = ({ onManageCategories }: TransactionsTabProps) => {
  const { transactions, updateTransactions, clearTransactions } =
    useTransactionFilters();
  const { chips, category, member, seedCategory } = useTransactionFilterChips();
  const { filter, sort, size } = transactions;

  const [page, onPageChange] = useTransactionsPage(transactions);

  // Typing draft for the search box, debounced into the `q` param.
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

  const sorting = useMemo<Sorting<FinancialTransaction>[]>(
    () =>
      sort ? [{ by: SORT_COLUMNS[sort.by], direction: sort.direction }] : [],
    [sort],
  );

  const appliedFilters: AppliedFilters = {
    filter,
    categoryForDisplay: category,
    memberForDisplay: member,
  };

  const onApplyFilters = (applied: AppliedFilters) => {
    if (applied.categoryForDisplay) seedCategory(applied.categoryForDisplay);
    updateTransactions((t) => ({
      ...t,
      filter: { ...applied.filter, description: t.filter.description },
    }));
  };

  const onClearFilters = () => {
    setDescription("");
    clearTransactions();
  };

  const onPageSizeChange = (s: number) =>
    updateTransactions((t) => ({ ...t, size: s }));

  const onSortChange = (next: Sorting<FinancialTransaction>[]) => {
    const active = next[0];
    const by = active ? SORTABLE_FIELDS[active.by as string] : undefined;
    updateTransactions((t) => ({
      ...t,
      sort: by ? { by, direction: active.direction } : null,
    }));
  };

  const { data: financialTransactionsData, isLoading: isLoadingTransactions } =
    useGetFinancialTransactions(queryParams);
  const { activePlanId, activePlan } = usePlanContext();
  const { data: members = [] } = useGetPlanMembers(activePlanId ?? undefined);
  const canAttributeToOthers =
    activePlan?.myRole === "OWNER" || activePlan?.myRole === "EDITOR";
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteFinancialTransaction();
  const { mutate: deleteFinancialTransactionSeries } =
    useDeleteFinancialTransactionSeries();
  const { mutate: updateTransaction } = useUpdateFinancialTransaction();

  const confirm = useConfirm();
  const chooseScope = useSeriesScope();

  const { mutate: importCsv, isPending: isImporting } = useImportNubankCsv();
  const fileInputRef = useRef<HTMLInputElement>(null);

  type DrawerState =
    | { open: false }
    | { open: true; mode: "create" }
    | {
        open: true;
        mode: "edit" | "duplicate";
        transaction: FinancialTransaction;
      };

  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false });

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importCsv(file);
      e.target.value = "";
    }
  };

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

  const handleOpenCreate = () => setDrawerState({ open: true, mode: "create" });

  const handleEdit = (transaction: FinancialTransaction) =>
    setDrawerState({ open: true, mode: "edit", transaction });

  const handleDuplicate = (transaction: FinancialTransaction) =>
    setDrawerState({ open: true, mode: "duplicate", transaction });

  const handleDelete = async (transaction: FinancialTransaction) => {
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
  };

  const handleInlineSave = (
    transaction: FinancialTransaction,
    change: InlineSaveBody,
  ) => {
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
  };

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
      <div className="flex flex-col gap-2 px-2">
        <div className="flex gap-2">
          <div className="flex flex-1 justify-between gap-2">
            <InputGroup className="flex-1 sm:max-w-sm">
              <InputGroupInput
                placeholder="Search transactions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-9"
              />
              <InputGroupAddon>
                <SearchIcon className="text-muted-foreground pointer-events-none h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>

            <TransactionFilterPopover
              appliedFilters={appliedFilters}
              onApply={onApplyFilters}
              members={members}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onManageCategories}>
              <TagIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Categories</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              <UploadIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isImporting ? "Importing..." : "Import CSV"}
              </span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button onClick={handleOpenCreate}>
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">New Transaction</span>
            </Button>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <Badge key={chip.key} variant="outline" className="gap-1 pr-1">
                {chip.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded"
                  onClick={chip.onRemove}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-muted-foreground h-auto p-0 text-xs"
              onClick={onClearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <TransactionMobileList
        className="sm:hidden"
        transactions={financialTransactionsData?.content || []}
        isLoading={isLoadingTransactions}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onEdit={handleEdit}
      />

      <div className="hidden sm:block">
        <Table
          tableId="financialTransactionsTable"
          border="all"
          className="mx-2 w-auto rounded-lg shadow-sm"
          data={financialTransactionsData?.content || []}
          columns={columns}
        >
          {(table) => (
            <>
              <TableContent
                table={table}
                sorting={sorting}
                onSortChange={onSortChange}
                emptyState="No transactions found."
                isLoading={isLoadingTransactions}
              />
              <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            </>
          )}
        </Table>
      </div>

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
};
