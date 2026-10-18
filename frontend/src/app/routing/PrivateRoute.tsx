import { useAuth } from "@/app/providers/useAuth";
import { Button } from "@/components/button/base/Button";
import { Spinner } from "@/components/spinner/base/Spinner";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";

export const PrivateRoute = () => {
  const location = useLocation();
  const { status, retry, announceSessionExpiry } = useAuth();

  useEffect(() => {
    if (status === "anonymous") announceSessionExpiry();
  }, [status, announceSessionExpiry]);

  if (status === "loading") {
    return (
      <main className="bg-background flex min-h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  if (status === "unreachable") {
    return (
      <main className="bg-background flex min-h-dvh flex-col items-center justify-center gap-4">
        <p className="text-foreground">Can&apos;t reach findraco.</p>
        <Button onClick={retry}>Retry</Button>
      </main>
    );
  }

  if (status === "anonymous") {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
