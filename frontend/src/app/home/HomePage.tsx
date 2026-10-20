import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { PlanFiltersGate } from "@/app/routing/PlanFiltersGate";
import { OVERVIEW_PARAM_KEYS } from "@/features/overview/filters/overviewParams";
import { TRANSACTION_PARAM_KEYS } from "@/features/transactions/filters/transactionParams";
import { TAB_PARAM } from "./homeParams";
import { HomeTabsView } from "./HomeTabsView";
import { useHomeTab } from "./useHomeTab";

const HOME_PARAM_KEYS = [
  TAB_PARAM,
  ...OVERVIEW_PARAM_KEYS,
  ...TRANSACTION_PARAM_KEYS,
];

export function Home() {
  return (
    <PlanFiltersGate screen="overview" paramKeys={HOME_PARAM_KEYS}>
      <HomeTabs />
    </PlanFiltersGate>
  );
}

function HomeTabs() {
  const { tab: activeTab, setTab: setActiveTab } = useHomeTab();

  return (
    <HomeTabsView activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && <OverviewPage />}
      {activeTab === "transactions" && (
        <TransactionsPage onManageCategories={() => setActiveTab("categories")} />
      )}
      {activeTab === "categories" && <CategoriesPage />}
    </HomeTabsView>
  );
}
