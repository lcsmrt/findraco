import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, screen, waitFor } from "storybook/test";
import { ConfirmDialogProvider } from "./ConfirmDialogProvider";
import { useConfirm, type ConfirmOptions } from "./useConfirm";

type AskButtonProps = { options: ConfirmOptions };

// A screen asks through `useConfirm`; the answer shows below so each story can check it.
function AskButton({ options }: AskButtonProps) {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string>("No answer yet");

  async function ask() {
    setAnswer((await confirm(options)) ? "Confirmed" : "Cancelled");
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={ask}>Ask</Button>
      <Text>{answer}</Text>
    </div>
  );
}

function DemoConfirm({ options }: AskButtonProps) {
  return (
    <ConfirmDialogProvider>
      <AskButton options={options} />
    </ConfirmDialogProvider>
  );
}

const meta = {
  title: "Dialog/ConfirmDialogProvider",
  component: DemoConfirm,
  args: {
    options: {
      title: "Leave plan?",
      description: "You will lose access to its transactions until someone invites you again.",
    },
  },
} satisfies Meta<typeof DemoConfirm>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Confirm: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(await screen.findByRole("dialog", { name: "Leave plan?" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(canvas.getByText("Confirmed")).toBeVisible());
  },
};

export const Cancel: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(canvas.getByText("Cancelled")).toBeVisible());
  },
};

export const Destructive: Story = {
  tags: ["!test"],
  args: {
    options: {
      title: "Delete transaction?",
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep",
      variant: "destructive",
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(await screen.findByRole("button", { name: "Delete" })).toBeVisible();
    await expect(screen.getByRole("button", { name: "Keep" })).toBeVisible();
  },
};

export const LongDescription: Story = {
  tags: ["!test"],
  args: {
    options: {
      title: "Delete the category Household maintenance and repairs?",
      description:
        "Its 248 transactions, its spending limit and its 12 subcategories will move to the category you choose next. Recurring transactions keep their schedule and future installments follow the new category as well.",
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ask" }));
    await expect(await screen.findByRole("dialog")).toBeVisible();
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  ...LongDescription,
  globals: { viewport: { value: "mobile1" } },
};
