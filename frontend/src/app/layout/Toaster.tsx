import type { ToasterProps } from "sonner";
import { resolveTheme } from "@/app/providers/resolveTheme";
import { useTheme } from "@/app/providers/useTheme";
import { ToasterView } from "./ToasterView";

export function Toaster(props: ToasterProps) {
  const { theme } = useTheme();

  return <ToasterView theme={resolveTheme(theme)} {...props} />;
}
