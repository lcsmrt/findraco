import { Button } from "@/components/button/Button";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
