import { Toaster } from "./layout/Toaster";
import { AppProvider } from "./providers/AppProvider";
import { AppRouter } from "./routing/AppRouter";

export const App = () => {
  return (
    <AppProvider>
      <Toaster />
      <AppRouter />
    </AppProvider>
  );
};
