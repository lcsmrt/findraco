import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { DeletePlanPermanentlyDialogView } from "./DeletePlanPermanentlyDialogView";

const meta = {
  title: "Plans/DeletePlanPermanentlyDialogView",
  component: DeletePlanPermanentlyDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    planName: "Casa",
    isSubmitting: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof DeletePlanPermanentlyDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const ExactNameRequired: Story = {
  play: async ({ args, userEvent }) => {
    const confirm = screen.getByRole("button", { name: "Delete now" });
    const field = screen.getByRole("textbox", { name: 'Type "Casa" to confirm' });
    await expect(confirm).toBeDisabled();

    await userEvent.type(field, "Casa ");
    await expect(confirm).toBeDisabled();

    await userEvent.clear(field);
    await userEvent.type(field, "casa");
    await expect(confirm).toBeDisabled();

    await userEvent.clear(field);
    await userEvent.type(field, "Casa");
    await expect(confirm).toBeEnabled();

    await userEvent.click(confirm);
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  },
};

export const Cancel: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

export const Submitting: Story = {
  tags: ["!test"],
  args: { isSubmitting: true },
};

export const LongName: Story = {
  tags: ["!test"],
  args: { planName: "Household finances shared with the whole family and two flatmates" },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
