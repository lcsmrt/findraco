import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { AppVersion } from "./AppVersion";

const meta = {
  title: "AppVersion",
  component: AppVersion,
} satisfies Meta<typeof AppVersion>;
export default meta;

type Story = StoryObj<typeof meta>;

// Version and build date come from the Vite build, so the story shows what the running build has.
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/^v\d+\.\d+\.\d+.* - \d{8}$/)).toBeVisible();
  },
};

// The navbar footer centres it; the class passes straight through.
export const Centered: Story = { args: { className: "block w-64 text-center" } };
