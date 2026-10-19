import { AppVersion } from "@/components/appVersion/AppVersion";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { Text } from "@/components/typography/base/Text";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
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
          <Text variant="headline" className="text-foreground">
            findraco
          </Text>
        </div>
      </header>

      <Outlet />

      <footer className="flex flex-1 flex-col items-center justify-end">
        <Text as="p" variant="caption">
          © 2026 findraco
        </Text>
        <AppVersion />
      </footer>
    </main>
  );
}
