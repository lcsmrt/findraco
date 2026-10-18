import { cn } from "@/lib/mergeClasses";
import type { HTMLAttributes } from "react";
import { typographyVariants, type TypographyVariant } from "./typographyVariants";

type TextTag = "span" | "p" | "div";

type TextProps = HTMLAttributes<HTMLElement> & {
  /** The tag; `span` by default, so text can sit inside buttons, labels and paragraphs. */
  as?: TextTag;
  variant?: TypographyVariant;
};

export function Text({ as: Tag = "span", variant, className, ...props }: TextProps) {
  return <Tag className={cn(typographyVariants({ variant }), className)} {...props} />;
}
