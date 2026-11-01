import type { ReactNode } from "react";
import { Download, Globe, LogOut } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/avatar/base/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { AppVersion } from "@/components/appVersion/AppVersion";
import { getFirstAndLastInitials } from "@/utils/string/formatters";

type NavbarViewProps = {
  userName: string;
  onSignOut: () => void;
  onOpenTimeZone: () => void;
  // Slots, so the plan switcher and theme toggle (which read context) stay in the container.
  planSwitcher: ReactNode;
  themeToggle: ReactNode;
  // Slot: the dialog reads the profile, so its container stays outside the view.
  timeZoneDialog: ReactNode;
  /** Set while a newer version waits: adds the menu item and the dot on the avatar. */
  update?: { version: string; onUpdate: () => void };
};

export function NavbarView({
  userName,
  onSignOut,
  onOpenTimeZone,
  planSwitcher,
  themeToggle,
  timeZoneDialog,
  update,
}: NavbarViewProps) {
  return (
    <nav className="border-border bg-background fixed z-20 flex h-[calc(4rem+env(safe-area-inset-top))] w-full items-center justify-between border-b px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-4">
        <img src={"/findraco-logo-128.png"} alt="findraco logo" className="h-8" />
        {planSwitcher}
      </div>

      <div className="flex items-center gap-2">
        {themeToggle}

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:cursor-pointer focus:outline-none">
            <Avatar size="lg">
              <AvatarFallback>
                {getFirstAndLastInitials(userName)}
              </AvatarFallback>
              {update && (
                <AvatarBadge>
                  <span className="sr-only">Update available</span>
                </AvatarBadge>
              )}
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {update && (
              <DropdownMenuItem
                className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
                onClick={update.onUpdate}
              >
                Update to {update.version}
                <Download className="text-foreground" />
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={onOpenTimeZone}
            >
              Time zone
              <Globe className="text-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={onSignOut}
            >
              Logout
              <LogOut className="text-foreground" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex justify-center px-2 py-1.5">
              <AppVersion />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {timeZoneDialog}
    </nav>
  );
}
