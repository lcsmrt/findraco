import type { CategorySpending } from "@/api/dtos";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { cn } from "@/lib/mergeClasses";
import { formatCurrency } from "@/utils/string/formatters";
import { cva } from "class-variance-authority";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { ScaledNode } from "../../utils/scaleLimits";

export type CategoryRowData = ScaledNode<CategorySpending>;

const WARNING_THRESHOLD = 80;

type UsageStatus = "ok" | "warning" | "over";

const usageStatus = (row: CategoryRowData): UsageStatus | null => {
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
          {row.ownerName && (
            <Badge variant="outline">{row.ownerName}</Badge>
          )}
          {status === "over" && <Badge variant="destructive">Over limit</Badge>}
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
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={usageBarVariants({ status })}
            style={{ width: `${Math.min(row.percentUsed, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
