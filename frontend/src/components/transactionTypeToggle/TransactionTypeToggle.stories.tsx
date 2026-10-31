import type { TransactionType } from "@/api/dtos/transaction";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { TransactionTypeToggle } from "./TransactionTypeToggle";

type TypeFieldProps = {
  initialValue: TransactionType;
  disabled?: boolean;
};

// The toggle is controlled, so the stories hold its value like the forms do.
function TypeField({ initialValue, disabled }: TypeFieldProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="w-80">
      <TransactionTypeToggle
        value={value}
        onChange={setValue}
        disabled={disabled}
      />
    </div>
  );
}

const meta = {
  title: "Transactions/TransactionTypeToggle",
  component: TypeField,
} satisfies Meta<typeof TypeField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Debit: Story = {
  args: { initialValue: "DEBIT" },
  play: async ({ canvas, userEvent }) => {
    const debit = canvas.getByRole("button", { name: "Debit" });
    const credit = canvas.getByRole("button", { name: "Credit" });
    await expect(debit).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(debit);
    await expect(debit).toHaveAttribute("aria-pressed", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(credit).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(credit).toHaveAttribute("aria-pressed", "true");
    await expect(debit).toHaveAttribute("aria-pressed", "false");
  },
};

export const Credit: Story = {
  tags: ["!test"],
  args: { initialValue: "CREDIT" },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { initialValue: "DEBIT", disabled: true },
};
