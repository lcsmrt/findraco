import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { ContactNameDialogView } from "./ContactNameDialogView";

const meta = {
  title: "Contact/ContactNameDialogView",
  component: ContactNameDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    mode: "create",
    initialName: "",
    isSubmitting: false,
    isNameTaken: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof ContactNameDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Create: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "  Mãe  ");
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: "Mãe" }, expect.anything());
  },
};

export const Rename: Story = {
  args: { mode: "rename", initialName: "Mãe" },
  play: async ({ args, userEvent }) => {
    await expect(screen.getByRole("dialog", { name: "Rename contact" })).toBeVisible();
    await expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Mãe");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: "Mãe" }, expect.anything());
  },
};

export const EmptyName: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await expect(await screen.findByText("Enter a name")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const NameTaken: Story = {
  args: { initialName: "Mãe", isNameTaken: true },
  play: async () => {
    await expect(await screen.findByText("A contact with that name already exists")).toBeVisible();
  },
};

export const Submitting: Story = {
  tags: ["!test"],
  args: { mode: "rename", initialName: "Mãe", isSubmitting: true },
};
