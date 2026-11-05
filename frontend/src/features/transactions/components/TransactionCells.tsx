import { Category } from "@/api/dtos";
import { Transaction, ParticipantShare } from "@/api/dtos/transaction";
import { PlanMember } from "@/api/dtos/plan";
import { Avatar, AvatarFallback } from "@/components/avatar/base/Avatar";
import { Badge } from "@/components/badge/base/Badge";
import { Button } from "@/components/button/base/Button";
import { Amount } from "@/components/amount/Amount";
import { Checkbox } from "@/components/input/base/Checkbox";
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { Input } from "@/components/input/base/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover/base/Popover";
import { Text } from "@/components/typography/base/Text";
import { toCents } from "@/utils/money";
import { datePlaceholder, formatDate, parseDate, toIsoDate } from "@/utils/dates";
import { getFirstAndLastInitials } from "@/utils/string/formatters";
import { maskDate } from "@/utils/string/masks";
import { isValid } from "date-fns";
import { CopyIcon, PencilIcon, RepeatIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { CategoryCombobox } from "./CategoryCombobox";
import type { InlineSaveBody } from "./transactionColumns";
import { useTranslation } from "react-i18next";

type EditableCellProps = {
  transaction: Transaction;
  onSave: (transaction: Transaction, body: InlineSaveBody) => void;
};

function EditableDescriptionCell({ transaction, onSave }: EditableCellProps) {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(transaction.description);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== transaction.description) {
      onSave(transaction, { description: trimmed });
    } else {
      setDraft(transaction.description);
    }
    setEditing(false);
  }

  if (!transaction.permissions.edit) {
    return <span>{transaction.description}</span>;
  }

  if (!editing) {
    return (
      <span
        className="cursor-text decoration-dotted underline-offset-2 hover:underline"
        onClick={() => {
          setDraft(transaction.description);
          setEditing(true);
        }}
      >
        {transaction.description}
      </span>
    );
  }

  return (
    <Input
      autoFocus
      aria-label={t("transactions.editableDescriptionCell.description")}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(transaction.description);
          setEditing(false);
        }
      }}
      className="h-7 min-w-40"
    />
  );
}

export function EditableAmountCell({ transaction, onSave }: EditableCellProps) {
  const { t } = useTranslation();

  const { amount, type } = transaction;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number | null>(null);

  function commit() {
    if (draft !== null && draft > 0 && toCents(draft) !== toCents(amount)) {
      onSave(transaction, { amount: draft });
    }
    setEditing(false);
  }

  if (!transaction.permissions.edit) {
    return <Amount value={amount} type={type} />;
  }

  if (!editing) {
    return (
      <div
        className="cursor-text decoration-dotted underline-offset-2 hover:underline"
        onClick={() => {
          setDraft(amount);
          setEditing(true);
        }}
      >
        <Amount value={amount} type={type} />
      </div>
    );
  }

  return (
    <CurrencyInput
      autoFocus
      aria-label={t("common.amount")}
      value={draft}
      onValueChange={setDraft}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
      }}
      className="h-7 w-32 font-mono"
    />
  );
}

export function EditableCategoryCell({ transaction, onSave }: EditableCellProps) {
  const { category, type } = transaction;
  const [editing, setEditing] = useState(false);

  function handleValueChange(newCategory: Category | null | undefined) {
    if (newCategory != null) {
      onSave(transaction, { categoryId: newCategory.id });
    }
    setEditing(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) setEditing(false);
  }

  const display = category ? (
    <Badge variant="outline">{category.description}</Badge>
  ) : (
    <Text variant="caption" className="text-muted-foreground/50">
      —
    </Text>
  );

  if (!transaction.permissions.edit) {
    return display;
  }

  if (!editing) {
    return (
      <div className="cursor-pointer" onClick={() => setEditing(true)}>
        {display}
      </div>
    );
  }

  return (
    <div className="min-w-44">
      <CategoryCombobox
        value={category ?? null}
        onValueChange={handleValueChange}
        type={type}
        defaultOpen
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}

export function EditableDateCell({ transaction, onSave }: EditableCellProps) {
  const { t } = useTranslation();

  const displayDate = formatDate(transaction.startDate);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function commit() {
    const parsed = parseDate(draft);
    if (isValid(parsed)) {
      const newStartDate = toIsoDate(parsed);
      if (newStartDate !== transaction.startDate.split("T")[0]) {
        onSave(transaction, { startDate: newStartDate });
      }
    }
    setEditing(false);
  }

  if (!transaction.permissions.edit) {
    return <span>{displayDate}</span>;
  }

  if (!editing) {
    return (
      <span
        className="cursor-text decoration-dotted underline-offset-2 hover:underline"
        onClick={() => {
          setDraft(displayDate);
          setEditing(true);
        }}
      >
        {displayDate}
      </span>
    );
  }

  return (
    <Input
      autoFocus
      aria-label={t("transactions.editableDateCell.date")}
      value={draft}
      placeholder={datePlaceholder()}
      onChange={(e) => setDraft(maskDate(e.target.value))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
      }}
      className="h-7 w-28"
    />
  );
}

