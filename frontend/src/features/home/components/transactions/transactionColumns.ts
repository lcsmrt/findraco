import {
  FinancialTransaction,
  SplitMode,
} from "@/api/dtos/financialTransaction";
import { PlanMember } from "@/api/dtos/plan";
import { ColumnDef } from "@tanstack/react-table";
import { createElement } from "react";
import {
  ActionsCell,
  DescriptionCell,
  EditableAmountCell,
  EditableCategoryCell,
  EditableDateCell,
  ParticipantsCell,
} from "./TransactionCells";

export type InlineSaveBody = {
  description?: string;
  amount?: number;
  categoryId?: number;
  startDate?: string;
  participants?: { memberId: number }[];
  splitMode?: SplitMode;
}

type TransactionColumnHandlers = {
  onDuplicate: (transaction: FinancialTransaction) => void;
  onEdit: (transaction: FinancialTransaction) => void;
  onDelete: (transaction: FinancialTransaction) => void;
  onSave: (transaction: FinancialTransaction, body: InlineSaveBody) => void;
  isDeleting?: boolean;
  showParticipantsColumn?: boolean;
  canEditParticipants?: boolean;
  members?: PlanMember[];
}

/**
 * Column definitions for the transactions table. A `.ts` module cannot hold JSX, so the cells are
 * created with `createElement`; their markup lives in `TransactionCells.tsx`.
 */
export function buildTransactionColumns({
  onDuplicate,
  onEdit,
  onDelete,
  onSave,
  isDeleting,
  showParticipantsColumn,
  canEditParticipants,
  members = [],
}: TransactionColumnHandlers): ColumnDef<FinancialTransaction>[] {
  return [
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      enableSorting: true,
      cell: ({ row }) =>
        createElement(DescriptionCell, { transaction: row.original, onSave }),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableCategoryCell, { transaction: row.original, onSave }),
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableAmountCell, { transaction: row.original, onSave }),
    },
    {
      id: "startDate",
      accessorKey: "startDate",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableDateCell, { transaction: row.original, onSave }),
    },
    ...(showParticipantsColumn
      ? [
          {
            id: "participants",
            header: "Attributed to",
            enableSorting: true,
            cell: ({ row }: { row: { original: FinancialTransaction } }) =>
              createElement(ParticipantsCell, {
                transaction: row.original,
                members,
                canEdit: canEditParticipants,
                onSave,
              }),
          } satisfies ColumnDef<FinancialTransaction>,
        ]
      : []),
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        createElement(ActionsCell, {
          transaction: row.original,
          isDeleting,
          onDuplicate,
          onEdit,
          onDelete,
        }),
    },
  ];
}
