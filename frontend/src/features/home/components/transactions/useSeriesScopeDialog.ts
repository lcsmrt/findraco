import { SeriesEditScope } from "@/api/dtos/financialTransaction";
import { createContext, useContext } from "react";

export type ScopeDialogOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive";
};

export type SeriesScopeDialogContextValue = {
  chooseScope: (options?: ScopeDialogOptions) => Promise<SeriesEditScope | null>;
};

export const SeriesScopeDialogContext = createContext<SeriesScopeDialogContextValue | null>(null);

export function useSeriesScope() {
  const context = useContext(SeriesScopeDialogContext);
  if (!context) {
    throw new Error("useSeriesScope must be used within a SeriesScopeDialogProvider");
  }
  return context.chooseScope;
}
