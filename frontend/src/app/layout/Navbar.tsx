import { useAuth } from "@/app/providers/useAuth";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { PlanSwitcher } from "@/features/plans/components/PlanSwitcher";
import { NavbarView } from "./NavbarView";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <NavbarView
      userName={user?.name ?? ""}
      onSignOut={signOut}
      planSwitcher={<PlanSwitcher />}
      themeToggle={<ThemeToggle />}
    />
  );
}
