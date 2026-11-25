import { createContext, useContext } from "react";

/** How the add form starts when a screen opens it for a purpose: a contact paying what it owes. */
export type AddTransactionPreset = {
  contact: { id: number; name: string };
  /** The description the payment starts with, already in the language in use. */
  description: string;
};

export type AddTransactionContextValue = {
  /** Opens the add form, plain or from a preset. */
  openAdd: (preset?: AddTransactionPreset) => void;
};

export const AddTransactionContext = createContext<AddTransactionContextValue | null>(null);

export function useAddTransaction() {
  const context = useContext(AddTransactionContext);
  if (!context) throw new Error("useAddTransaction must be used within an AddTransactionProvider");
  return context;
}
