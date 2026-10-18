import { AppVersion } from "@/components/appVersion/AppVersion";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <main className="bg-background relative flex min-h-dvh flex-col items-center justify-center gap-5 p-5">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>

      <header className="flex flex-1 items-end">
        <div className="flex items-center gap-2">
          <img
            src="/findraco-logo-128.png"
            alt=""
            className="size-12"
          />
          <span className="text-foreground text-3xl font-bold tracking-tight">
            findraco
          </span>
        </div>
      </header>

      <Outlet />

      <footer className="flex flex-1 flex-col items-center justify-end">
        <p className="text-muted-foreground text-xs">© 2026 findraco</p>
        <AppVersion />
      </footer>
    </main>
  );
};
