import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { RegisterUserView } from "./RegisterUserView";

const meta = {
  title: "Auth/RegisterUserView",
  component: RegisterUserView,
  args: {
    isSubmitting: false,
    onSubmit: fn(async () => {}),
    onSignIn: fn(),
  },
} satisfies Meta<typeof RegisterUserView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignUp: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Ana Lima");
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "ana@example.com");
    await userEvent.type(canvas.getByLabelText("Password", { selector: "input" }), "s3cret-pass");
    await userEvent.click(canvas.getByRole("button", { name: "Sign up" }));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      { name: "Ana Lima", email: "ana@example.com", password: "s3cret-pass" },
      expect.anything(),
    );
  },
};

export const Invalid: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Sign up" }));
    await expect(await canvas.findByText("Please enter your full name")).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
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
