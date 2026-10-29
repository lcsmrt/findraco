import type { Category } from "@/api/dtos";
import { useRef, useState, type ReactNode } from "react";
import { CategoryFormSheet } from "./CategoryFormSheet";
import {
  CategoryFormSheetContext,
  type CategoryFormDefaults,
  type CategoryFormSheetContextValue,
} from "@/hooks/useCategoryFormSheet";

type SheetState =
  | { open: false }
  | { open: true; mode: "create"; defaults?: CategoryFormDefaults }
  | { open: true; mode: "edit"; category: Category };

type CategoryFormSheetProviderProps = {
  children: ReactNode;
};

/** One category form for the app; callers await the saved category (or null on cancel). */
export function CategoryFormSheetProvider({
  children,
}: CategoryFormSheetProviderProps) {
  const [state, setState] = useState<SheetState>({ open: false });
  const resolverRef = useRef<
    ((category: Category | null) => void) | null
  >(null);

  function openWith(next: SheetState) {
    resolverRef.current?.(null);
    setState(next);
    return new Promise<Category | null>((resolve) => {
      resolverRef.current = resolve;
    });
  }

  const value: CategoryFormSheetContextValue = {
    openCreate: (defaults) => openWith({ open: true, mode: "create", defaults }),
    openEdit: (category) => openWith({ open: true, mode: "edit", category }),
  };

  function handleSuccess(saved: Category) {
    resolverRef.current?.(saved);
    resolverRef.current = null;
  }

  function handleClose() {
    resolverRef.current?.(null);
    resolverRef.current = null;
    setState({ open: false });
  }

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
}
