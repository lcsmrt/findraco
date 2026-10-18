import { Button } from "@/components/button/Button";
import { CategoriesTab } from "@/features/home/components/categories/CategoriesTab";
import { OverviewTab } from "@/features/overview/OverviewTab";
import { TransactionsTab } from "@/features/transactions/TransactionsTab";
import { HomeFiltersGate } from "./HomeFiltersGate";
import { cn } from "@/lib/mergeClasses";
import type { HomeTab } from "./homeParams";
import { useHomeTab } from "./useHomeTab";

const tabs: { key: HomeTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "categories", label: "Categories" },
];

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
      {activeTab === "transactions" && (
        <TransactionsTab onManageCategories={() => setActiveTab("categories")} />
      )}
      {activeTab === "categories" && <CategoriesTab />}
    </div>
  );
}
