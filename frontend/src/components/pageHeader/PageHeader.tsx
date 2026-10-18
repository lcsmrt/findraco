import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import { cn } from "@/lib/mergeClasses";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Page-level actions, beside the title; they wrap below it on a narrow screen. */
  actions?: ReactNode;
  className?: string;
};

/** The page's single `h1`, with an optional description and actions. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex w-full flex-wrap items-center justify-between gap-3", className)}>
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
    </header>
  );
}
