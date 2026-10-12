import { cn } from "@/lib/mergeClasses";
import { CategoriesTab } from "./components/categories/CategoriesTab";
import { OverviewTab } from "./components/overview/OverviewTab";
import { TransactionsTab } from "./components/transactions/TransactionsTab";
import { Button } from "@/components/button/Button";
import { HomeFiltersGate } from "./filters/HomeFiltersGate";
import type { HomeTab } from "./filters/homeFilterParams";
import { useHomeFilters } from "./hooks/useHomeFilters";

const tabs: { key: HomeTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "categories", label: "Categories" },
];

export const Home = () => (
  <HomeFiltersGate>
    <HomeTabs />
  </HomeFiltersGate>
);

const HomeTabs = () => {
  const { tab: activeTab, setTab: setActiveTab } = useHomeFilters();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex border-b px-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            variant="ghost"
            className={cn(
              "-mb-px rounded-none border-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "transactions" && <TransactionsTab />}
      {activeTab === "categories" && <CategoriesTab />}
    </div>
  );
};
