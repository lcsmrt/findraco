import { Input } from "@/components/input/base/Input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { FormField } from "./FormField";

type DemoValues = { name: string };

type DemoFormProps = {
  label: string;
  description?: string;
  error?: string;
  disabled?: boolean;
};

// FormField needs a live form, so each story renders it inside a small test form.
function DemoForm({ label, description, error, disabled = false }: DemoFormProps) {
  const { control } = useForm<DemoValues>({
    defaultValues: { name: "Groceries" },
    disabled,
    errors: error ? { name: { type: "manual", message: error } } : undefined,
  });

  return (
    <form className="w-72">
      <FormField control={control} name="name" label={label} description={description}>
        {(field) => <Input {...field} />}
      </FormField>
    </form>
  );
}

const meta = {
  title: "Form/FormField",
  component: DemoForm,
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
  args: { label: "Name" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Name");
    await expect(input).toHaveValue("Groceries");
    await expect(input).toHaveAttribute("aria-invalid", "false");
    await userEvent.clear(input);
    await userEvent.type(input, "Rent");
    await expect(input).toHaveValue("Rent");
  },
};

export const WithDescription: Story = {
  tags: ["!test"],
  args: { label: "Name", description: "Shown on the transactions list." },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Name")).toBeVisible();
    await expect(canvas.getByText("Shown on the transactions list.")).toBeVisible();
  },
};

export const WithError: Story = {
  args: { label: "Name", error: "Enter a name" },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter a name");
  },
};

export const LongLabelAndError: Story = {
  tags: ["!test"],
  args: {
    label: "Name shown to every member of the plan on the transactions list and the overview",
    description: "Keep it short: long names wrap on mobile.",
    error: "A category with this name already exists in this plan, choose another name",
  },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { label: "Name", disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Name")).toBeDisabled();
  },
};
