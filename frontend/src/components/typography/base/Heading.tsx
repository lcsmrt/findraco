import { cn } from "@/lib/mergeClasses";
import type { HTMLAttributes } from "react";
import { typographyVariants, type TypographyVariant } from "./typographyVariants";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_TAGS: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** The tag, from the document outline; never picked for its size. */
  level: HeadingLevel;
  /** The look, from the design role. */
  variant: TypographyVariant;
};

export function Heading({ level, variant, className, ...props }: HeadingProps) {
  const Tag = HEADING_TAGS[level];
  return <Tag className={cn(typographyVariants({ variant }), className)} {...props} />;
}
