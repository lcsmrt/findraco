import { useAuth } from "@/app/providers/useAuth";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";
import { SessionStatusView } from "./SessionStatusView";

export function PrivateRoute() {
  const location = useLocation();
  const { status, retry, announceSessionExpiry } = useAuth();

  useEffect(() => {
    if (status === "anonymous") announceSessionExpiry();
  }, [status, announceSessionExpiry]);

  if (status === "loading" || status === "unreachable") {
    return <SessionStatusView status={status} onRetry={retry} />;
  }

  if (status === "anonymous") {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
