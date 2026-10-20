import { FormField } from "@/components/form/FormField";
import { Button } from "@/components/button/base/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { expect, fn, screen, waitFor } from "storybook/test";
import { z } from "zod";
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

const dueDateSchema = z.object({
  dueDate: z.date({ required_error: "Pick a due date" }),
});

type DueDateValues = z.input<typeof dueDateSchema>;

const submitDueDate = fn();

// The form-creation binding: the picker takes the field's ref and onBlur like any other input, so
// the form can focus it on an error and mark it touched.
function DueDateForm() {
  const { control, handleSubmit } = useForm<DueDateValues>({
    resolver: zodResolver(dueDateSchema),
    mode: "onTouched",
  });

  return (
    <form className="flex w-56 flex-col gap-4" onSubmit={handleSubmit(submitDueDate)}>
      <FormField control={control} name="dueDate" label="Due date">
        {(field) => (
          <DatePicker
            id={field.id}
            ref={field.ref}
            onBlur={field.onBlur}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      </FormField>
      <Button type="submit">Save</Button>
    </form>
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

export const InForm: Story = {
  render: () => <DueDateForm />,
  play: async ({ canvas, userEvent, step }) => {
    submitDueDate.mockClear();
    const input = canvas.getByLabelText("Due date");

    await step("leaving the empty field marks it touched", async () => {
      await userEvent.click(input);
      await expect(canvas.queryByRole("alert")).toBeNull();
      await userEvent.tab();
      await expect(await canvas.findByRole("alert")).toHaveTextContent("Pick a due date");
    });

    await step("an empty submit focuses the field", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Save" }));
      await waitFor(() => expect(input).toHaveFocus());
      await expect(submitDueDate).not.toHaveBeenCalled();
    });

    await step("a typed date reaches the submitted value", async () => {
      await userEvent.type(input, "05/03/2026");
      await userEvent.click(canvas.getByRole("button", { name: "Save" }));
      await waitFor(() => expect(submitDueDate).toHaveBeenCalledTimes(1));
      await expect(submitDueDate.mock.calls[0][0]).toEqual({ dueDate: new Date(2026, 2, 5) });
    });
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
  tags: ["!test"],
  args: { initialValue: new Date(2026, 2, 14), disablePast: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await expect(await screen.findByRole("button", { name: /March 5th/ })).toBeDisabled();
  },
};

export const Disabled: Story = { tags: ["!test"], args: { initialValue: new Date(2026, 2, 14), disabled: true } };

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
  tags: ["!test"],
  render: () => (
    <DemoRange initialValue={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 15) }} />
  ),
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await expect(await screen.findAllByRole("grid")).toHaveLength(2);
  },
};
