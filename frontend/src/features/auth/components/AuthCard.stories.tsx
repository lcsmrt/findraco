import { Button } from "@/components/button/base/Button";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { AuthCard } from "./AuthCard";

function DemoForm() {
  return (
    <form className="flex flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="demo-email">Email</FieldLabel>
        <Input id="demo-email" placeholder="you@example.com" />
      </Field>
      <Button type="button" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}

const meta = {
  title: "Auth/AuthCard",
  component: AuthCard,
  args: {
    title: "Forgot password",
    children: <DemoForm />,
  },
} satisfies Meta<typeof AuthCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithTitleAndDescription: Story = {
  args: {
    description: "Enter your account email and we’ll send you a link to choose a new password.",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Forgot password" })).toBeVisible();
    await expect(
      canvas.getByText("Enter your account email and we’ll send you a link to choose a new password."),
    ).toBeVisible();
  },
};

export const TitleOnly: Story = {
  tags: ["!test"],
  args: { title: "Sign in" },
};

export const LongDescription: Story = {
  tags: ["!test"],
  args: {
    description:
      "If an account exists for that email, we sent a link to reset your password. It expires in 60 minutes. Check your spam folder if it does not arrive within a few minutes.",
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  args: WithTitleAndDescription.args,
  globals: { viewport: { value: "mobile1" } },
};
