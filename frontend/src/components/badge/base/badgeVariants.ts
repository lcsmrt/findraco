import { cva } from "class-variance-authority";

/**
 * Three families say what a badge marks. `status` is a state of the thing (tinted, optional icon,
 * no border; `statusToneVariants` picks the tint), `tag` is a category (outlined, nothing else),
 * `meta` is a quiet fact about it (a role, a count, a kind). `ghost` and `link` are interactive.
 */
export const badgeVariants = cva(
  "h-5 gap-1 rounded-4xl px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        status: "",
        tag: "border border-border text-foreground [a]:hover:bg-muted",
        meta: "bg-muted text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary-ink underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "meta",
    },
  },
);
