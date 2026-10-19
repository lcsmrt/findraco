import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ForgotPasswordView } from "./ForgotPasswordView";

const meta = {
  title: "Auth/ForgotPasswordView",
  component: ForgotPasswordView,
  args: {
    isSubmitted: false,
    isSubmitting: false,
    onSubmit: fn(),
    onBackToSignIn: fn(),
  },
} satisfies Meta<typeof ForgotPasswordView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const RequestLink: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "ana@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Send reset link" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: "ana@example.com" }, expect.anything());
  },
};

export const InvalidEmail: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "not-an-email");
    await userEvent.click(canvas.getByRole("button", { name: "Send reset link" }));
    await expect(await canvas.findByText("Invalid email")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Sending: Story = {
  args: { isSubmitting: true },
};

export const Sent: Story = {
  args: { isSubmitted: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("textbox", { name: "Email" })).toBeNull();
    await expect(canvas.getByText(/we sent a link to reset your password/)).toBeVisible();
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
