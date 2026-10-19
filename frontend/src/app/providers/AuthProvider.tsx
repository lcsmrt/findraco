import type { ReactNode } from "react";
import { AuthContext } from "./useAuth";
import { useAuthSession } from "./useAuthSession";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const session = useAuthSession();
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}
