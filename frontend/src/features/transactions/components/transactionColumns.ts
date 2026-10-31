import {
  Transaction,
  SplitMode,
} from "@/api/dtos/transaction";
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
  onDuplicate: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onSave: (transaction: Transaction, body: InlineSaveBody) => void;
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
}: TransactionColumnHandlers): ColumnDef<Transaction>[] {
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
            cell: ({ row }: { row: { original: Transaction } }) =>
              createElement(ParticipantsCell, {
                transaction: row.original,
                members,
                canEdit: canEditParticipants,
                onSave,
              }),
          } satisfies ColumnDef<Transaction>,
        ]
      : []),
    {
      id: "actions",
      // Visually empty, but a header cell needs a name for screen readers.
      header: () => createElement("span", { className: "sr-only" }, "Actions"),
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
