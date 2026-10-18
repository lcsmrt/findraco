import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Amount } from "./Amount";

const meta = {
  title: "Money/Amount",
  component: Amount,
} satisfies Meta<typeof Amount>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Debit: Story = {
  args: { value: 1234.5, type: "DEBIT" },
  play: async ({ canvasElement }) => {
    const amount = canvasElement.querySelector("span");
    await expect(amount?.textContent).toBe("- R$\u00a01.234,50");
    await expect(amount).toHaveClass("font-mono", "text-destructive");
  },
};

export const Credit: Story = {
  args: { value: 1234.5, type: "CREDIT" },
  play: async ({ canvasElement }) => {
    const amount = canvasElement.querySelector("span");
    await expect(amount?.textContent).toBe("R$\u00a01.234,50");
    await expect(amount).toHaveClass("font-mono", "text-success");
  },
};

export const Zero: Story = {
  args: { value: 0, type: "CREDIT" },
};

export const LargeValue: Story = {
  args: { value: 9999999999999.99, type: "DEBIT" },
};
