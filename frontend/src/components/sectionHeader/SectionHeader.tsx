import { Heading } from "@/components/typography/base/Heading";
import { Text } from "@/components/typography/base/Text";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** The heading tag under the page's `h1`; the look stays the same at any level. */
  level?: 2 | 3 | 4;
  children?: ReactNode;
};

export function SectionHeader({ title, subtitle, level = 2, children }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between px-2">
      <div className="flex flex-col gap-1">
        <Heading level={level} variant="title">
          {title}
        </Heading>
        {subtitle && <Text variant="caption">{subtitle}</Text>}
      </div>
      {children}
    </div>
  );
}
