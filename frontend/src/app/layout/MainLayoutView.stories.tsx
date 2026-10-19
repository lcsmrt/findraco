import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Text } from "@/components/typography/base/Text";
import { MainLayoutView } from "./MainLayoutView";

const meta = {
  title: "App/MainLayoutView",
  component: MainLayoutView,
  parameters: { layout: "fullscreen" },
  args: {
    navbar: (
      <nav aria-label="Main" className="bg-background fixed flex h-16 w-full items-center border-b px-4">
        <Text variant="label">Navbar</Text>
      </nav>
    ),
    children: <Text as="p">Page content</Text>,
  },
} satisfies Meta<typeof MainLayoutView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithPage: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(canvas.getByRole("main")).toHaveTextContent("Page content");
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 40 }, (_, index) => (
          <Text as="p" key={index}>
            Row {index + 1}
          </Text>
        ))}
      </div>
    ),
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
