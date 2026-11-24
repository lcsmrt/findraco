import { cva, type VariantProps } from "class-variance-authority";

/**
 * `tone` colours the pressed state; `variant` sets the shape. `chip` is a pill with its own
 * neutral pressed colour (it comes after `tone`, so it wins over a tone's pressed classes).
 * A chip is 32 px tall on a phone, not the 44 px of other controls; its pseudo-element reaches 6.5 px
 * above and below (7.5 px from the padding box, inside the 1 px border), so the tap area is 44 px or a
 * little more whatever the sub-pixel position.
 */
export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
          "max-sm:h-11 max-sm:min-w-11 h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "max-sm:h-11 max-sm:min-w-11 h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "max-sm:h-11 max-sm:min-w-11 h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
      variant: {
        default: "bg-transparent",
        outline:
          "border border-border bg-transparent text-muted-foreground hover:border-current/30",
        chip: "relative max-sm:h-8 max-sm:after:absolute max-sm:after:-inset-y-[7.5px] max-sm:after:inset-x-0 h-7 min-w-0 gap-1.5 rounded-full border border-border bg-card px-3 text-xs text-foreground hover:bg-muted hover:text-foreground aria-pressed:border-foreground/80 aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90",
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
