import type { Meta, StoryObj } from "@storybook/react-vite";
import { Moon } from "lucide-react";
import { expect, fn } from "storybook/test";
import { Button } from "@/components/button/base/Button";
import { NotFoundView } from "./NotFoundView";

const meta = {
  title: "NotFound/NotFoundView",
  component: NotFoundView,
  parameters: { layout: "fullscreen" },
  args: {
    themeToggle: (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Moon />
      </Button>
    ),
    onGoHome: fn(),
  },
} satisfies Meta<typeof NotFoundView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const PageMissing: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Not in the hoard" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Back to the hoard" }));
    await expect(args.onGoHome).toHaveBeenCalledTimes(1);
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
