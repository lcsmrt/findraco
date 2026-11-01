import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { InstallInstructionsDialogView } from "./InstallInstructionsDialogView";

const meta = {
  title: "App/InstallInstructionsDialogView",
  component: InstallInstructionsDialogView,
  args: { open: true, onOpenChange: fn() },
} satisfies Meta<typeof InstallInstructionsDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  play: async ({ args, userEvent }) => {
    const dialog = await screen.findByRole("dialog", { name: "Install findraco" });
    const steps = dialog.querySelectorAll("li");
    await expect(steps).toHaveLength(2);
    await expect(steps[0]).toHaveTextContent("Tap the Share icon");
    await expect(steps[1]).toHaveTextContent("Add to Home Screen");

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  },
};
