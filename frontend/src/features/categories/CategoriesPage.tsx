import type { Category } from "@/api/dtos";
import {
  ALL_CATEGORIES_PAGE_SIZE,
  useGetCategories,
} from "@/api/services/useCategoryService";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useMemo, useState } from "react";
import { useMemberColors } from "@/hooks/useMemberColors";
import { buildCategoryTree } from "./utils/categoryTree";
import { CategoriesPageView } from "./CategoriesPageView";
import { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";

/** Category management: structure and configured limits, no spend. */
export function CategoriesPage() {
  const { canManageCategories: canManage } = usePlanPermissions();
  const { openCreate, openEdit } = useCategoryFormSheet();
  const colorOf = useMemberColors();

  const { data: categoriesPage, isLoading } =
    useGetCategories({ size: ALL_CATEGORIES_PAGE_SIZE });
  const categories = useMemo(
    () => categoriesPage?.content ?? [],
    [categoriesPage],
  );
  const sections = useMemo(() => buildCategoryTree(categories), [categories]);

  const [deleting, setDeleting] = useState<Category | null>(
    null,
  );

  function handleEdit(category: Category) {
    void openEdit(category);
  }

  function handleAddChild(root: Category) {
    void openCreate({ parentId: root.id });
  }

  return (
    <>
      <CategoriesPageView
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
