import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ContactBalance } from "./ContactBalance";

const meta = {
  title: "Contact/ContactBalance",
  component: ContactBalance,
  args: { contact: { owed: 50, credit: 0 } },
} satisfies Meta<typeof ContactBalance>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Owes: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Owes R$ 50,00")).toBeVisible();
  },
};

export const Credit: Story = {
  args: { contact: { owed: 0, credit: 20 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Credit of R$ 20,00")).toBeVisible();
  },
};

export const Settled: Story = {
  args: { contact: { owed: 0, credit: 0 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Settled")).toBeVisible();
  },
};
