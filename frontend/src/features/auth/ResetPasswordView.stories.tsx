import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { ResetPasswordView } from "./ResetPasswordView";

const meta = {
  title: "Auth/ResetPasswordView",
  component: ResetPasswordView,
  args: {
    isValidating: false,
    isTokenValid: true,
    isSubmitting: false,
    onSubmit: fn(),
    onRequestNewLink: fn(),
    onBackToSignIn: fn(),
  },
} satisfies Meta<typeof ResetPasswordView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ValidLink: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("New password", { selector: "input" }), "n3w-secret");
    await userEvent.type(canvas.getByLabelText("Confirm new password", { selector: "input" }), "n3w-secret");
    await userEvent.click(canvas.getByRole("button", { name: "Set new password" }));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      { password: "n3w-secret", confirmPassword: "n3w-secret" },
      expect.anything(),
    );
  },
};

export const PasswordsDiffer: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("New password", { selector: "input" }), "n3w-secret");
    await userEvent.type(canvas.getByLabelText("Confirm new password", { selector: "input" }), "other");
    await userEvent.click(canvas.getByRole("button", { name: "Set new password" }));
    await expect(await canvas.findByText("Passwords do not match")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Checking: Story = {
  args: { isValidating: true, isTokenValid: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Checking your link…")).toBeVisible();
  },
};

export const InvalidLink: Story = {
  args: { isTokenValid: false },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Request a new link" }));
    await expect(args.onRequestNewLink).toHaveBeenCalledTimes(1);
  },
};

export const Submitting: Story = {
  tags: ["!test"],
  args: { isSubmitting: true },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
