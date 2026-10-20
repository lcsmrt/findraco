import type { Meta, StoryObj } from "@storybook/react-vite";
import { ptBR } from "react-day-picker/locale";
import { expect } from "storybook/test";
import { Calendar } from "./Calendar";

// A fixed month keeps every story the same on every run.
const march = new Date(2026, 2, 1);

const meta = {
  tags: ["!test"],
  title: "Calendar",
  component: Calendar,
  args: { defaultMonth: march },
} satisfies Meta<typeof Calendar>;
export default meta;

type Story = StoryObj<typeof meta>;

// Without `selected`, the calendar keeps the selection itself.
export const Single: Story = {
  args: { mode: "single" },
  play: async ({ canvas, userEvent }) => {
    const day = canvas.getByRole("button", { name: /March 20th/ });
    await userEvent.click(day);
    await expect(day).toHaveAttribute("data-selected-single", "true");
  },
};

export const Selected: Story = {
  args: { mode: "single", selected: new Date(2026, 2, 14) },
};

export const Range: Story = {
  args: {
    mode: "range",
    selected: { from: new Date(2026, 2, 9), to: new Date(2026, 2, 15) },
  },
};

export const PortugueseLocale: Story = {
  args: { mode: "single", locale: ptBR, selected: new Date(2026, 2, 14) },
};

export const DropdownCaption: Story = {
  args: {
    mode: "single",
    captionLayout: "dropdown",
    startMonth: new Date(2020, 0),
    endMonth: new Date(2030, 11),
  },
};

export const DisabledDays: Story = {
  args: { mode: "single", disabled: { before: new Date(2026, 2, 10) } },
};

export const WeekNumbers: Story = {
  args: { mode: "single", showWeekNumber: true },
};

export const TwoMonths: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
    selected: { from: new Date(2026, 2, 25), to: new Date(2026, 3, 5) },
  },
};

// Months sit side by side from the md breakpoint and stack below it.
export const TwoMonthsMobile: Story = {
  args: TwoMonths.args,
  globals: { viewport: { value: "mobile1" } },
};
