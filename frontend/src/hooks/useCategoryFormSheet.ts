import type { Category } from "@/api/dtos";
import type { TransactionType } from "@/api/dtos/transaction";
import { createContext, useContext } from "react";

export type CategoryFormDefaults = {
  description?: string;
  type?: TransactionType;
  /** Starts a subcategory of this root; the type follows the parent. */
  parentId?: number;
};

export type CategoryFormSheetContextValue = {
  openCreate: (
    defaults?: CategoryFormDefaults,
  ) => Promise<Category | null>;
  openEdit: (
    category: Category,
  ) => Promise<Category | null>;
};

export const CategoryFormSheetContext = createContext<CategoryFormSheetContextValue | null>(null);

export function useCategoryFormSheet() {
  const context = useContext(CategoryFormSheetContext);
  if (!context) {
    throw new Error("useCategoryFormSheet must be used within a CategoryFormSheetProvider");
  }
  return context;
}
