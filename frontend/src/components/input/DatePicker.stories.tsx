import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { expect, screen, waitFor } from "storybook/test";
import { DatePicker, DateRangePicker } from "./DatePicker";
import { Field, FieldLabel } from "./base/Field";

type DemoDatePickerProps = {
  initialValue?: Date;
  disabled?: boolean;
  disablePast?: boolean;
};

// The picker is controlled, so the story holds the value like a form field does.
function DemoDatePicker({ initialValue, disabled, disablePast }: DemoDatePickerProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Field className="w-56">
      <FieldLabel htmlFor="demo-date">Date</FieldLabel>
      <DatePicker
        id="demo-date"
        value={value}
        onChange={setValue}
        disabled={disabled}
        disabledDates={disablePast ? { before: new Date(2026, 2, 10) } : undefined}
      />
    </Field>
  );
}

type DemoRangeProps = { initialValue?: DateRange; numberOfMonths?: number };

function DemoRange({ initialValue, numberOfMonths }: DemoRangeProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Field className="w-72">
      <FieldLabel htmlFor="demo-range">Period</FieldLabel>
      <DateRangePicker
        id="demo-range"
        value={value}
        onChange={setValue}
        numberOfMonths={numberOfMonths}
      />
    </Field>
  );
}

const meta = {
  title: "Input/DatePicker",
  component: DemoDatePicker,
} satisfies Meta<typeof DemoDatePicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Date");
    await userEvent.type(input, "14/03/2026{Enter}");
    await expect(input).toHaveValue("14/03/2026");
    await expect(canvas.getByRole("button", { name: "Clear date" })).toBeVisible();
  },
};

export const WithValue: Story = { args: { initialValue: new Date(2026, 2, 14) } };

// The calendar renders in a portal, outside the story canvas, so queries go through `screen`.
export const CalendarOpen: Story = {
  args: { initialValue: new Date(2026, 2, 14) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await userEvent.click(await screen.findByRole("button", { name: /March 20th/ }));
    await waitFor(() => expect(canvas.getByLabelText("Date")).toHaveValue("20/03/2026"));
  },
};

export const InvalidTyping: Story = {
  args: { initialValue: new Date(2026, 2, 14) },
  // Text that is not a date restores the last valid value on blur.
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Date");
    await userEvent.clear(input);
    await userEvent.type(input, "31/02/2026{Enter}");
    await expect(input).toHaveValue("14/03/2026");
  },
};

export const DisabledDates: Story = {
  args: { initialValue: new Date(2026, 2, 14), disablePast: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await expect(await screen.findByRole("button", { name: /March 5th/ })).toBeDisabled();
  },
};

export const Disabled: Story = { args: { initialValue: new Date(2026, 2, 14), disabled: true } };

export const Range: Story = {
  render: () => (
    <DemoRange initialValue={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 15) }} />
  ),
};

export const RangeEmpty: Story = {
  render: () => <DemoRange />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await expect(await screen.findAllByRole("grid")).toHaveLength(2);
  },
};

export const RangeSingleMonth: Story = {
  render: () => <DemoRange numberOfMonths={1} initialValue={{ from: new Date(2026, 2, 9) }} />,
};

// Two months sit side by side from the md breakpoint and stack below it.
export const RangeMobile: Story = {
  render: () => (
    <DemoRange initialValue={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 15) }} />
  ),
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await expect(await screen.findAllByRole("grid")).toHaveLength(2);
  },
};
