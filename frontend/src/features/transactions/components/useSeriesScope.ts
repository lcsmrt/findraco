import { SeriesEditScope } from "@/api/dtos/transaction";
import { createContext, useContext } from "react";

export type ScopeDialogOptions = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive";
  /** The scopes offered, in their usual order; every scope when unset. */
  scopes?: SeriesEditScope[];
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
