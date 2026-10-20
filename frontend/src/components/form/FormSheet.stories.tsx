import { Button } from "@/components/button/base/Button";
import { Field, FieldGroup, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { expect, fn, screen } from "storybook/test";
import { FormSheet } from "./FormSheet";

type DemoFieldsProps = {
  count?: number;
};

function DemoFields({ count = 2 }: DemoFieldsProps) {
  return (
    <FieldGroup>
      {Array.from({ length: count }, (_, index) => (
        <Field key={index}>
          <FieldLabel htmlFor={`demo-field-${index}`}>Field {index + 1}</FieldLabel>
          <Input id={`demo-field-${index}`} defaultValue={index === 0 ? "Groceries" : ""} />
        </Field>
      ))}
    </FieldGroup>
  );
}

const meta = {
  title: "Form/FormSheet",
  component: FormSheet,
  args: {
    open: true,
    onOpenChange: fn(),
    title: "New Category",
    // The real forms pass `handleSubmit(submit)`, which prevents the page navigation itself.
    onSubmit: fn((event) => event.preventDefault()),
    isSubmitting: false,
    submitLabel: "Create",
    children: <DemoFields />,
  },
} satisfies Meta<typeof FormSheet>;
export default meta;

type Story = StoryObj<typeof meta>;

// The sheet renders in a portal, outside the story canvas, so queries go through `screen`.
export const Idle: Story = {
  play: async ({ args, userEvent }) => {
    await expect(screen.getByRole("dialog", { name: "New Category" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
  },
};

export const Submitting: Story = {
  tags: ["!test"],
  args: { isSubmitting: true, title: "Edit Category", submitLabel: "Save" },
  play: async () => {
    await expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    // The spinner's "Loading" label joins the button's name while it submits.
    await expect(screen.getByRole("button", { name: "Loading Save" })).toBeDisabled();
  },
};

export const SubmitUnavailable: Story = {
  tags: ["!test"],
  args: { title: "Edit series", submitLabel: "Save", submitDisabled: true },
  play: async () => {
    await expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
  },
};

export const WithMobileActions: Story = {
  tags: ["!test"],
  args: {
    title: "Edit Transaction",
    submitLabel: "Save",
    mobileActions: (
      <>
        <Button variant="outline" type="button" className="text-destructive hover:text-destructive flex-1">
          <Trash2Icon className="h-4 w-4" />
          Delete
        </Button>
        <Button variant="outline" type="button" className="flex-1">
          <CopyIcon className="h-4 w-4" />
          Duplicate
        </Button>
      </>
    ),
  },
  globals: { viewport: { value: "mobile1" } },
  play: async () => {
    await expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    await expect(screen.getByRole("button", { name: "Duplicate" })).toBeVisible();
  },
};

export const LongContentScrolls: Story = {
  tags: ["!test"],
  args: { children: <DemoFields count={20} /> },
  play: async () => {
    const form = screen.getByLabelText("Field 1").closest("form");
    await expect(form?.scrollHeight).toBeGreaterThan(form?.clientHeight ?? 0);
    // The footer stays reachable however long the form grows.
    await expect(screen.getByRole("button", { name: "Create" })).toBeVisible();
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  globals: { viewport: { value: "mobile1" } },
};
