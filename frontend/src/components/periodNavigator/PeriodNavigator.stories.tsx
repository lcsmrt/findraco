import type { Meta, StoryObj } from "@storybook/react-vite";
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

// The menu and the calendar render in portals, outside the story canvas, so queries go through `screen`.
export const RangeMenu: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Range" }));
    const options = await screen.findAllByRole("menuitemradio");
    await expect(options.map((option) => option.textContent)).toEqual([
      "This month",
      "Last 3 months",
      "Last 6 months",
      "This year",
    ]);
    await expect(screen.getByRole("menuitem", { name: "Custom…" })).toBeVisible();
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

// The calendar opens preset to the current range; the first click starts a new range, the second completes it.
export const LabelOpensCalendar: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose period, October 2026" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a period" });
    await expect(dialog).toBeVisible();
    await userEvent.click(await within(dialog).findByRole("button", { name: /October 5th, 2026/ }));
    await expect(args.onRangeChange).not.toHaveBeenCalled();
    await expect(screen.getByRole("dialog", { name: "Choose a period" })).toBeVisible();
    await userEvent.click(await within(dialog).findByRole("button", { name: /October 20th, 2026/ }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({ from: "2026-10-05", to: "2026-10-20" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Choose a period" })).toBeNull());
  },
};
