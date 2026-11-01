import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { UpdateRequiredDialogView } from "./UpdateRequiredDialogView";

const meta = {
  title: "App/UpdateRequiredDialogView",
  component: UpdateRequiredDialogView,
  args: { onUpdate: fn() },
} satisfies Meta<typeof UpdateRequiredDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  play: async ({ args, userEvent }) => {
    const dialog = await screen.findByRole("dialog", { name: "Update required" });
    await expect(dialog).toHaveTextContent("A new version of findraco is needed to continue.");
    await expect(screen.queryByRole("button", { name: "Close" })).toBeNull();

    await userEvent.keyboard("{Escape}");
    await expect(screen.getByRole("dialog", { name: "Update required" })).toBeVisible();

    // Outside the popup: the overlay covers the rest of the page.
    await userEvent.click(document.body);
    await expect(screen.getByRole("dialog", { name: "Update required" })).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Update" }));
    await expect(args.onUpdate).toHaveBeenCalledTimes(1);
  },
};