function ParticipantsSummary({ participants }: { participants: ParticipantShare[] }) {
  const { t } = useTranslation();

  if (participants.length === 0) {
    return (
      <Text variant="caption" className="text-muted-foreground/50">
        —
      </Text>
    );
  }

  if (participants.length === 1) {
    const [participant] = participants;
    return (
      <span className="inline-flex items-center gap-1.5">
        <Avatar size="sm">
          <AvatarFallback>{getFirstAndLastInitials(participant.name)}</AvatarFallback>
        </Avatar>
        <Text>{participant.name}</Text>
      </span>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1" title={participants.map((p) => p.name).join(", ")}>
      <UsersIcon className="h-3 w-3" />
      {t("transactions.transactionCells.people", { count: participants.length })}
    </Badge>
  );
}

function EditableParticipantsCell({
  transaction,
  members,
  onSave,
}: {
  transaction: Transaction;
  members: PlanMember[];
  onSave: (transaction: Transaction, body: InlineSaveBody) => void;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>([]);

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraft(transaction.participants.map((p) => p.id));
    } else {
      const original = transaction.participants
        .map((p) => p.id)
        .sort()
        .join(",");
      const current = [...draft].sort().join(",");
      if (original !== current) {
        onSave(transaction, {
          participants: draft.map((memberId) => ({ memberId })),
          splitMode: "EQUAL",
        });
      }
    }
    setOpen(next);
  }

  function toggle(userId: number) {
    setDraft((prev) =>
      prev.includes(userId) ? prev.filter((x) => x !== userId) : [...prev, userId],
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="cursor-pointer rounded text-left decoration-dotted underline-offset-2 hover:underline"
          />
        }
      >
        <ParticipantsSummary participants={transaction.participants} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-56 gap-1"
        aria-label={t("transactions.editableParticipantsCell.participants")}
      >
        {members.map((member) => (
          <label
            key={member.userId}
            className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-1.5 py-1"
          >
            <Checkbox
              checked={draft.includes(member.userId)}
              onCheckedChange={() => toggle(member.userId)}
            />
            <Text className="flex-1">{member.name}</Text>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

type DescriptionCellProps = EditableCellProps;

export function DescriptionCell({ transaction, onSave }: DescriptionCellProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5">
      <EditableDescriptionCell transaction={transaction} onSave={onSave} />
      {transaction.seriesId && (
        <Badge variant="secondary" className="gap-1">
          <RepeatIcon />
          {t("transactions.descriptionCell.series")}
        </Badge>
      )}
    </div>
  );
}

type ParticipantsCellProps = {
  transaction: Transaction;
  members: PlanMember[];
  canEdit?: boolean;
  onSave: (transaction: Transaction, body: InlineSaveBody) => void;
};

export function ParticipantsCell({ transaction, members, canEdit, onSave }: ParticipantsCellProps) {
  if (!canEdit || !transaction.permissions.edit) {
    return <ParticipantsSummary participants={transaction.participants} />;
  }
  return <EditableParticipantsCell transaction={transaction} members={members} onSave={onSave} />;
}

type ActionsCellProps = {
  transaction: Transaction;
  isDeleting?: boolean;
  onDuplicate: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function ActionsCell({
  transaction,
  isDeleting,
  onDuplicate,
  onEdit,
  onDelete,
}: ActionsCellProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within/row:opacity-100 sm:group-hover/row:opacity-100">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-muted-foreground hover:bg-accent hover:text-foreground rounded p-1"
        aria-label={t("transactions.actionsCell.duplicate")}
        onClick={() => onDuplicate(transaction)}
      >
        <CopyIcon className="h-4 w-4" />
      </Button>
      {transaction.permissions.edit && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-accent hover:text-foreground rounded p-1"
          aria-label={t("transactions.actionsCell.edit")}
          onClick={() => onEdit(transaction)}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
      {transaction.permissions.delete && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-accent hover:text-destructive rounded p-1"
          aria-label={t("common.delete")}
          disabled={isDeleting}
          onClick={() => onDelete(transaction)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
