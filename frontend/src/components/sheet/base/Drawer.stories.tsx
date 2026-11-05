import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "./Drawer";

type DemoDrawerProps = {
  paragraphs?: number;
};

function DemoDrawer({ paragraphs = 1 }: DemoDrawerProps) {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        {/* A scrollable region needs focus so keyboard users can scroll it. */}
        <div
          role="region"
          aria-label="Filter help"
          tabIndex={0}
          className="flex min-h-0 flex-col gap-3 overflow-y-auto px-4"
        >
          {Array.from({ length: paragraphs }, (_, index) => (
            <Text as="p" key={index}>
              Filters apply to the overview and the transactions tab alike, and stay in the address
              bar so a shared link opens the same view.
            </Text>
          ))}
        </div>
        <DrawerFooter>
          <Button>Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const meta = {
  tags: ["!test"],
  title: "Drawer",
  component: DemoDrawer,
} satisfies Meta<typeof DemoDrawer>;
export default meta;

type Story = StoryObj<typeof meta>;

// The drawer renders in a portal, outside the story canvas, so queries go through `screen`.
export const Short: Story = {
  play: async () => {
    await expect(screen.getByRole("dialog", { name: "Filters" })).toBeVisible();
  },
};

export const LongContent: Story = { args: { paragraphs: 30 } };
