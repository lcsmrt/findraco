import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { expect } from "storybook/test";
import { CategoryLimitFields } from "./CategoryLimitFields";
import type { CategoryFormOutput, CategoryFormValues, MemberLimitRow } from "./categoryForm";

function row(memberId: number, memberName: string, amount: number | null, active = true): MemberLimitRow {
  return { memberId, memberName, amount, active };
}

type DemoFormProps = Pick<CategoryFormValues, "spendingLimit" | "limitMode" | "memberLimits"> & {
  perMemberDisabledReason?: string;
};

// CategoryLimitFields needs a live form, so each story renders it inside a small test form.
function DemoForm({ spendingLimit, limitMode, memberLimits, perMemberDisabledReason }: DemoFormProps) {
  const { control } = useForm<CategoryFormValues, unknown, CategoryFormOutput>({
    defaultValues: {
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit,
      limitMode,
      memberLimits,
    },
  });

  return (
    <form className="flex w-96 flex-col gap-4">
      <CategoryLimitFields control={control} perMemberDisabledReason={perMemberDisabledReason} />
    </form>
  );
}

const meta = {
  title: "Categories/CategoryLimitFields",
  component: DemoForm,
  args: {
    spendingLimit: null,
    limitMode: "single",
    memberLimits: [row(1, "Ana", null), row(2, "Bia", null)],
  },
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const NoLimit: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Single" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByLabelText("Amount (optional)")).toHaveValue("");
  },
};

export const SharedLimit: Story = {
  args: { spendingLimit: 1200 },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Amount (optional)")).toHaveValue("R$ 1.200,00");
  },
};

export const PerMemberLimits: Story = {
  args: {
    limitMode: "perMember",
    memberLimits: [row(1, "Ana", 300), row(2, "Bia", 100), row(3, "Caio", null), row(4, "Duda", 50, false)],
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("75%")).toBeVisible();
    await expect(canvas.getByText("25%")).toBeVisible();
    await expect(canvas.getByLabelText("Limit for Duda")).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Remove Duda's limit" }));
    await expect(canvas.queryByLabelText("Limit for Duda")).toBeNull();
  },
};

export const PerMemberNotAllowed: Story = {
  args: {
    limitMode: "perMember",
    perMemberDisabledReason: "A category that belongs to one member has a single limit.",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Per member" })).toBeDisabled();
    await expect(canvas.getByLabelText("Amount (optional)")).toBeVisible();
  },
};

export const ManyMembers: Story = {
  args: {
    limitMode: "perMember",
    memberLimits: [
      row(1, "Ana", 1250.5),
      row(2, "Bia", 980),
      row(3, "Caio", 99999.99),
      row(4, "Daniela", null),
      row(5, "Fernanda Albuquerque de Souza Lima", 10),
      row(6, "Gustavo", 0),
    ],
  },
};
