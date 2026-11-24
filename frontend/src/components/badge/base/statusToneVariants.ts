import { cva } from "class-variance-authority";

/** The tint of a `status` badge; no other family has a tone. */
export const statusToneVariants = cva("", {
  variants: {
    tone: {
      neutral: "bg-secondary text-secondary-foreground",
      warning: "bg-warning/10 text-warning dark:bg-warning/20",
      success: "bg-success/10 text-success dark:bg-success/20",
      destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});
