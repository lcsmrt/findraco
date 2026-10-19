import type { ReactNode } from "react";
import { AppVersion } from "@/components/appVersion/AppVersion";
import { Text } from "@/components/typography/base/Text";

type AuthLayoutViewProps = {
  // A slot, so the theme toggle (which reads the theme context) stays in the container.
  themeToggle: ReactNode;
  children: ReactNode;
};

export function AuthLayoutView({ themeToggle, children }: AuthLayoutViewProps) {
  return (
    <main className="bg-background relative flex min-h-dvh flex-col items-center justify-center gap-5 p-5">
      <div className="absolute top-3 right-3">{themeToggle}</div>

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

      {children}

      <footer className="flex flex-1 flex-col items-center justify-end">
        <Text as="p" variant="caption">
          © 2026 findraco
        </Text>
        <AppVersion />
      </footer>
    </main>
  );
}
