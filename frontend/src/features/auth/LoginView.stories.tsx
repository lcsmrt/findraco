import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { LoginView } from "./LoginView";

const meta = {
  title: "Auth/LoginView",
  component: LoginView,
  args: {
    isSubmitting: false,
    onSubmit: fn(async () => {}),
    onForgotPassword: fn(),
    onCreateAccount: fn(),
  },
} satisfies Meta<typeof LoginView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "ana@example.com");
    await userEvent.type(canvas.getByLabelText("Password", { selector: "input" }), "s3cret");
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: "ana@example.com", password: "s3cret" }, expect.anything());
  },
};

export const Invalid: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(await canvas.findByText("Please enter your email")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Submitting: Story = {
  args: { isSubmitting: true },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
