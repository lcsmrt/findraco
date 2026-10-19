import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Sheet";

type DemoSheetProps = {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  defaultOpen?: boolean;
  paragraphs?: number;
};

function DemoSheet({ side, showCloseButton, defaultOpen = true, paragraphs = 1 }: DemoSheetProps) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list by period, category and member.</SheetDescription>
        </SheetHeader>
        {/* A scrollable region needs focus so keyboard users can scroll it. */}
        <div
          role="region"
          aria-label="Filter help"
          tabIndex={0}
          className="flex flex-col gap-3 overflow-y-auto px-4"
        >
          {Array.from({ length: paragraphs }, (_, index) => (
            <Text as="p" key={index}>
              Filters apply to the overview and the transactions tab alike, and stay in the address
              bar so a shared link opens the same view.
            </Text>
          ))}
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Apply</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Sheet",
  component: DemoSheet,
} satisfies Meta<typeof DemoSheet>;
export default meta;

type Story = StoryObj<typeof meta>;

// The sheet renders in a portal, outside the story canvas, so queries go through `screen`.
export const Right: Story = {
  args: {},
  play: async ({ userEvent }) => {
    await expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    // The sheet leaves the DOM once its exit animation ends.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

export const Left: Story = { args: { side: "left" } };

export const Top: Story = { args: { side: "top" } };

export const Bottom: Story = { args: { side: "bottom" } };

export const WithoutCloseButton: Story = {
  args: { showCloseButton: false },
  play: async () => {
    await expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  },
};

export const Closed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }));
    // The sheet fades in, so it is visible once its entry animation ends.
    await waitFor(() => expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible());
  },
};

export const LongContent: Story = { args: { paragraphs: 30 } };

// Side sheets take three quarters of a phone's width instead of the desktop's fixed maximum.
export const Mobile: Story = {
  args: {},
  globals: { viewport: { value: "mobile1" } },
};
