import { FormField } from "@/components/form/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, type Mode } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { DatePicker } from "./DatePicker";

const dueDateSchema = z.object({
  title: z.string().min(1, "Enter a title"),
  dueDate: z.date({ required_error: "Pick a due date" }),
});

type DueDateValues = z.input<typeof dueDateSchema>;

type DueDateFormProps = {
  mode?: Mode;
  onValues?: (values: DueDateValues) => void;
};

// The form-creation binding: every field through FormField, the date picker spreading the field's
// ref and onBlur like any other input.
function DueDateForm({ mode = "onSubmit", onValues = vi.fn() }: DueDateFormProps) {
  const { control, handleSubmit } = useForm<DueDateValues>({
    resolver: zodResolver(dueDateSchema),
    defaultValues: { title: "Rent" },
    mode,
  });

  return (
    <form onSubmit={handleSubmit(onValues)}>
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
      <FormField control={control} name="title" label="Title">
        {(field) => <input {...field} />}
      </FormField>
      <button type="submit">Save</button>
    </form>
  );
}

describe("DatePicker in a form", () => {
  afterEach(cleanup);

  it("receives focus when submitting an empty required date", async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<DueDateForm onValues={onValues} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Pick a due date")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Due date"));
    expect(onValues).not.toHaveBeenCalled();
  });

  it("marks the field touched on blur, so blur validation reports the empty date", async () => {
    const user = userEvent.setup();
    render(<DueDateForm mode="onBlur" />);

    await user.click(screen.getByLabelText("Due date"));
    expect(screen.queryByText("Pick a due date")).toBeNull();
    await user.tab();

    expect(await screen.findByText("Pick a due date")).toBeTruthy();
  });

  it("hands a typed date to the form on submit", async () => {
    const user = userEvent.setup();
    const onValues = vi.fn();
    render(<DueDateForm onValues={onValues} />);

    await user.type(screen.getByLabelText("Due date"), "05/03/2026");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onValues).toHaveBeenCalledTimes(1);
    expect(onValues.mock.calls[0][0]).toEqual({ title: "Rent", dueDate: new Date(2026, 2, 5) });
  });
});
