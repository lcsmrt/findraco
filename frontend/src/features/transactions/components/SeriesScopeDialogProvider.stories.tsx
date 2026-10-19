import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, screen, waitFor } from "storybook/test";
import { SeriesScopeDialogProvider } from "./SeriesScopeDialogProvider";
import { useSeriesScope, type ScopeDialogOptions } from "./useSeriesScope";

type AskButtonProps = { options?: ScopeDialogOptions };

// A screen asks through `useSeriesScope`; the answer shows below so each story can check it.
function AskButton({ options }: AskButtonProps) {
  const chooseScope = useSeriesScope();
  const [answer, setAnswer] = useState("No answer yet");

  async function ask() {
    setAnswer((await chooseScope(options)) ?? "Cancelled");
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={ask}>Edit occurrence</Button>
      <Text>{answer}</Text>
    </div>
  );
}

function DemoProvider({ options }: AskButtonProps) {
  return (
    <SeriesScopeDialogProvider>
      <AskButton options={options} />
    </SeriesScopeDialogProvider>
  );
}

const meta = {
  title: "Transactions/SeriesScopeDialogProvider",
  component: DemoProvider,
} satisfies Meta<typeof DemoProvider>;
export default meta;

type Story = StoryObj<typeof meta>;

// Every question starts from "This one", whatever the previous answer was.
export const ChooseScope: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit occurrence" }));
    await userEvent.click(await screen.findByRole("radio", { name: /All/ }));
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(canvas.getByText("ALL")).toBeVisible());
  },
};

export const Cancel: Story = {
  args: { options: { title: "Delete recurring transaction", confirmLabel: "Delete" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit occurrence" }));
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(canvas.getByText("Cancelled")).toBeVisible());
  },
};
