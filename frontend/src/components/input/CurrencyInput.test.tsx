import { FormField } from "@/components/form/FormField";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CurrencyInput } from "./CurrencyInput";

type AmountValues = { amount: number | null };

type AmountFormProps = {
  onValues: (values: AmountValues) => void;
};

// The form-creation binding: spread react-hook-form's `field`, whose own `onChange` would store
// whatever it receives, and hand `onValueChange` that same `onChange`.
function AmountForm({ onValues }: AmountFormProps) {
  const { control, handleSubmit } = useForm<AmountValues>({ defaultValues: { amount: null } });

  return (
    <form onSubmit={handleSubmit(onValues)}>
      <FormField control={control} name="amount" label="Amount">
        {(field) => <CurrencyInput {...field} onValueChange={field.onChange} />}
      </FormField>
      <button type="submit">Save</button>
    </form>
  );
}

describe("CurrencyInput", () => {
  afterEach(cleanup);

  it("delivers a number to a spread react-hook-form field, never the masked string (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<AmountForm onValues={onValues} />);

    await user.type(screen.getByLabelText("Amount"), "1234");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onValues).toHaveBeenCalledTimes(1);
    expect(onValues.mock.calls[0][0]).toEqual({ amount: 12.34 });
  });

  it("shows each digit entering from the right as cents (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    render(<AmountForm onValues={vi.fn()} />);
    const input = screen.getByLabelText<HTMLInputElement>("Amount");
    const shown: string[] = [];

    for (const digit of "1234") {
      await user.type(input, digit);
      shown.push(input.value);
    }

    expect(shown).toEqual(["R$ 0,01", "R$ 0,12", "R$ 1,23", "R$ 12,34"]);
    expect(input.selectionStart).toBe(input.value.length);
  });

  it("ignores typed non-digits (STD-06 AC 5)", async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<AmountForm onValues={onValues} />);
    const input = screen.getByLabelText<HTMLInputElement>("Amount");

    await user.type(input, "1a,2-b");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(input.value).toBe("R$ 0,12");
    expect(onValues.mock.calls[0][0]).toEqual({ amount: 0.12 });
  });

  it("submits null once every digit is erased (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<AmountForm onValues={onValues} />);
    const input = screen.getByLabelText<HTMLInputElement>("Amount");

    await user.type(input, "12");
    await user.type(input, "{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(input.value).toBe("");
    expect(onValues.mock.calls[0][0]).toEqual({ amount: null });
  });

  it("opens the numeric keypad (STD-06 AC 4)", () => {
    render(<AmountForm onValues={vi.fn()} />);

    expect(screen.getByLabelText("Amount").getAttribute("inputmode")).toBe("numeric");
  });
});
