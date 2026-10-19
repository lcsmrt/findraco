import { Outlet } from "react-router-dom";
import { MainLayoutView } from "./MainLayoutView";
import { Navbar } from "./Navbar";

export function MainLayout() {
  return (
    <MainLayoutView navbar={<Navbar />}>
      <Outlet />
    </MainLayoutView>
  );
}
