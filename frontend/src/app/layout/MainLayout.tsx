import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TransactionFormDrawer } from "@/features/transactions/components/TransactionFormDrawer";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { BottomBarView } from "./BottomBarView";
import { MainLayoutView } from "./MainLayoutView";
import { Navbar } from "./Navbar";
import { currentDestination } from "./utils/navigation";
import { TabRowView } from "./TabRowView";

export function MainLayout() {
  const { pathname } = useLocation();
  const current = currentDestination(pathname);
  // False while the plan or its role loads, so a viewer never sees the add flash in.
  const { canCreateTransactions } = usePlanPermissions();
  const [isAddOpen, setIsAddOpen] = useState(false);

  function openAdd() {
    setIsAddOpen(true);
  }

  const onAdd = canCreateTransactions ? openAdd : null;

  return (
    <MainLayoutView
      navbar={<Navbar />}
      navigation={
        current
          ? {
              tabRow: <TabRowView current={current} onAdd={onAdd} />,
              bottomBar: <BottomBarView current={current} onAdd={onAdd} />,
            }
          : undefined
      }
      overlay={
        current && (
          <TransactionFormDrawer open={isAddOpen} onOpenChange={setIsAddOpen} mode="create" />
        )
      }
    >
      <Outlet />
    </MainLayoutView>
  );
}
