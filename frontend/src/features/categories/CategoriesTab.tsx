import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { Button } from "@/components/button/base/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/base/Card";
import { Skeleton } from "@/components/skeleton/base/Skeleton";
import { cn } from "@/lib/mergeClasses";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useMemberColors, type MemberColorOf } from "@/utils/memberColors";
import { buildCategoryTree, type CategoryTreeRoot } from "./categoryTree";
import { CATEGORY_GRID_COLUMNS, CategoryTreeRow } from "./components/CategoryTreeRow";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";

const SECTION_TITLES = { DEBIT: "Expenses", CREDIT: "Income" } as const;

type CategorySectionProps = {
  title: string;
  roots: CategoryTreeRoot[];
  colorOf: MemberColorOf;
  canManage: boolean;
  onEdit: (category: FinancialTransactionCategory) => void;
  onDelete: (category: FinancialTransactionCategory) => void;
  onAddChild: (root: FinancialTransactionCategory) => void;
};

const CategorySection = ({
  title,
  roots,
  colorOf,
  canManage,
  onEdit,
  onDelete,
  onAddChild,
}: CategorySectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {roots.length === 0 ? (
        <p className="text-muted-foreground flex h-16 items-center justify-center text-sm">
          No categories yet.
        </p>
      ) : (
        <div className="flex flex-col">
          <div
            className={cn(
              "text-muted-foreground hidden border-b pb-2 text-xs font-medium",
              CATEGORY_GRID_COLUMNS,
            )}
          >
            <span>Name</span>
            <span>Owner</span>
            <span className="text-right">Monthly limit</span>
            <span>Per member</span>
            <span className="sr-only">Actions</span>
          </div>
          {roots.map((root) => (
            <div key={root.category.id} className="border-b last:border-0">
              <CategoryTreeRow
                category={root.category}
                colorOf={colorOf}
                canManage={canManage}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
              {root.children.map((child, index) => (
                <CategoryTreeRow
                  key={child.id}
                  category={child}
                  child={{ isLast: index === root.children.length - 1 }}
                  colorOf={colorOf}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

/** Category management: structure and configured limits, no spend (UX-01). */
export const CategoriesTab = () => {
  const { activePlan } = usePlanContext();
  const canManage = activePlan?.myRole === "OWNER";
  const { openCreate, openEdit } = useCategoryFormSheet();
  const colorOf = useMemberColors();

  const { data: categoriesPage, isLoading } =
    useGetFinancialTransactionCategories({ size: ALL_CATEGORIES_PAGE_SIZE });
  const categories = useMemo(
    () => categoriesPage?.content ?? [],
    [categoriesPage],
  );
  const sections = useMemo(() => buildCategoryTree(categories), [categories]);

  const [deleting, setDeleting] = useState<FinancialTransactionCategory | null>(
    null,
  );

  const handleEdit = (category: FinancialTransactionCategory) =>
    void openEdit(category);

  const handleAddChild = (root: FinancialTransactionCategory) =>
    void openCreate({ parentId: root.id });

  return (
    <div className="flex flex-col gap-6 px-4">
      {canManage && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button onClick={() => void openCreate()}>
            <PlusIcon className="h-4 w-4" />
            New Category
          </Button>
        </div>
      )}

      {isLoading || !categoriesPage ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <CategorySection
              key={section.type}
              title={SECTION_TITLES[section.type]}
              roots={section.roots}
              colorOf={colorOf}
              canManage={canManage}
              onEdit={handleEdit}
              onDelete={setDeleting}
              onAddChild={handleAddChild}
            />
          ))}
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
