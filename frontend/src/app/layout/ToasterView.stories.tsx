import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { expect, waitFor, within } from "storybook/test";
import { ToasterView } from "./ToasterView";

// Sonner keeps its toasts in a module-level store, so each story starts from an empty one.
function clearToasts() {
  toast.dismiss();
}

const meta = {
  title: "App/ToasterView",
  component: ToasterView,
  args: { theme: "light" },
  beforeEach: clearToasts,
} satisfies Meta<typeof ToasterView>;
export default meta;

type Story = StoryObj<typeof meta>;

// A toast mounts transparent and fades in, so wait until it is actually visible.
async function toastVisible(canvasElement: HTMLElement, text: string | RegExp) {
  const page = within(canvasElement.ownerDocument.body);
  await waitFor(() => expect(page.getByText(text)).toBeVisible());
}

export const Success: Story = {
  play: async ({ canvasElement }) => {
    toast.success("Transaction saved");
    await toastVisible(canvasElement, "Transaction saved");
  },
};

export const ErrorToast: Story = {
  name: "Error",
  play: async ({ canvasElement }) => {
    toast.error("Couldn't save the transaction", { description: "Check your connection and try again." });
    await toastVisible(canvasElement, "Couldn't save the transaction");
  },
};

export const Info: Story = {
  play: async ({ canvasElement }) => {
    toast.info("Invitation sent");
    await toastVisible(canvasElement, "Invitation sent");
  },
};

export const Warning: Story = {
  play: async ({ canvasElement }) => {
    toast.warning("Your session expires soon");
    await toastVisible(canvasElement, "Your session expires soon");
  },
};

export const Loading: Story = {
  play: async ({ canvasElement }) => {
    toast.loading("Importing transactions");
    await toastVisible(canvasElement, "Importing transactions");
  },
};

export const Dark: Story = {
  args: { theme: "dark" },
  play: Success.play,
};

export const LongMessage: Story = {
  play: async ({ canvasElement }) => {
    toast.success("Imported 1,284 transactions from bank-statement-2026-september-final-v2.csv", {
      description:
        "Duplicates were skipped and every uncategorised row was assigned to the default category of the shared household plan.",
    });
    await toastVisible(canvasElement, /Imported 1,284 transactions/);
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: LongMessage.play,
};
