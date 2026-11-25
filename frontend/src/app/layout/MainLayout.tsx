import { Outlet, useLocation } from "react-router-dom";
import { AddTransactionProvider } from "@/app/providers/AddTransactionProvider";
import { useAddTransaction } from "@/app/providers/useAddTransaction";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { BottomBarView } from "./BottomBarView";
import { MainLayoutView } from "./MainLayoutView";
import { Navbar } from "./Navbar";
import { currentDestination, type Destination } from "./utils/navigation";
import { TabRowView } from "./TabRowView";

type DestinationLayoutProps = {
  current: Destination;
};

/** The shell of one of the four destinations, with the global add in its navigation. */
function DestinationLayout({ current }: DestinationLayoutProps) {
  // False while the plan or its role loads, so a viewer never sees the add flash in.
  const { canCreateTransactions } = usePlanPermissions();
  const { openAdd } = useAddTransaction();

  const onAdd = canCreateTransactions ? () => openAdd() : null;

  return (
    <MainLayoutView
      navbar={<Navbar />}
      navigation={{
        tabRow: <TabRowView current={current} onAdd={onAdd} />,
        bottomBar: <BottomBarView current={current} onAdd={onAdd} />,
      }}
    >
      <Outlet />
    </MainLayoutView>
  );
}

export function MainLayout() {
  const { pathname } = useLocation();
  const current = currentDestination(pathname);

  if (!current) {
    return (
      <MainLayoutView navbar={<Navbar />}>
        <Outlet />
      </MainLayoutView>
    );
  }

  return (
    <AddTransactionProvider>
      <DestinationLayout current={current} />
    </AddTransactionProvider>
  );
}
