import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { createContext, useContext, type CSSProperties } from "react";
import { cn } from "@/lib/mergeClasses";
import {
  toggleVariants,
  type ToggleVariantProps,
} from "@/components/toggle/base/toggleVariants";

type ToggleGroupSettings = ToggleVariantProps & {
  spacing?: number;
  orientation?: "horizontal" | "vertical";
};

const ToggleGroupContext = createContext<ToggleGroupSettings>({
  tone: "neutral",
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

type ToggleGroupProps<Value extends string> =
  ToggleGroupPrimitive.Props<Value> & ToggleGroupSettings;

/**
 * A row of toggles sharing one value. Base UI gives every item `aria-pressed` and roving focus
 * with the arrow keys. Single-choice by default; `tone`, `variant` and `size` set here apply to
 * every item.
 */
export function ToggleGroup<Value extends string>({
  className,
  tone,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps<Value>) {
  const style: CSSProperties & Record<"--gap", number> = { "--gap": spacing };

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      style={style}
      className={cn(
        "group/toggle-group flex w-fit flex-row flex-wrap items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ tone, variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

type ToggleGroupItemProps<Value extends string> = TogglePrimitive.Props<Value> &
  ToggleVariantProps;

export function ToggleGroupItem<Value extends string>({
  className,
  children,
  tone,
  variant,
  size,
  ...props
}: ToggleGroupItemProps<Value>) {
  const context = useContext(ToggleGroupContext);
  const resolved = {
    tone: context.tone ?? tone,
    variant: context.variant ?? variant,
    size: context.size ?? size,
  };

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={resolved.variant}
      data-size={resolved.size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants(resolved),
        // A stretched item (`flex-1`) shrinks to its share of the row, and the size's `min-w-*`
        // replaces flexbox's own floor at the content width, so a long label in a narrow row
        // spilled over the borders. The label's width is the floor; the others give up space.
        "min-w-fit",
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}
