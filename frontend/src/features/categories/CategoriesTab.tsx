import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetFinancialTransactionCategories,
} from "@/api/services/useFinancialTransactionCategoryService";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useMemo, useState } from "react";
import { useMemberColors } from "@/hooks/useMemberColors";
import { buildCategoryTree } from "./categoryTree";
import { CategoriesTabView } from "./CategoriesTabView";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";

/** Category management: structure and configured limits, no spend. */
export function CategoriesTab() {
  const { canManageCategories: canManage } = usePlanPermissions();
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

  function handleEdit(category: FinancialTransactionCategory) {
    void openEdit(category);
  }

  function handleAddChild(root: FinancialTransactionCategory) {
    void openCreate({ parentId: root.id });
  }

  return (
    <>
      <CategoriesTabView
        sections={isLoading || !categoriesPage ? null : sections}
        colorOf={colorOf}
        canManage={canManage}
        onCreate={() => void openCreate()}
        onEdit={handleEdit}
        onDelete={setDeleting}
        onAddChild={handleAddChild}
      />

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
    </>
  );
}
