import { Button } from "@/components/button/base/Button";
import { Moon, Sun } from "lucide-react";

type ThemeToggleViewProps = {
  onToggle: () => void;
};

export function ThemeToggleView({ onToggle }: ThemeToggleViewProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
