import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/avatar/base/Avatar";
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
  // Slots, so the plan switcher and theme toggle (which read context) stay in the container.
  planSwitcher: ReactNode;
  themeToggle: ReactNode;
};

export function NavbarView({ userName, onSignOut, planSwitcher, themeToggle }: NavbarViewProps) {
  return (
    <nav className="border-border bg-background fixed z-20 flex h-16 w-full items-center justify-between border-b px-4">
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
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
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
    </nav>
  );
}
