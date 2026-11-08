import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OAuthConsentView } from "./OAuthConsentView";

const meta = {
  title: "OAuth/OAuthConsentView",
  component: OAuthConsentView,
  args: {
    isLoading: false,
    client: { name: "Claude", redirectHost: "claude.ai" },
    clientId: "https://claude.ai/oauth/mcp-oauth-client-metadata",
    scope: "findraco.mcp",
    state: "state-xyz",
    csrfToken: "csrf-123",
  },
} satisfies Meta<typeof OAuthConsentView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Connect Claude to findraco",
      }),
    ).toBeVisible();
    await expect(
      canvas.getByText("After you choose, you return to claude.ai."),
    ).toBeVisible();
    await expect(
      canvas.getByText("Read your plans, categories and transactions"),
    ).toBeVisible();
    await expect(
      canvas.getByText("Create, confirm and edit transactions"),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Allow" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Deny" })).toBeVisible();
  },
};

export const UnknownClient: Story = {
  args: { client: undefined },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "App not recognized" }),
    ).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const Loading: Story = {
  tags: ["!test"],
  args: { isLoading: true, client: undefined },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
