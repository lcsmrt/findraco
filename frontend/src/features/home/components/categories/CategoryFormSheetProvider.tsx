import type { FinancialTransactionCategory } from "@/api/dtos";
import { useRef, useState, type ReactNode } from "react";
import type { CategoryFormDefaults } from "./categoryForm";
import { CategoryFormSheet } from "./CategoryFormSheet";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
} from "./useCategoryFormSheet";

type SheetState =
  | { open: false }
  | { open: true; mode: "create"; defaults?: CategoryFormDefaults }
  | { open: true; mode: "edit"; category: FinancialTransactionCategory };

type CategoryFormSheetProviderProps = {
  children: ReactNode;
};

/** One category form for the app; callers await the saved category (or null on cancel). */
export const CategoryFormSheetProvider = ({
  children,
}: CategoryFormSheetProviderProps) => {
  const [state, setState] = useState<SheetState>({ open: false });
  const resolverRef = useRef<
    ((category: FinancialTransactionCategory | null) => void) | null
  >(null);

  const openWith = (next: SheetState) => {
    resolverRef.current?.(null);
    setState(next);
    return new Promise<FinancialTransactionCategory | null>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const value: CategoryFormSheetContextValue = {
    openCreate: (defaults) => openWith({ open: true, mode: "create", defaults }),
    openEdit: (category) => openWith({ open: true, mode: "edit", category }),
  };

  const handleSuccess = (saved: FinancialTransactionCategory) => {
    resolverRef.current?.(saved);
    resolverRef.current = null;
  };

  const handleClose = () => {
    resolverRef.current?.(null);
    resolverRef.current = null;
    setState({ open: false });
  };

  return (
    <CategoryFormSheetContext.Provider value={value}>
      {children}
      <CategoryFormSheet
        open={state.open}
        onOpenChange={(isOpen) => !isOpen && handleClose()}
        mode={state.open ? state.mode : "create"}
        category={state.open && state.mode === "edit" ? state.category : null}
        defaults={
          state.open && state.mode === "create" ? state.defaults : undefined
        }
        onSuccess={handleSuccess}
        onNewSubcategory={(root) =>
          void openWith({
            open: true,
            mode: "create",
            defaults: { parentId: root.id },
          })
        }
      />
    </CategoryFormSheetContext.Provider>
  );
};
