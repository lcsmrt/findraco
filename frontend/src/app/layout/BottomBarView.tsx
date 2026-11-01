import type { LucideIcon } from "lucide-react";
import { ArrowLeftRight, LayoutDashboard, Plus, Tags, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import { DESTINATION_LABELS, DESTINATION_PATHS, type Destination } from "./utils/navigation";

const ICONS: Record<Destination, LucideIcon> = {
  overview: LayoutDashboard,
  transactions: ArrowLeftRight,
  categories: Tags,
  plans: Users,
};

type BottomBarViewProps = {
  current: Destination;
  /** Opens the New Transaction form; null when the member may not create transactions. */
  onAdd: (() => void) | null;
  className?: string;
};

export function BottomBarView({ current, onAdd, className }: BottomBarViewProps) {
  return (
    <nav
      aria-label="Bottom bar"
      data-bottom-bar
      className={cn(
        "border-border bg-background fixed inset-x-0 bottom-0 z-20 border-t pb-[env(safe-area-inset-bottom)] sm:hidden",
        className,
      )}
    >
      <div className={cn("grid h-16", onAdd ? "grid-cols-5" : "grid-cols-4")}>
        <BarItem destination="overview" current={current} />
        <BarItem destination="transactions" current={current} />
        {onAdd && (
          <div className="flex items-center justify-center">
            <Button
              size="icon-lg"
              className="size-12 rounded-full shadow-md"
              aria-label="New Transaction"
              onClick={onAdd}
            >
              <Plus className="size-6" />
            </Button>
          </div>
        )}
        <BarItem destination="categories" current={current} />
        <BarItem destination="plans" current={current} />
      </div>
    </nav>
  );
}

type BarItemProps = {
  destination: Destination;
  current: Destination;
};

function BarItem({ destination, current }: BarItemProps) {
  const Icon = ICONS[destination];
  const active = destination === current;

  return (
    <Link
      to={DESTINATION_PATHS[destination]}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        // primary-ink is the primary hue at a contrast text can use; plain primary is too light.
        active ? "text-primary-ink" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden />
      <Text variant="caption" className={active ? "text-primary-ink" : undefined}>
        {DESTINATION_LABELS[destination]}
      </Text>
    </Link>
  );
}
