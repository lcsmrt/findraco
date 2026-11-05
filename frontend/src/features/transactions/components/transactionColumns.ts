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
import type { TFunction } from "i18next";
import { i18n } from "@/i18n/i18n";

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
  /** The translator in use, so the headers follow the language; stories omit it. */
  t?: TFunction;
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
  t = i18n.t,
}: TransactionColumnHandlers): ColumnDef<Transaction>[] {
  return [
    {
      id: "description",
      accessorKey: "description",
      header: t("transactions.transactionColumns.description"),
      enableSorting: true,
      cell: ({ row }) =>
        createElement(DescriptionCell, { transaction: row.original, onSave }),
    },
    {
      id: "category",
      accessorKey: "category",
      header: t("transactions.transactionColumns.category"),
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableCategoryCell, { transaction: row.original, onSave }),
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: t("transactions.transactionColumns.amount"),
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableAmountCell, { transaction: row.original, onSave }),
    },
    {
      id: "startDate",
      accessorKey: "startDate",
      header: t("transactions.transactionColumns.date"),
      enableSorting: true,
      cell: ({ row }) =>
        createElement(EditableDateCell, { transaction: row.original, onSave }),
    },
    ...(showParticipantsColumn
      ? [
          {
            id: "participants",
            header: t("transactions.transactionColumns.attributedTo"),
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
      header: () => createElement("span", { className: "sr-only" }, t("transactions.transactionColumns.actions")),
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
