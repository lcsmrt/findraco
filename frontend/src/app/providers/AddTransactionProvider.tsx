import { SeriesScopeDialogProvider } from "@/features/transactions/components/SeriesScopeDialogProvider";
import { TransactionFormDrawer } from "@/features/transactions/components/TransactionFormDrawer";
import { useMemo, useState, type ReactNode } from "react";
import { AddTransactionContext, type AddTransactionPreset } from "./useAddTransaction";

type AddState = {
  open: boolean;
  /** Kept while the form closes, so it does not change under its own exit animation. */
  preset?: AddTransactionPreset;
};

type AddTransactionProviderProps = {
  children: ReactNode;
};

/**
 * The one New Transaction form of the main screens. Any screen under it opens it, plain or as a contact
 * payment, without importing the transactions feature.
 */
export function AddTransactionProvider({ children }: AddTransactionProviderProps) {
  const [state, setState] = useState<AddState>({ open: false });

  const value = useMemo(
    () => ({ openAdd: (preset?: AddTransactionPreset) => setState({ open: true, preset }) }),
    [],
  );

  return (
    <AddTransactionContext.Provider value={value}>
      {children}
      {/* The form asks which occurrences a series edit applies to; this one only creates, but it needs the dialog. */}
      <SeriesScopeDialogProvider>
        <TransactionFormDrawer
          open={state.open}
          onOpenChange={(open) => setState((current) => ({ ...current, open }))}
          mode="create"
          preset={state.preset}
        />
      </SeriesScopeDialogProvider>
    </AddTransactionContext.Provider>
  );
}
