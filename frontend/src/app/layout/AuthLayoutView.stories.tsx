import type { Meta, StoryObj } from "@storybook/react-vite";
import { Moon } from "lucide-react";
import { expect } from "storybook/test";
import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import { AuthLayoutView } from "./AuthLayoutView";

const meta = {
  title: "App/AuthLayoutView",
  component: AuthLayoutView,
  parameters: { layout: "fullscreen" },
  args: {
    themeToggle: (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Moon />
      </Button>
    ),
    children: <Text as="p">Sign-in form</Text>,
  },
} satisfies Meta<typeof AuthLayoutView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithForm: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("findraco")).toBeVisible();
    await expect(canvas.getByText("Sign-in form")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Toggle theme" })).toBeVisible();
  },
};

export const TallContent: Story = {
  args: {
    children: (
      <div className="flex max-w-sm flex-col gap-3">
        {Array.from({ length: 12 }, (_, index) => (
          <Text as="p" key={index}>
            Form field {index + 1} with a long explanatory label that wraps on narrow screens.
          </Text>
        ))}
      </div>
    ),
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
