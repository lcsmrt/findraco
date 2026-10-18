import { User } from "@/api/dtos/user";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type AuthStatus =
  "loading" | "authenticated" | "anonymous" | "unreachable";

export type AuthContextValue = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  status: AuthStatus;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
  /** Shows the expiry toast once if the session expired during start-up. */
  announceSessionExpiry: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
