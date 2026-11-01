import { useAppUpdate } from "@/app/providers/useAppUpdate";
import { useAuth } from "@/app/providers/useAuth";
import { useInstallApp } from "@/app/providers/useInstallApp";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { TimeZoneDialog } from "@/features/profile/components/TimeZoneDialog";
import { PlanSwitcher } from "@/features/plans/components/PlanSwitcher";
import { useState } from "react";
import { InstallInstructionsDialogView } from "./InstallInstructionsDialogView";
import { NavbarView } from "./NavbarView";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { state, update } = useAppUpdate();
  const { mode, install, instructionsOpen, closeInstructions } = useInstallApp();
  const [timeZoneOpen, setTimeZoneOpen] = useState(false);

  return (
    <>
      <NavbarView
        userName={user?.name ?? ""}
        onSignOut={signOut}
        onOpenTimeZone={() => setTimeZoneOpen(true)}
        timeZoneDialog={
          <TimeZoneDialog open={timeZoneOpen} onOpenChange={setTimeZoneOpen} />
        }
        planSwitcher={<PlanSwitcher />}
        themeToggle={<ThemeToggle />}
        update={state.kind === "available" ? { version: state.version, onUpdate: update } : undefined}
        install={mode ? { onInstall: install } : undefined}
      />
      {mode === "ios" && (
        <InstallInstructionsDialogView
          open={instructionsOpen}
          onOpenChange={(open) => {
            if (!open) closeInstructions();
          }}
        />
      )}
    </>
  );
}
