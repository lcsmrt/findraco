import { PATHS } from "@/app/routing/paths";
import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { NotFoundView } from "./NotFoundView";

export function NotFound() {
  const navigate = useNavigate();

  return <NotFoundView themeToggle={<ThemeToggle />} onGoHome={() => navigate(PATHS.overview)} />;
}
