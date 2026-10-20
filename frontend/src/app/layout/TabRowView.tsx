import { PlusIcon } from "lucide-react";
import { Button } from "@/components/button/base/Button";
import { buttonVariants } from "@/components/button/base/buttonVariants";
import { cn } from "@/lib/mergeClasses";
import {
  DESTINATION_LABELS,
  DESTINATION_PATHS,
  DESTINATIONS,
  type Destination,
} from "./navigation";
import { RouterLink } from "./RouterLink";

type TabRowViewProps = {
  current: Destination;
  /** Opens the New Transaction form; null when the member may not create transactions. */
  onAdd: (() => void) | null;
  className?: string;
};

export function TabRowView({ current, onAdd, className }: TabRowViewProps) {
  return (
    <nav
      aria-label="Destinations"
      className={cn("hidden items-center gap-2 border-b px-4 sm:flex", className)}
    >
      <div className="flex flex-1">
        {DESTINATIONS.map((destination) => (
          <RouterLink
            key={destination}
            to={DESTINATION_PATHS[destination]}
            aria-current={destination === current ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "-mb-px rounded-none border-0 border-b-2 px-4 py-2 transition-colors",
              destination === current
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {DESTINATION_LABELS[destination]}
          </RouterLink>
        ))}
      </div>

      {onAdd && (
        <Button onClick={onAdd}>
          <PlusIcon />
          New Transaction
        </Button>
      )}
    </nav>
  );
}
