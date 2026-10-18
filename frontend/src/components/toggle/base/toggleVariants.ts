import { cva, type VariantProps } from "class-variance-authority";

/**
 * `tone` colours the pressed state; `variant` sets the shape. `chip` is a pill with its own
 * neutral pressed colour (it comes after `tone`, so it wins over a tone's pressed classes).
 */
export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      tone: {
        neutral: "hover:bg-muted hover:text-foreground aria-pressed:bg-muted",
        primary:
          "hover:text-primary-ink aria-pressed:border-primary/30 aria-pressed:bg-primary/15 aria-pressed:text-primary-ink aria-pressed:hover:bg-primary/20",
        destructive:
          "hover:text-destructive aria-pressed:border-destructive/30 aria-pressed:bg-destructive/15 aria-pressed:text-destructive aria-pressed:hover:bg-destructive/20",
        success:
          "hover:text-success aria-pressed:border-success/30 aria-pressed:bg-success/15 aria-pressed:text-success aria-pressed:hover:bg-success/20",
      },
      size: {
        default:
          "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
      variant: {
        default: "bg-transparent",
        outline:
          "border border-border bg-transparent text-muted-foreground hover:border-current/30",
        chip: "h-7 min-w-0 gap-1.5 rounded-full border border-border bg-card px-3 text-xs text-foreground hover:bg-muted hover:text-foreground aria-pressed:border-foreground/80 aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "default",
      variant: "default",
    },
  },
);

export type ToggleVariantProps = VariantProps<typeof toggleVariants>;
