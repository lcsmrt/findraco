import { ThemeToggle } from "@/components/themeToggle/ThemeToggle";
import { Outlet } from "react-router-dom";
import { AuthLayoutView } from "./AuthLayoutView";

export function AuthLayout() {
  return (
    <AuthLayoutView themeToggle={<ThemeToggle />}>
      <Outlet />
    </AuthLayoutView>
  );
}
