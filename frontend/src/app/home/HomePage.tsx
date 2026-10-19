import { CategoriesTab } from "@/features/categories/CategoriesTab";
import { OverviewTab } from "@/features/overview/OverviewTab";
import { TransactionsTab } from "@/features/transactions/TransactionsTab";
import { HomeFiltersGate } from "./HomeFiltersGate";
import { HomeTabsView } from "./HomeTabsView";
import { useHomeTab } from "./useHomeTab";

export function Home() {
  return (
    <HomeFiltersGate>
      <HomeTabs />
    </HomeFiltersGate>
  );
}

function HomeTabs() {
  const { tab: activeTab, setTab: setActiveTab } = useHomeTab();

  return (
    <HomeTabsView activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "transactions" && (
        <TransactionsTab onManageCategories={() => setActiveTab("categories")} />
      )}
      {activeTab === "categories" && <CategoriesTab />}
    </HomeTabsView>
  );
}
