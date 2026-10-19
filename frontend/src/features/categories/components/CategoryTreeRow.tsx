import type { FinancialTransactionCategory } from "@/api/dtos";
import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { formatMoney } from "@/utils/money";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { MemberColorOf } from "@/utils/memberColors";
import { MemberDot } from "@/components/memberDot/MemberDot";

const EMPTY = "—";

/** Desktop columns: Name | Owner | Monthly limit | Per member | actions. */
export const CATEGORY_GRID_COLUMNS =
  "sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_7.5rem_minmax(0,1.6fr)_6rem] sm:items-center sm:gap-x-4";

type TreeGuideProps = {
  isLast: boolean;
};

/** Thin ├ / └ guide that ties a child to its root. */
function TreeGuide({ isLast }: TreeGuideProps) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-2 w-4"
    >
      <span
        className={cn(
          "bg-border absolute top-0 left-0 w-px",
          isLast ? "h-1/2" : "h-full",
        )}
      />
      <span className="bg-border absolute top-1/2 left-0 h-px w-3" />
    </span>
  );
}

type OwnerLabelProps = {
  category: FinancialTransactionCategory;
  colorOf: MemberColorOf;
};

/** Owner name; a former member is greyed. */
function OwnerLabel({ category, colorOf }: OwnerLabelProps) {
  if (category.ownerId == null || !category.ownerName) return null;
  const former = category.ownerActive === false;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        former && "text-muted-foreground opacity-70",
      )}
    >
      <MemberDot
        color={former ? "var(--muted-foreground)" : colorOf(category.ownerId)}
      />
      <span className="truncate">
        {category.ownerName}
        {former && " (former member)"}
      </span>
    </span>
  );
}

type MemberLimitsProps = {
  category: FinancialTransactionCategory;
  colorOf: MemberColorOf;
};

/** Per-member limits as absolute amounts; former members greyed. */
function MemberLimits({ category, colorOf }: MemberLimitsProps) {
  const entries = category.memberLimits ?? [];
  if (entries.length === 0) return null;
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
      {entries.map((entry) => (
        <span
          key={entry.memberId}
          className={cn(
            "inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums",
            !entry.active && "text-muted-foreground opacity-70",
          )}
        >
          <MemberDot
            color={
              entry.active ? colorOf(entry.memberId) : "var(--muted-foreground)"
            }
          />
          {entry.memberName} {formatMoney(entry.amount)}
          {!entry.active && " (former member)"}
        </span>
      ))}
    </span>
  );
}

/** The configured monthly limit: the per-member sum, or the plain limit. */
function monthlyLimit(category: FinancialTransactionCategory) {
  return category.effectiveLimit ?? category.spendingLimit ?? null;
}

type CategoryTreeRowProps = {
  category: FinancialTransactionCategory;
  /** Position under its root; undefined for a root. */
  child?: { isLast: boolean };
  colorOf: MemberColorOf;
  canManage: boolean;
  onEdit: (category: FinancialTransactionCategory) => void;
  onDelete: (category: FinancialTransactionCategory) => void;
  onAddChild: (root: FinancialTransactionCategory) => void;
  className?: string;
};

/**
 * One category, configuration only. Wide: aligned columns with hover
 * actions. Narrow: a stacked row that opens the edit form on tap
 * Both layouts render; CSS shows one.
 */
export function CategoryTreeRow({
  category,
  child,
  colorOf,
  canManage,
  onEdit,
  onDelete,
  onAddChild,
  className,
}: CategoryTreeRowProps) {
  const isChild = child != null;
  const limit = monthlyLimit(category);
  const hasOwner = category.ownerId != null && !!category.ownerName;
  const hasMemberLimits = (category.memberLimits?.length ?? 0) > 0;
  const name = (
    <Text variant={isChild ? "body" : "title"} className="min-w-0 break-words">
      {category.description}
    </Text>
  );

  const narrowContent = (
    <>
      <span className="flex w-full items-baseline justify-between gap-3">
        {name}
        <Text className="shrink-0 tabular-nums">
          {limit != null ? (
            formatMoney(limit)
          ) : (
            <span className="text-muted-foreground">{EMPTY}</span>
          )}
        </Text>
      </span>
      {(hasOwner || hasMemberLimits) && (
        <Text variant="caption" className="flex flex-col gap-0.5">
          {hasOwner && <OwnerLabel category={category} colorOf={colorOf} />}
          {hasMemberLimits && (
            <MemberLimits category={category} colorOf={colorOf} />
          )}
        </Text>
      )}
    </>
  );

  return (
    <div className={cn("group/row relative", className)}>
      {child && <TreeGuide isLast={child.isLast} />}

      {/* Wide layout */}
      <Text as="div" className={cn("hidden py-2.5", CATEGORY_GRID_COLUMNS)}>
        <span className={cn("min-w-0", isChild && "pl-7")}>{name}</span>
        <span className="min-w-0">
          {hasOwner ? (
            <OwnerLabel category={category} colorOf={colorOf} />
          ) : (
            EMPTY
          )}
        </span>
        <span className="text-right tabular-nums">
          {limit != null ? formatMoney(limit) : EMPTY}
        </span>
        <Text variant="caption" className="min-w-0">
          {hasMemberLimits ? (
            <MemberLimits category={category} colorOf={colorOf} />
          ) : (
            EMPTY
          )}
        </Text>
        <span className="flex justify-end gap-0.5 opacity-0 transition-opacity group-focus-within/row:opacity-100 group-hover/row:opacity-100">
          {canManage && (
            <>
              {!isChild && (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`New subcategory of ${category.description}`}
                  className="text-muted-foreground hover:text-foreground rounded"
                  onClick={() => onAddChild(category)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={`Edit ${category.description}`}
                className="text-muted-foreground hover:text-foreground rounded"
                onClick={() => onEdit(category)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={`Delete ${category.description}`}
                className="text-muted-foreground hover:text-destructive rounded"
                onClick={() => onDelete(category)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </>
          )}
        </span>
      </Text>

      {/* Narrow layout: a tap opens the edit form for an OWNER, otherwise read-only. */}
      {canManage ? (
        <button
          type="button"
          onClick={() => onEdit(category)}
          className={cn(
            "active:bg-muted/60 flex w-full cursor-pointer flex-col gap-1 py-2.5 text-left sm:hidden",
            isChild && "pl-7",
          )}
        >
          {narrowContent}
        </button>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-1 py-2.5 sm:hidden",
            isChild && "pl-7",
          )}
        >
          {narrowContent}
        </div>
      )}
    </div>
  );
}
