import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { cn } from "@/lib/mergeClasses";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { FocusEventHandler, Ref } from "react";

type NumberFieldProps = Omit<
  NumberFieldPrimitive.Root.Props,
  "onBlur" | "ref"
> & {
  /** Reaches the input, so react-hook-form can focus the field on an error. */
  ref?: Ref<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  "aria-invalid"?: boolean;
};

const stepButtonClass =
  "text-muted-foreground hover:bg-muted hover:text-foreground flex h-full w-9 shrink-0 items-center justify-center transition-colors outline-none hover:cursor-pointer focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4";

/**
 * An integer input: Base UI's accessible spinbutton (arrow keys, buttons) between a decrement and
 * an increment button. Whole numbers only; `min` and `step` bound it.
 */
export function NumberField({
  className,
  ref,
  onBlur,
  placeholder,
  "aria-invalid": ariaInvalid,
  ...props
}: NumberFieldProps) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      format={{ maximumFractionDigits: 0 }}
      inputRef={ref}
      className={cn("w-full", className)}
      {...props}
    >
      <NumberFieldPrimitive.Group
        className={cn(
          "border-input dark:bg-input/30 flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
          "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",
          "has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 dark:has-[[aria-invalid=true]]:ring-destructive/40",
          "data-disabled:opacity-50",
        )}
      >
        <NumberFieldPrimitive.Decrement
          aria-label="Decrease"
          className={stepButtonClass}
        >
          <MinusIcon />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input
          data-slot="number-field-input"
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          onBlur={onBlur}
          className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-full min-w-0 flex-1 bg-transparent px-2 text-center text-base tabular-nums outline-none disabled:cursor-not-allowed md:text-sm"
        />
        <NumberFieldPrimitive.Increment
          aria-label="Increase"
          className={stepButtonClass}
        >
          <PlusIcon />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  );
}
