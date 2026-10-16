import { setAccessToken } from "@/api/clients/accessToken";
import {
  renewSession,
  setSessionExpiredHandler,
} from "@/api/clients/findracoApi";
import { User } from "@/api/dtos/user";
import { getUserProfile, logout } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import {
  clearSessionStorage,
  getItemFromStorage,
  storeItem,
} from "@/lib/storage";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type AuthStatus =
  "loading" | "authenticated" | "anonymous" | "unreachable";

type AuthContextParams = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  status: AuthStatus;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
  /** Shows the expiry toast once if the session expired during start-up. */
  announceSessionExpiry: () => void;
};

const SESSION_EXPIRED_MESSAGE = "Your session expired. Please sign in again.";

// Written by the previous version, which kept the access token in localStorage.
const LEGACY_ACCESS_TOKEN_KEY = "accessToken";

const AuthContext = createContext<AuthContextParams>({
  user: null,
  setUser: () => {},
  status: "loading",
  signIn: async () => {},
  signOut: async () => {},
  retry: () => {},
  announceSessionExpiry: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [status, setStatusState] = useState<AuthStatus>(() =>
    getItemFromStorage<boolean>("hasSession") ? "loading" : "anonymous",
  );
  const statusRef = useRef(status);
  // Path where the session expired during start-up. Only the route guard
  // announces it, so a public page stays silent.
  const startUpExpiryPathRef = useRef<string | null>(null);

  const setStatus = useCallback((next: AuthStatus) => {
    statusRef.current = next;
    setStatusState(next);
  }, []);

  const loadProfile = useCallback(async () => {
    const profile = await queryClient.fetchQuery({
      queryKey: ["profile"],
      queryFn: getUserProfile,
    });
    setUser(profile);
    setStatus("authenticated");
  }, [queryClient, setStatus]);

  const endSession = useCallback(() => {
    setAccessToken(null);
    queryClient.clear();
    clearSessionStorage();
    setUser(null);
    setStatus("anonymous");
  }, [queryClient, setStatus]);

  const expireSession = useCallback(() => {
    const wasAuthenticated = statusRef.current === "authenticated";
    endSession();
    // At start-up the route guard redirects private pages itself, so a public
    // page (e.g. a reset-password link) is not taken away from the user.
    if (wasAuthenticated) {
      toast.error(SESSION_EXPIRED_MESSAGE);
      navigate(PATHS.login, { replace: true, state: { from: location } });
    } else {
      startUpExpiryPathRef.current = location.pathname;
    }
  }, [endSession, navigate, location]);

  const announceSessionExpiry = useCallback(() => {
    if (startUpExpiryPathRef.current !== location.pathname) return;
    startUpExpiryPathRef.current = null;
    toast.error(SESSION_EXPIRED_MESSAGE);
  }, [location.pathname]);

  useEffect(() => {
    setSessionExpiredHandler(expireSession);
  }, [expireSession]);

  const resumeSession = useCallback(async () => {
    setStatus("loading");
    try {
      await renewSession();
      await loadProfile();
    } catch {
      // An expired session already went through expireSession (anonymous);
      // anything else means the API could not be reached.
      if (statusRef.current === "loading") setStatus("unreachable");
    }
  }, [loadProfile, setStatus]);

  useEffect(() => {
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    // Start-up only; later sessions begin through signIn.
    if (statusRef.current === "loading") resumeSession();
  }, [resumeSession]);

  const signIn = useCallback(
    async (token: string) => {
      setAccessToken(token);
      storeItem("hasSession", true);
      await loadProfile();
    },
    [loadProfile],
  );

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Signing out must work offline too; the session cookie then expires on its own.
    }
    endSession();
    navigate(PATHS.login, { replace: true });
  }, [endSession, navigate]);

  const retry = useCallback(() => {
    resumeSession();
  }, [resumeSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        status,
        signIn,
        signOut,
        retry,
        announceSessionExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("The useAuth hook must be used within a AuthProvider");
  return context;
};
