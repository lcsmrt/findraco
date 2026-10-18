import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { tanStackQueryClient } from "./queryClient";

type TanStackQueryProviderProps = {
  children: ReactNode;
};

export const TanStackQueryProvider = ({
  children,
}: TanStackQueryProviderProps) => {
  return (
    <QueryClientProvider client={tanStackQueryClient}>
      {children}
    </QueryClientProvider>
  );
};
