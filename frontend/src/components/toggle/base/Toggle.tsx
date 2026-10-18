import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "@/lib/mergeClasses";
import { toggleVariants, type ToggleVariantProps } from "./toggleVariants";

type ToggleProps = TogglePrimitive.Props & ToggleVariantProps;

export function Toggle({
  className,
  tone,
  variant,
  size,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ tone, variant, size }), className)}
      {...props}
    />
  );
}
