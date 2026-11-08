import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OAuthLoginView } from "./OAuthLoginView";

const meta = {
  title: "OAuth/OAuthLoginView",
  component: OAuthLoginView,
  args: { csrfToken: "csrf-123" },
} satisfies Meta<typeof OAuthLoginView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  play: async ({ canvas }) => {
    const form = canvas
      .getByRole("button", { name: "Sign in" })
      .closest("form");
    await expect(form).toHaveAttribute("action", "/oauth2/login");
    await expect(form).toHaveAttribute("method", "post");
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
};

export const WrongCredentials: Story = {
  args: { error: "wrong-credentials" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Invalid e-mail or password.",
    );
  },
};

export const RateLimited: Story = {
  args: { error: "rate-limited" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Too many attempts. Wait a few minutes and try again.",
    );
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
