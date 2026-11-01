import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { expect, fn, waitFor } from "storybook/test";
import { Text } from "@/components/typography/base/Text";
import { BottomBarView } from "./BottomBarView";
import { MainLayoutView } from "./MainLayoutView";
import { TabRowView } from "./TabRowView";
import { ToasterView } from "./ToasterView";

const meta = {
  title: "App/MainLayoutView",
  component: MainLayoutView,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: { phone: { name: "Phone (390px)", styles: { width: "390px", height: "844px" }, type: "mobile" } },
    },
  },
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

const longContent = (
  <div className="flex flex-col gap-3 p-4">
    {Array.from({ length: 40 }, (_, index) => (
      <Text as="p" key={index}>
        Row {index + 1}
      </Text>
    ))}
  </div>
);

/** The accept-invitation page: under the layout, without the destinations. */
export const WithPage: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(canvas.getByRole("main")).toHaveTextContent("Page content");
    await expect(canvas.queryByRole("navigation", { name: "Bottom bar" })).toBeNull();
    await expect(canvas.queryByRole("navigation", { name: "Destinations" })).toBeNull();
  },
};

export const LongContent: Story = {
  tags: ["!test"],
  args: { children: longContent },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};

export const WithNavigationMobile: Story = {
  globals: { viewport: { value: "phone" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    navigation: {
      tabRow: <TabRowView current="transactions" onAdd={fn()} />,
      bottomBar: <BottomBarView current="transactions" onAdd={fn()} />,
    },
    children: longContent,
  },
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole("navigation", { name: "Bottom bar" });
    await expect(bar).toBeVisible();
    await expect(canvas.queryByRole("navigation", { name: "Destinations" })).toBeNull();

    const view = canvasElement.ownerDocument.defaultView;
    view?.scrollTo(0, canvasElement.ownerDocument.documentElement.scrollHeight);
    const lastRow = canvas.getByText("Row 40");
    await waitFor(() =>
      expect(lastRow.getBoundingClientRect().bottom).toBeLessThanOrEqual(bar.getBoundingClientRect().top),
    );
    // Pinned to the viewport, not laid out at the end of the page: it stays in view while scrolling.
    await expect(getComputedStyle(bar).position).toBe("fixed");
    await expect(Math.round(bar.getBoundingClientRect().bottom)).toBe(view?.innerHeight);
  },
};

export const ToastAboveBottomBar: Story = {
  ...WithNavigationMobile,
  args: {
    ...WithNavigationMobile.args,
    overlay: <ToasterView theme="light" />,
  },
  // Sonner keeps its toasts in a module-level store, so each run starts from an empty one.
  beforeEach: () => {
    toast.dismiss();
  },
  play: async ({ canvas, canvasElement }) => {
    toast("Transaction saved");
    const bar = canvas.getByRole("navigation", { name: "Bottom bar" });
    const toastElement = await waitFor(() => {
      const element = canvasElement.ownerDocument.querySelector("[data-sonner-toast]");
      expect(element).toBeVisible();
      return element as HTMLElement;
    });
    await waitFor(() =>
      expect(toastElement.getBoundingClientRect().bottom).toBeLessThanOrEqual(bar.getBoundingClientRect().top),
    );
  },
};
