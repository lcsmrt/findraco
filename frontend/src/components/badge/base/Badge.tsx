import { cn } from "@/lib/mergeClasses";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "./badgeVariants";
import { statusToneVariants } from "./statusToneVariants";

function Badge({
  className,
  variant = "meta",
  tone = "neutral",
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> &
  VariantProps<typeof statusToneVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          badgeVariants({ variant }),
          variant === "status" && statusToneVariants({ tone }),
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      // Only a status has a tone; the attribute would otherwise claim one for a tag or a meta.
      tone: variant === "status" ? tone : undefined,
    },
  });
}

export { Badge };
