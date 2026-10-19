import { useTheme } from "@/app/providers/useTheme";
import { ThemeToggleView } from "./ThemeToggleView";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return <ThemeToggleView onToggle={toggleTheme} />;
}
