import { createContext, useContext } from "react";
import type { UpdateState } from "./utils/appUpdate";

export type AppUpdateContextValue = {
  state: UpdateState;
  /** Moves the app to the newest version, then reloads. */
  update: () => void;
};

export const AppUpdateContext = createContext<AppUpdateContextValue | null>(null);

export function useAppUpdate() {
  const context = useContext(AppUpdateContext);
  if (!context) throw new Error("useAppUpdate must be used within an AppUpdateProvider");
  return context;
}
