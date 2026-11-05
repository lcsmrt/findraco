import { Button } from "@/components/button/base/Button";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

type ThemeToggleViewProps = {
  onToggle: () => void;
};

export function ThemeToggleView({ onToggle }: ThemeToggleViewProps) {
  const { t } = useTranslation();

  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="sr-only">{t("components.themeToggleView.toggleTheme")}</span>
    </Button>
  );
}
