import { cn } from "@/lib/mergeClasses";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  cn(
    "focus-visible:border-ring focus-visible:ring-ring",
    "aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
    "rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3",
    "active:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button",
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "hover:cursor-pointer",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-field dark:border-input dark:hover:bg-field-hover aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 hover:bg-destructive/20 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary-ink underline-offset-4 hover:underline",
      },
      size: {
        default:
          "max-sm:h-11 max-sm:min-w-11 h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "max-sm:h-11 max-sm:min-w-11 h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "max-sm:h-11 max-sm:min-w-11 h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "max-sm:h-11 max-sm:min-w-11 h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "max-sm:size-11 size-8",
        "icon-xs":
          "max-sm:size-11 size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "max-sm:size-11 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "max-sm:size-11 size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
