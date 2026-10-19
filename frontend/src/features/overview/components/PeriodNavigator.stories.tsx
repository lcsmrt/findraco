import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import { PeriodNavigator } from "./PeriodNavigator";

const meta = {
  title: "Overview/PeriodNavigator",
  component: PeriodNavigator,
  args: {
    range: { startDate: "2026-10-01", endDate: "2026-10-31" },
    period: "this-month",
    isCustom: false,
    onPresetChange: fn(),
    onRangeChange: fn(),
  },
} satisfies Meta<typeof PeriodNavigator>;
export default meta;

type Story = StoryObj<typeof meta>;

// The arrows step by the period's own length and always produce an absolute range.
export const ThisMonth: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("October 2026")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Previous period" }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({
      from: "2026-09-01",
      to: "2026-09-30",
    });
  },
};

export const LastThreeMonths: Story = {
  args: { range: { startDate: "2026-08-01", endDate: "2026-10-31" }, period: "last-3m" },
};

export const ThisYear: Story = {
  args: { range: { startDate: "2026-01-01", endDate: "2026-12-31" }, period: "this-year" },
};

export const CustomRange: Story = {
  args: { range: { startDate: "2026-10-05", endDate: "2026-10-20" }, isCustom: true },
};

export const AcrossYears: Story = {
  args: { range: { startDate: "2025-11-01", endDate: "2026-02-28" }, isCustom: true },
};

// The menu and the calendar render in portals, outside the story canvas, so queries go through `screen`.
export const RangeMenu: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Range" }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "Last 6 months" }));
    await expect(args.onPresetChange).toHaveBeenCalledWith("last-6m");
  },
};

export const CustomCalendar: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Range" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Custom…" }));
    await expect(await screen.findByRole("dialog", { name: "Choose a period" })).toBeVisible();
  },
};
