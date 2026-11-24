import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { PeriodNavigator } from "./PeriodNavigator";

const meta = {
  title: "PeriodNavigator",
  component: PeriodNavigator,
  args: {
    range: { startDate: "2026-10-01", endDate: "2026-10-31" },
    period: "this-month",
    isCustom: false,
    onPresetChange: fn(),
    onRangeChange: fn(),
    onStep: fn(),
  },
} satisfies Meta<typeof PeriodNavigator>;
export default meta;

type Story = StoryObj<typeof meta>;

const PANEL = "Choose a period";

// The panel renders in a portal, outside the story canvas, so its queries go through `screen`.
async function openPanel(canvas: { getByRole: typeof screen.getByRole }, userEvent: { click: (element: Element) => Promise<void> }) {
  await userEvent.click(canvas.getByRole("button", { name: "Choose period, October 2026" }));
  return screen.findByRole("dialog", { name: PANEL });
}

export const ThisMonth: Story = {
  tags: ["!test"],
};

export const LastThreeMonths: Story = {
  tags: ["!test"],
  args: { range: { startDate: "2026-08-01", endDate: "2026-10-31" }, period: "last-3m" },
};

export const ThisYear: Story = {
  tags: ["!test"],
  args: { range: { startDate: "2026-01-01", endDate: "2026-12-31" }, period: "this-year" },
};

export const CustomRange: Story = {
  args: { range: { startDate: "2026-10-05", endDate: "2026-10-20" }, isCustom: true },
};

export const AcrossYears: Story = {
  tags: ["!test"],
  args: { range: { startDate: "2025-11-01", endDate: "2026-02-28" }, isCustom: true },
};

// Presets and the calendar live in the label's panel, so the control itself is only the two arrows and the label.
export const ArrowsAndLabelOnly: Story = {
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole("button");
    await expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Previous period",
      "Choose period, October 2026",
      "Next period",
    ]);
    await expect(canvas.queryByRole("button", { name: "Range" })).toBeNull();
  },
};

// The arrows step by the period's own length and report the range they land on.
export const ArrowsStep: Story = {
  args: { range: { startDate: "2026-11-01", endDate: "2026-11-30" } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Next period" }));
    await expect(args.onStep).toHaveBeenLastCalledWith({ from: "2026-12-01", to: "2026-12-31" });
    await userEvent.click(canvas.getByRole("button", { name: "Previous period" }));
    await expect(args.onStep).toHaveBeenLastCalledWith({ from: "2026-10-01", to: "2026-10-31" });
    await expect(args.onRangeChange).not.toHaveBeenCalled();
  },
};

export const PanelPopover: Story = {
  play: async ({ canvas, userEvent }) => {
    await page.viewport(1280, 800);
    const dialog = await openPanel(canvas, userEvent);
    const presets = ["This month", "Last 3 months", "Last 6 months", "This year"].map((name) =>
      within(dialog).getByRole("button", { name }),
    );
    await expect(presets.map((preset) => preset.getAttribute("aria-pressed"))).toEqual([
      "true",
      "false",
      "false",
      "false",
    ]);
    const calendar = within(dialog).getByRole("grid");
    await expect(calendar).toBeVisible();
    for (const preset of presets) {
      await expect(preset.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        calendar.getBoundingClientRect().top,
      );
    }
    // From `sm` the panel hangs off the control instead of sitting at the bottom of the window.
    await expect(dialog.getBoundingClientRect().bottom).toBeLessThan(window.innerHeight - 100);
  },
};

export const PanelSheetPhone: Story = {
  play: async ({ canvas, userEvent }) => {
    await page.viewport(414, 896);
    const dialog = await openPanel(canvas, userEvent);
    await expect(within(dialog).getByRole("button", { name: "Last 6 months" })).toBeVisible();
    await expect(within(dialog).getByRole("grid")).toBeVisible();
    // The sheet slides in, so its edge is read once it has settled.
    await waitFor(() => expect(Math.abs(dialog.getBoundingClientRect().bottom - window.innerHeight)).toBeLessThan(1));
  },
};

export const PresetApplies: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await page.viewport(1280, 800);
    const dialog = await openPanel(canvas, userEvent);
    await userEvent.click(within(dialog).getByRole("button", { name: "Last 3 months" }));
    await expect(args.onPresetChange).toHaveBeenCalledWith("last-3m");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: PANEL })).toBeNull());
  },
};

// The calendar opens on the current range; the first click starts a new range, the second completes it.
export const RangeApplies: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await page.viewport(1280, 800);
    const dialog = await openPanel(canvas, userEvent);
    await userEvent.click(await within(dialog).findByRole("button", { name: /October 5th, 2026/ }));
    await expect(args.onRangeChange).not.toHaveBeenCalled();
    await expect(screen.getByRole("dialog", { name: PANEL })).toBeVisible();
    await userEvent.click(await within(dialog).findByRole("button", { name: /October 20th, 2026/ }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({ from: "2026-10-05", to: "2026-10-20" });
    await expect(args.onPresetChange).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: PANEL })).toBeNull());
  },
};

// A phone row has no ragged end: the arrows sit on the content's edges and the label between them.
export const SpansWidthPhone: Story = {
  play: async ({ canvas }) => {
    await page.viewport(414, 896);
    const previous = canvas.getByRole("button", { name: "Previous period" });
    const next = canvas.getByRole("button", { name: "Next period" });
    const label = canvas.getByRole("button", { name: "Choose period, October 2026" });
    const container = previous.parentElement?.parentElement;
    if (!container) throw new Error("the control has no container");
    await waitFor(() => {
      const box = container.getBoundingClientRect();
      const style = getComputedStyle(container);
      const left = box.left + parseFloat(style.paddingLeft);
      const right = box.right - parseFloat(style.paddingRight);
      const labelBox = label.getBoundingClientRect();
      expect(Math.abs(previous.getBoundingClientRect().left - left)).toBeLessThanOrEqual(1);
      expect(Math.abs(next.getBoundingClientRect().right - right)).toBeLessThanOrEqual(1);
      expect(Math.abs((labelBox.left + labelBox.right) / 2 - (left + right) / 2)).toBeLessThanOrEqual(2);
    });
  },
};
