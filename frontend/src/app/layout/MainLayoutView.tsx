import type { ReactNode } from "react";
import { cn } from "@/lib/mergeClasses";

type MainLayoutViewProps = {
  // A slot, so the navbar (which reads auth and plan context) stays in the container.
  navbar: ReactNode;
  /** The destinations: the tab row shows from `sm` up, the bottom bar below it. */
  navigation?: { tabRow: ReactNode; bottomBar: ReactNode };
  /** Something drawn over the page, such as the global New Transaction form. */
  overlay?: ReactNode;
  children: ReactNode;
};

export function MainLayoutView({ navbar, navigation, overlay, children }: MainLayoutViewProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <header>{navbar}</header>
      <main
        className={cn(
          "flex flex-1 flex-col pt-[calc(4rem+env(safe-area-inset-top))]",
          // The bottom bar is fixed, so the page keeps its height free below `sm`; otherwise the bar
          // would cover the last rows.
          navigation && "pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0",
        )}
      >
        {navigation ? (
          <div className="flex flex-1 flex-col gap-6 py-4">
            {navigation.tabRow}
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      {navigation?.bottomBar}
      {overlay}
    </div>
  );
}
