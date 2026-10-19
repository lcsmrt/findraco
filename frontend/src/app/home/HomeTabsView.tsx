import type { ReactNode } from "react";
import { Button } from "@/components/button/base/Button";
import { cn } from "@/lib/mergeClasses";
import type { HomeTab } from "./homeParams";

const tabs: { key: HomeTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "categories", label: "Categories" },
];

type HomeTabsViewProps = {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
  children: ReactNode;
};

export function HomeTabsView({ activeTab, onTabChange, children }: HomeTabsViewProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex border-b px-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            variant="ghost"
            className={cn(
              "-mb-px rounded-none border-0 border-b-2 px-4 py-2 transition-colors",
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {children}
    </div>
  );
}
