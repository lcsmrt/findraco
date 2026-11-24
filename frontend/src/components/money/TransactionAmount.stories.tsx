import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { TransactionAmount } from "./TransactionAmount";

const meta = {
  title: "Money/TransactionAmount",
  component: TransactionAmount,
} satisfies Meta<typeof TransactionAmount>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Debit: Story = {
  args: { amount: 1234.5, type: "DEBIT" },
  play: async ({ canvasElement }) => {
    const figure = canvasElement.querySelector("span");
    await expect(figure?.textContent).toBe("−R$ 1.234,50");
    await expect(figure).toHaveClass("text-destructive");
  },
};

export const Credit: Story = {
  args: { amount: 1234.5, type: "CREDIT" },
  play: async ({ canvasElement }) => {
    const figure = canvasElement.querySelector("span");
    await expect(figure?.textContent).toBe("R$ 1.234,50");
    await expect(figure).toHaveClass("text-success");
  },
};
