import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect, within } from "storybook/test";
import { MovementKindField } from "./MovementKindField";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

type DemoFormProps = {
  type?: TransactionFormValues["type"];
  kind?: TransactionFormValues["kind"];
  allowRepayment?: boolean;
  disabled?: boolean;
};

// MovementKindField needs a live form, so each story renders it inside a small test form.
function DemoForm({ type = "DEBIT", kind = null, allowRepayment = true, disabled }: DemoFormProps) {
  const { control, setValue } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), type, kind },
  });

  return (
    <form className="w-80">
      <MovementKindField control={control} setValue={setValue} allowRepayment={allowRepayment} disabled={disabled} />
    </form>
  );
}

const meta = {
  title: "Transactions/MovementKindField",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: "Movement kind" });
    await expect(select).toHaveTextContent("Normal");

    await userEvent.click(select);

    const options = await within(document.body).findAllByRole("option");
    await expect(options.map((option) => option.textContent)).toEqual([
      "Normal",
      "Between members",
      "Card bill",
      "Savings",
    ]);
  },
};

export const Credit: Story = {
  args: { type: "CREDIT" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Movement kind" }));

    await expect(await within(document.body).findByRole("option", { name: "Refund" })).toBeVisible();
    await expect(await within(document.body).findByRole("option", { name: "Contact payment" })).toBeVisible();
  },
};

// Recording a payment from a contact is for a role that may attribute to others.
export const CreditWithoutRepayment: Story = {
  args: { type: "CREDIT", allowRepayment: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Movement kind" }));

    await expect(await within(document.body).findByRole("option", { name: "Refund" })).toBeVisible();
    await expect(within(document.body).queryByRole("option", { name: "Contact payment" })).toBeNull();
  },
};

export const Chosen: Story = {
  args: { kind: "SAVINGS" },
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole("combobox", { name: "Movement kind" });
    await expect(select).toHaveTextContent("Savings");

    await userEvent.click(select);
    await userEvent.click(await within(document.body).findByRole("option", { name: "Card bill" }));

    await expect(select).toHaveTextContent("Card bill");
  },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { disabled: true },
};
