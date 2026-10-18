import { Input } from "@/components/input/base/Input";
import { formatMoney } from "@/utils/money";
import { useLayoutEffect, useRef, type ComponentProps, type Ref } from "react";
import { parseCurrencyDigits } from "./currencyDigits";

type CurrencyInputProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange" | "type" | "inputMode"
> & {
  /** Reais; `null` when empty, which is not the same as R$ 0,00. */
  value: number | null;
  onValueChange: (value: number | null) => void;
};

/**
 * Money input with ATM-style typing: each digit enters from the right as cents. It shows the masked
 * text but only ever hands out a number, so no caller parses the mask.
 */
export function CurrencyInput({ value, onValueChange, ref, ...props }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const display = value === null ? "" : formatMoney(value);

  // Digits enter from the right, so the caret belongs at the end after every reformat.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && input === document.activeElement) {
      input.setSelectionRange(display.length, display.length);
    }
  }, [display]);

  function setRefs(node: HTMLInputElement | null) {
    inputRef.current = node;
    assignRef(ref, node);
  }

  return (
    <Input
      {...props}
      ref={setRefs}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      // After the spread on purpose: callers spread react-hook-form's `field`, whose `onChange`
      // would otherwise receive the event and store the masked string.
      onChange={(event) =>
        onValueChange(
          parseCurrencyDigits(event.target.value, { deleting: isDeletion(event.nativeEvent) }),
        )
      }
    />
  );
}

function isDeletion(event: Event): boolean {
  return event instanceof InputEvent && event.inputType.startsWith("delete");
}

function assignRef(ref: Ref<HTMLInputElement> | undefined, node: HTMLInputElement | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}
