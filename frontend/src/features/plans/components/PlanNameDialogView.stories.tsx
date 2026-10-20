import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { PlanNameDialogView } from "./PlanNameDialogView";

const meta = {
  title: "Plans/PlanNameDialogView",
  component: PlanNameDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    mode: "create",
    initialName: "",
    isSubmitting: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof PlanNameDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Create: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "Trip to Lisbon");
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: "Trip to Lisbon" }, expect.anything());
  },
};

export const Rename: Story = {
  tags: ["!test"],
  args: { mode: "rename", initialName: "Household" },
  play: async () => {
    await expect(screen.getByRole("dialog", { name: "Rename plan" })).toBeVisible();
    await expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Household");
  },
};

export const Invalid: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Submitting: Story = {
  tags: ["!test"],
  args: { mode: "rename", initialName: "Household", isSubmitting: true },
};

export const LongName: Story = {
  tags: ["!test"],
  args: {
    mode: "rename",
    initialName: "Household finances shared with the whole family and two flatmates",
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
