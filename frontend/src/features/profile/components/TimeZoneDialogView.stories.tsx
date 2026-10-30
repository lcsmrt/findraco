import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { TimeZoneDialogView } from "./TimeZoneDialogView";

const meta = {
  title: "Profile/TimeZoneDialogView",
  component: TimeZoneDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    initialValues: { mode: "AUTOMATIC", zone: "America/Sao_Paulo" },
    zones: ["America/Sao_Paulo", "Asia/Tokyo", "Europe/Lisbon"],
    isSaving: false,
    onSave: fn(),
  },
} satisfies Meta<typeof TimeZoneDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Automatic: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await expect(args.onSave).toHaveBeenCalledTimes(1);
  },
};

export const PinnedWithoutAZone: Story = {
  args: { initialValues: { mode: "PINNED", zone: "" } },
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await expect(await screen.findByText("Pick a time zone")).toBeVisible();
    await expect(args.onSave).not.toHaveBeenCalled();
  },
};

export const Saving: Story = {
  tags: ["!test"],
  args: { isSaving: true },
};
