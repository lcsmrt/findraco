import type { ReactNode } from "react";
import { Download, Globe, Languages, LogOut, Smartphone } from "lucide-react";
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
import { useTranslation } from "react-i18next";

type NavbarViewProps = {
  userName: string;
  onSignOut: () => void;
  onOpenTimeZone: () => void;
  onOpenLanguage: () => void;
  // Slots, so the plan switcher and theme toggle (which read context) stay in the container.
  planSwitcher: ReactNode;
  themeToggle: ReactNode;
  // Slot: the dialog reads the profile, so its container stays outside the view.
  timeZoneDialog: ReactNode;
  languageDialog: ReactNode;
  /** Set while a newer version waits: adds the menu item and the dot on the avatar. */
  update?: { version: string; onUpdate: () => void };
  /** Set while the app can be installed from here: adds the menu item. */
  install?: { onInstall: () => void };
};

export function NavbarView({
  userName,
  onSignOut,
  onOpenTimeZone,
  onOpenLanguage,
  planSwitcher,
  themeToggle,
  timeZoneDialog,
  languageDialog,
  update,
  install,
}: NavbarViewProps) {
  const { t } = useTranslation();

  return (
    <nav className="border-border bg-background fixed z-20 flex h-[calc(4rem+env(safe-area-inset-top))] w-full items-center justify-between border-b px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-4">
        <img
          src={"/findraco-logo-128.png"}
          alt={t("app.navbarView.findracoLogo")}
          className="h-8"
        />
        {planSwitcher}
      </div>

      <div className="flex items-center gap-2">
        {themeToggle}

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:cursor-pointer focus:outline-none">
            <Avatar size="lg">
              <AvatarFallback>{getFirstAndLastInitials(userName)}</AvatarFallback>
              {update && (
                <AvatarBadge>
                  <span className="sr-only">{t("app.navbarView.updateAvailable")}</span>
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
                {t("app.navbarView.updateTo", { version: update.version })}
                <Download className="text-foreground" />
              </DropdownMenuItem>
            )}
            {install && (
              <DropdownMenuItem
                className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
                onClick={install.onInstall}
              >
                {t("app.navbarView.installApp")}
                <Smartphone className="text-foreground" />
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={onOpenTimeZone}
            >
              {t("app.navbarView.timeZone")}
              <Globe className="text-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={onOpenLanguage}
            >
              {t("app.navbarView.language")}
              <Languages className="text-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted flex h-full w-full items-center justify-between gap-2 hover:cursor-pointer"
              onClick={onSignOut}
            >
              {t("app.navbarView.logout")}
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
      {languageDialog}
    </nav>
  );
}
