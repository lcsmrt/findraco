import { cva, type VariantProps } from "class-variance-authority";

/**
 * The app's type scale: seven steps named by hierarchy level, each carrying the tone its role
 * implies. `Heading` and `Text` render it; non-HTML targets (an SVG `<text>` tick) use it directly.
 */
export const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "text-[10rem] leading-none font-bold tracking-tighter sm:text-[14rem]",
      headline: "text-2xl font-bold",
      title: "text-base font-semibold",
      label: "text-sm font-medium",
      body: "text-sm font-normal",
      secondary: "text-sm font-normal text-muted-foreground",
      caption: "text-xs font-normal text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>;
