import type { Contact } from "@/api/dtos/contact";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import { ContactActionsMenu } from "./ContactActionsMenu";

const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 0, credit: 0, version: 0 };

// The popup leaves the DOM after its close animation, and the a11y check runs on what is left in the page.
async function menuClosed() {
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
}

const meta = {
  title: "Contact/ContactActionsMenu",
  component: ContactActionsMenu,
  args: {
    contact: mae,
    label: "Actions for Mãe",
    onRename: fn(),
    onArchive: fn(),
    onUnarchive: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof ContactActionsMenu>;
export default meta;

type Story = StoryObj<typeof meta>;

// The menu renders in a portal, outside the story canvas, so its items are read through `screen`.
export const Active: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Mãe" }));
    await expect(await screen.findByRole("menuitem", { name: "Rename" })).toBeVisible();
    await expect(screen.queryByRole("menuitem", { name: "Unarchive" })).toBeNull();
    await userEvent.click(screen.getByRole("menuitem", { name: "Archive" }));
    await expect(args.onArchive).toHaveBeenCalledWith(mae);
    await menuClosed();
  },
};

export const Archived: Story = {
  args: { contact: { ...mae, archived: true } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Mãe" }));
    await expect(screen.queryByRole("menuitem", { name: "Archive" })).toBeNull();
    await userEvent.click(await screen.findByRole("menuitem", { name: "Unarchive" }));
    await expect(args.onUnarchive).toHaveBeenCalledWith({ ...mae, archived: true });
    await menuClosed();
  },
};

export const Deleting: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Mãe" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));
    await expect(args.onDelete).toHaveBeenCalledWith(mae);
    await menuClosed();
  },
};
