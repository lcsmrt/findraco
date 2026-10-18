import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon } from "lucide-react";
import { expect } from "storybook/test";
import { Toggle } from "./Toggle";

const meta = {
  title: "Toggle/Toggle",
  component: Toggle,
  args: { "aria-label": "Bold", children: <BoldIcon /> },
} satisfies Meta<typeof Toggle>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("button", { name: "Bold" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const Outline: Story = { args: { variant: "outline" } };

export const Pressed: Story = {
  args: { variant: "outline", tone: "primary", defaultPressed: true },
};

export const Disabled: Story = { args: { disabled: true } };
