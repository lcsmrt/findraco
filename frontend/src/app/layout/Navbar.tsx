import { Avatar, AvatarFallback } from "@/components/avatar/base/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/base/Dropdown";
import { AppVersion } from "@/components/appVersion/AppVersion";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/providers/useAuth";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { getFirstAndLastInitials } from "@/utils/string/formatters";
import { PlanSwitcher } from "@/features/plans/components/PlanSwitcher";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-border bg-background fixed z-20 flex h-16 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <img src={"/findraco-logo-128.png"} alt="findraco logo" className="h-8" />
        <PlanSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:cursor-pointer focus:outline-none">
            <Avatar size="lg">
              <AvatarFallback>
                {getFirstAndLastInitials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={signOut}
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
};
