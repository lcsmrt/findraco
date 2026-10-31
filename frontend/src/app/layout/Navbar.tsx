import { useAuth } from "@/app/providers/useAuth";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { TimeZoneDialog } from "@/features/profile/components/TimeZoneDialog";
import { PlanSwitcher } from "@/features/plans/components/PlanSwitcher";
import { useState } from "react";
import { NavbarView } from "./NavbarView";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [timeZoneOpen, setTimeZoneOpen] = useState(false);

  return (
    <NavbarView
      userName={user?.name ?? ""}
      onSignOut={signOut}
      onOpenTimeZone={() => setTimeZoneOpen(true)}
      timeZoneDialog={
        <TimeZoneDialog open={timeZoneOpen} onOpenChange={setTimeZoneOpen} />
      }
      planSwitcher={<PlanSwitcher />}
      themeToggle={<ThemeToggle />}
    />
  );
}
