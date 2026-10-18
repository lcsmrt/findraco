import type { FinancialTransactionCategory } from "@/api/dtos";
import type { FinancialTransactionType } from "@/api/dtos/financialTransaction";
import { createContext, useContext } from "react";

export type CategoryFormDefaults = {
  description?: string;
  type?: FinancialTransactionType;
  /** Starts a subcategory of this root; the type follows the parent (UX-02 AC 2). */
  parentId?: number;
};

export type CategoryFormSheetContextValue = {
  openCreate: (
    defaults?: CategoryFormDefaults,
  ) => Promise<FinancialTransactionCategory | null>;
  openEdit: (
    category: FinancialTransactionCategory,
  ) => Promise<FinancialTransactionCategory | null>;
};

export const CategoryFormSheetContext = createContext<CategoryFormSheetContextValue | null>(null);

export function useCategoryFormSheet() {
  const context = useContext(CategoryFormSheetContext);
  if (!context) {
    throw new Error("useCategoryFormSheet must be used within a CategoryFormSheetProvider");
  }
  return context;
}
