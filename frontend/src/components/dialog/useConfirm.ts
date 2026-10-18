import { createContext, useContext } from "react";

export type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
};

export type ConfirmDialogContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

export const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  return context.confirm;
}
