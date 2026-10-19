import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { SessionStatusView } from "./SessionStatusView";

const meta = {
  title: "App/SessionStatusView",
  component: SessionStatusView,
  args: { status: "loading", onRetry: fn() },
} satisfies Meta<typeof SessionStatusView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeVisible();
  },
};

export const Unreachable: Story = {
  args: { status: "unreachable" },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Can't reach findraco.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

export const MobileUnreachable: Story = {
  args: { status: "unreachable" },
  globals: { viewport: { value: "mobile1" } },
};
