import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { LanguageDialogView } from "./LanguageDialogView";

const meta = {
  title: "Profile/LanguageDialogView",
  component: LanguageDialogView,
  args: {
    open: true,
    onOpenChange: fn(),
    value: "en",
    onPick: fn(),
  },
} satisfies Meta<typeof LanguageDialogView>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const English: Story = {
  play: async ({ args, userEvent }) => {
    await userEvent.click(screen.getByRole("radio", { name: "Português (Brasil)" }));
    await expect(args.onPick).toHaveBeenCalledWith("pt-BR");
  },
};

export const Portuguese: Story = {
  args: { value: "pt-BR" },
  play: async () => {
    await expect(screen.getByRole("radio", { name: "Português (Brasil)" })).toBeChecked();
  },
};
