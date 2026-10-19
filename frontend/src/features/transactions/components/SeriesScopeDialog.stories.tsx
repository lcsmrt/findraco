import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { SeriesEditScope } from "@/api/dtos/financialTransaction";
import { expect, fn, screen } from "storybook/test";
import { SeriesScopeDialog } from "./SeriesScopeDialog";
import type { ScopeDialogOptions } from "./useSeriesScope";

type DemoProps = {
  options: ScopeDialogOptions;
  initialScope?: SeriesEditScope;
  onContinue: () => void;
  onCancel: () => void;
};

// The dialog is controlled, so the story holds the chosen scope like its provider does.
function DemoScopeDialog({ options, initialScope = "THIS_ONE", onContinue, onCancel }: DemoProps) {
  const [scope, setScope] = useState(initialScope);
  return (
    <SeriesScopeDialog
      open
      scope={scope}
      options={options}
      onScopeChange={setScope}
      onContinue={onContinue}
      onCancel={onCancel}
    />
  );
}

const meta = {
  title: "Transactions/SeriesScopeDialog",
  component: DemoScopeDialog,
  args: { options: {}, onContinue: fn(), onCancel: fn() },
} satisfies Meta<typeof DemoScopeDialog>;
export default meta;

type Story = StoryObj<typeof meta>;

// The dialog renders in a portal, outside the story canvas, so queries go through `screen`.
export const Edit: Story = {
  play: async ({ args, userEvent }) => {
    await expect(screen.getByRole("dialog", { name: "Edit series" })).toBeVisible();
    await userEvent.click(screen.getByRole("radio", { name: /This and following/ }));
    await expect(screen.getByRole("radio", { name: /This and following/ })).toBeChecked();
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await expect(args.onContinue).toHaveBeenCalled();
  },
};

export const Delete: Story = {
  args: {
    options: {
      title: "Delete recurring transaction",
      description: "Choose which occurrences to delete.",
      confirmLabel: "Delete",
      confirmVariant: "destructive",
    },
    initialScope: "ALL",
  },
  play: async () => {
    await expect(screen.getByRole("radio", { name: /All/ })).toBeChecked();
  },
};

export const Mobile: Story = { globals: { viewport: { value: "mobile1" } } };
