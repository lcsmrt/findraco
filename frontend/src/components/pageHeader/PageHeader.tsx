import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Page-level actions, beside the title; they wrap below it on a narrow screen. */
  actions?: ReactNode;
  /** What frames the page's data, such as the period and who is shown, in a row below the title. */
  context?: ReactNode;
  className?: string;
};

/** The page's single `h1`, with an optional description, actions and context row. */
export function PageHeader({ title, description, actions, context, className }: PageHeaderProps) {
  return (
    <header className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading level={1} variant="headline">
            {title}
          </Heading>
          {description && (
            <Text as="p" variant="secondary">
              {description}
            </Text>
          )}
        </div>
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
