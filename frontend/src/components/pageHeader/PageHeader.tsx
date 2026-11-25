import { Heading } from "@/components/typography/base/Heading";
import { cn } from "@/lib/mergeClasses";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** A title that is data the user typed (a name) reads in full: it wraps, and the actions drop below it when it leaves them no room. A fixed title shrinks instead. */
  wrapTitle?: boolean;
  /** Page-level actions, on the title row at every width; a long title shrinks instead of pushing them down. */
  actions?: ReactNode;
  /** What frames the page's data, such as the period and who is shown, in a row below the title. */
  context?: ReactNode;
  className?: string;
};

/** The page's single `h1`, with optional actions on its row and a context row below. */
export function PageHeader({ title, wrapTitle = false, actions, context, className }: PageHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col gap-3", className)}>
      <div data-slot="page-header-row" className={cn("flex items-center justify-between gap-3", wrapTitle && "flex-wrap")}>
        <Heading
          level={1}
          variant="headline"
          // A 44 px phone action is taller than the title; a line as tall as the action puts both on one row.
          className={cn("min-w-0", wrapTitle ? "wrap-break-word" : cn("truncate", actions && "max-sm:leading-11"))}
        >
          {title}
        </Heading>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {context && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {context}
        </div>
      )}
    </header>
  );
}
