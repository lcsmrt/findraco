import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  useGetCategorySpending,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { Button } from "@/components/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/Card";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  resolvePeriodDates,
  type Period,
} from "../../filters/homeFilterParams";
import { useHomeFilters } from "../../hooks/useHomeFilters";
import { countMonths, scaleTreeLimits } from "../../utils/scaleLimits";
import { PeriodPicker } from "../PeriodPicker";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useCategoryFormSheet,
} from "./CategoryFormSheet";
import { CategoryTreeRow, type CategoryRowData } from "./CategoryTreeRow";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

type CategorySectionProps = {
  title: string;
  rows: CategoryRowData[];
  canManage: boolean;
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number) => void;
};

const CategorySection = ({
  title,
  rows,
  canManage,
  onEdit,
  onDelete,
}: CategorySectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
        <p className="text-muted-foreground flex h-16 items-center justify-center text-sm">
          No categories yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {rows.map((root) => (
            <div key={root.categoryId} className="border-b last:border-0">
              <CategoryTreeRow
                row={root}
                canManage={canManage}
                onEdit={onEdit}
                onDelete={onDelete}
                className={root.children.length > 0 ? "border-0" : undefined}
              />
              {root.children.map((child) => (
                <CategoryTreeRow
                  key={child.categoryId}
                  row={child}
                  isChild
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  className="border-0 border-t border-dashed"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export const CategoriesTab = () => {
  const { categories: filters, updateCategories } = useHomeFilters();
  const { period, customRange } = filters;
  const { activePlan } = usePlanContext();
  const canManage = activePlan?.myRole === "OWNER";
  const { openCreate, openEdit } = useCategoryFormSheet();

  const customFrom = customRange?.from;
  const customTo = customRange?.to;
  const range = useMemo(
    () =>
      customFrom && customTo
        ? { startDate: customFrom, endDate: customTo }
        : resolvePeriodDates(period, new Date()),
    [period, customFrom, customTo],
  );

  const { data: spending, isLoading } = useGetCategorySpending(range);
  const { data: categoriesPage } = useGetFinancialTransactionCategories(
    { size: ALL_CATEGORIES_PAGE_SIZE },
    { enabled: canManage },
  );
  const categories = useMemo(
    () => categoriesPage?.content ?? [],
    [categoriesPage],
  );

  const monthCount = countMonths(range.startDate, range.endDate);
  const rows = useMemo(
    () => (spending ? scaleTreeLimits(spending, monthCount) : []),
    [spending, monthCount],
  );
  const expenseRows = rows.filter((r) => r.type === "DEBIT");
  const incomeRows = rows.filter((r) => r.type === "CREDIT");

  const [deleting, setDeleting] = useState<FinancialTransactionCategory | null>(
    null,
  );

  const findCategory = (categoryId: number) =>
    categories.find((c) => c.id === categoryId);

  const handleEdit = (categoryId: number) => {
    const category = findCategory(categoryId);
    if (category) void openEdit(category);
  };

  const handleDelete = (categoryId: number) =>
    setDeleting(findCategory(categoryId) ?? null);

  const handlePeriodChange = (p: Period) =>
    updateCategories((c) => ({ ...c, period: p, customRange: null }));

  const handleCustomRangeChange = (
    next: { from: string; to: string } | null,
  ) => updateCategories((c) => ({ ...c, customRange: next }));

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <PeriodPicker
            period={period}
            customRange={customRange}
            onPeriodChange={handlePeriodChange}
            onCustomRangeChange={handleCustomRangeChange}
          />
        </div>
        {canManage && (
          <Button onClick={() => void openCreate()}>
            <PlusIcon className="h-4 w-4" />
            New Category
          </Button>
        )}
      </div>

      {isLoading || !spending ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <CategorySection
            title="Expenses"
            rows={expenseRows}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <CategorySection
            title="Income"
            rows={incomeRows}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {canManage && (
        <DeleteCategoryDialog
          open={deleting != null}
          onOpenChange={(open) => {
            if (!open) setDeleting(null);
          }}
          category={deleting}
          categories={categories}
        />
      )}
    </div>
  );
};
