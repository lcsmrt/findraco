import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { PlanProvider } from "./PlanProvider";
import { TanStackQueryProvider } from "./TanStackQueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { CategoryFormSheetProvider } from "@/features/categories/components/CategoryFormSheetProvider";
import { SeriesScopeDialogProvider } from "@/features/transactions/components/SeriesScopeDialogProvider";

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter>
      <TanStackQueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <PlanProvider>
              <ConfirmDialogProvider>
                <SeriesScopeDialogProvider>
                  <CategoryFormSheetProvider>
                    {children}
                  </CategoryFormSheetProvider>
                </SeriesScopeDialogProvider>
              </ConfirmDialogProvider>
            </PlanProvider>
          </AuthProvider>
        </ThemeProvider>
      </TanStackQueryProvider>
    </BrowserRouter>
  );
};
