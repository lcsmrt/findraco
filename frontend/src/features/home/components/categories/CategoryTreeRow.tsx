import type { CategorySpending, CategorySpendingMember } from "@/api/dtos";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { cn } from "@/lib/mergeClasses";
import { formatCurrency } from "@/utils/string/formatters";
import { cva } from "class-variance-authority";
import { ChevronDownIcon, PencilIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useState } from "react";
import type { ScaledNode } from "../../utils/scaleLimits";

export type CategoryRowData = ScaledNode<CategorySpending>;

const WARNING_THRESHOLD = 80;

type UsageStatus = "ok" | "warning" | "over";

type Usage = {
  limit?: number | null;
  percentUsed?: number | null;
  overLimit?: boolean | null;
};

const usageStatus = (row: Usage): UsageStatus | null => {
  if (row.limit == null || row.percentUsed == null) return null;
  if (row.overLimit) return "over";
  return row.percentUsed >= WARNING_THRESHOLD ? "warning" : "ok";
};

const usageBarVariants = cva("h-full rounded-full", {
  variants: {
    status: {
      ok: "bg-success",
      warning: "bg-orange-500",
      over: "bg-destructive",
    },
  },
});

type UsageBarProps = {
  status: UsageStatus;
  percentUsed: number;
  className?: string;
};

const UsageBar = ({ status, percentUsed, className }: UsageBarProps) => (
  <div className={cn("bg-muted h-1.5 w-full overflow-hidden rounded-full", className)}>
    <div
      className={usageBarVariants({ status })}
      style={{ width: `${Math.min(percentUsed, 100)}%` }}
    />
  </div>
);

type MemberRowProps = {
  member: CategorySpendingMember;
};

/** One member's spend against their own limit (CAT-12); a former member is greyed and not evaluated (CAT-14). */
const MemberRow = ({ member }: MemberRowProps) => {
  const status = member.active ? usageStatus(member) : null;
  return (
    <div
      className={cn(
        "flex flex-col gap-1 py-1.5 pl-4 text-xs",
        !member.active && "text-muted-foreground opacity-70",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate">{member.name}</span>
          {!member.active && <Badge variant="outline">Former member</Badge>}
          {status === "over" && <Badge variant="destructive">Over limit</Badge>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="tabular-nums">
            {formatCurrency(member.spent, "BRL")}
            {member.limit != null && (
              <span className="text-muted-foreground">
                {" / "}
                {formatCurrency(member.limit, "BRL")}
              </span>
            )}
          </span>
          <span
            className={cn(
              "w-14 text-right tabular-nums",
              status === "over" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {member.percentUsed != null ? `${member.percentUsed}%` : ""}
          </span>
        </div>
      </div>
      {status && member.percentUsed != null && (
        <UsageBar status={status} percentUsed={member.percentUsed} className="h-1" />
      )}
    </div>
  );
};

type CategoryTreeRowProps = {
  row: CategoryRowData;
  isChild?: boolean;
  canManage: boolean;
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number) => void;
  className?: string;
};

export const CategoryTreeRow = ({
  row,
  isChild = false,
  canManage,
  onEdit,
  onDelete,
  className,
}: CategoryTreeRowProps) => {
  const status = usageStatus(row);
  const [showMembers, setShowMembers] = useState(false);
  const members = row.members ?? [];

  return (
    <div
      className={cn(
        "group/row flex flex-col gap-1.5 border-b py-3 last:border-0",
        isChild && "pl-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn("truncate", isChild ? "text-sm" : "font-medium")}
          >
            {row.name}
          </span>
          {row.ownerName &&
            (row.ownerActive === false ? (
              <Badge variant="outline" className="text-muted-foreground opacity-70">
                {row.ownerName} (former member)
              </Badge>
            ) : (
              <Badge variant="outline">{row.ownerName}</Badge>
            ))}
          {status === "over" && <Badge variant="destructive">Over limit</Badge>}
          {members.length > 0 && (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              aria-expanded={showMembers}
              aria-label={`${showMembers ? "Hide" : "Show"} members of ${row.name}`}
              className="text-muted-foreground"
              onClick={() => setShowMembers((open) => !open)}
            >
              <UsersIcon />
              {members.length}
              <ChevronDownIcon
                className={cn("transition-transform", showMembers && "rotate-180")}
              />
            </Button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm tabular-nums">
            {formatCurrency(row.spent, "BRL")}
            {row.limit != null && (
              <span className="text-muted-foreground">
                {" / "}
                {formatCurrency(row.limit, "BRL")}
              </span>
            )}
          </span>
          {row.percentUsed != null && (
            <span
              className={cn(
                "w-14 text-right text-xs tabular-nums",
                status === "over" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {row.percentUsed}%
            </span>
          )}
          {canManage && (
            <div className="flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within/row:opacity-100 sm:group-hover/row:opacity-100">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={`Edit ${row.name}`}
                className="text-muted-foreground hover:text-foreground rounded"
                onClick={() => onEdit(row.categoryId)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={`Delete ${row.name}`}
                className="text-muted-foreground hover:text-destructive rounded"
                onClick={() => onDelete(row.categoryId)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {status && row.percentUsed != null && (
        <UsageBar status={status} percentUsed={row.percentUsed} />
      )}
      {showMembers && members.length > 0 && (
        <div className="flex flex-col border-l">
          {members.map((member) => (
            <MemberRow key={member.memberId} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};
