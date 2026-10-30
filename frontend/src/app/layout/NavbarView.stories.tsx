import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown, Moon } from "lucide-react";
import { expect, fn, screen, waitFor } from "storybook/test";
import { Button } from "@/components/button/base/Button";
import { NavbarView } from "./NavbarView";

const meta = {
  title: "App/NavbarView",
  component: NavbarView,
  parameters: { layout: "fullscreen" },
  args: {
    userName: "Ada Lovelace",
    onSignOut: fn(),
    onOpenTimeZone: fn(),
    timeZoneDialog: null,
    planSwitcher: (
      <Button variant="ghost">
        Household
        <ChevronsUpDown />
      </Button>
    ),
    themeToggle: (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Moon />
      </Button>
    ),
  },
} satisfies Meta<typeof NavbarView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignedIn: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("AL")).toBeVisible();
    await userEvent.click(canvas.getByText("AL"));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Logout" }));
    await expect(args.onSignOut).toHaveBeenCalledTimes(1);
    // Choosing an item closes the menu; the a11y check runs once it has left.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const OpenTimeZone: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("AL"));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Time zone" }),
    );
    await expect(args.onOpenTimeZone).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const LongPlanName: Story = {
  tags: ["!test"],
  args: {
    userName: "Maria Fernanda da Silva Albuquerque Mendes",
    planSwitcher: (
      <Button variant="ghost">
        Household finances shared with the whole family
        <ChevronsUpDown />
      </Button>
    ),
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
