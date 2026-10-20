import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ThemeToggleView } from "./ThemeToggleView";

const meta = {
  title: "Components/ThemeToggleView",
  component: ThemeToggleView,
  args: { onToggle: fn() },
} satisfies Meta<typeof ThemeToggleView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Toggle theme" }));
    await expect(args.onToggle).toHaveBeenCalledTimes(1);
  },
};

// The icon follows the `dark` class on an ancestor, as the app sets it on <html>.
export const Dark: Story = {
  tags: ["!test"],
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
