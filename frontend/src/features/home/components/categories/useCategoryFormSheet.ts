import type { FinancialTransactionCategory } from "@/api/dtos";
import { createContext, useContext } from "react";
import type { CategoryFormDefaults } from "./CategoryFormSheet";

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
