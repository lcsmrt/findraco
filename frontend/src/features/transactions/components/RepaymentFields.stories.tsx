import type { Contact } from "@/api/dtos/contact";
import type { PlanMember } from "@/api/dtos/plan";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useFieldArray, useForm } from "react-hook-form";
import { expect, fn } from "storybook/test";
import { RepaymentFields } from "./RepaymentFields";
import { buildDefaultValues, type TransactionFormOutput, type TransactionFormValues } from "./transactionForm";

const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const livia: PlanMember = { userId: 2, name: "Livia", email: "livia@example.com", role: "EDITOR" };
const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 500, credit: 0, version: 0 };

const market = { participantId: 20, date: "2026-10-05", description: "Market", open: 200, checked: true, amount: 200 };
const dinner = { participantId: 21, date: "2026-11-10", description: "Dinner", open: 300, checked: true, amount: 100 };

type DemoFormProps = {
  amount: number;
  allocations: NonNullable<TransactionFormValues["allocations"]>;
  withContact?: boolean;
  canChooseReceiver?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry: () => void;
  onAllocationEdit: () => void;
};

// RepaymentFields needs a live form that owns both lists, as the drawer does.
function DemoForm({
  amount,
  allocations,
  withContact = true,
  canChooseReceiver = false,
  isLoading = false,
  isError = false,
  onRetry,
  onAllocationEdit,
}: DemoFormProps) {
  const { control, setValue } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: {
      ...buildDefaultValues(),
      type: "CREDIT",
      kind: "REPAYMENT",
      amount,
      repaymentContact: withContact ? { id: mae.id, name: mae.name } : null,
      allocations,
    },
  });
  const allocationsArray = useFieldArray({ control, name: "allocations" });
  const participantsArray = useFieldArray({ control, name: "participants" });

  return (
    <form className="flex w-full max-w-96 flex-col gap-4">
      <RepaymentFields
        control={control}
        setValue={setValue}
        allocations={allocationsArray}
        participants={participantsArray}
        contacts={[mae]}
        members={[lucas, livia]}
        currentUserId={lucas.userId}
        canChooseReceiver={canChooseReceiver}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        onAllocationEdit={onAllocationEdit}
      />
    </form>
  );
}

const meta = {
  title: "Transactions/RepaymentFields",
  component: DemoForm,
  args: { amount: 300, allocations: [market, dinner], onRetry: fn(), onAllocationEdit: fn() },
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Suggested: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("checkbox", { name: "Market" })).toBeChecked();
    await expect(canvas.getByLabelText("Amount for Dinner")).toHaveValue("R$\u00a0100,00");
    await expect(canvas.queryByText(/becomes credit/)).toBeNull();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Dinner" }));
    await expect(canvas.getByRole("checkbox", { name: "Dinner" })).not.toBeChecked();
    await expect(args.onAllocationEdit).toHaveBeenCalled();
  },
};

export const WithExcess: Story = {
  args: { amount: 700, allocations: [{ ...dinner, amount: 300 }, market] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("R$ 200,00 becomes credit")).toBeVisible();
  },
};

export const NothingOpen: Story = {
  args: { amount: 100, allocations: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Nothing is open for this contact/)).toBeVisible();
    await expect(canvas.getByText("R$ 100,00 becomes credit")).toBeVisible();
  },
};

export const NoContactYet: Story = {
  args: { withContact: false, allocations: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Select a contact")).toBeVisible();
    await expect(canvas.queryByText("Purchases it settles")).toBeNull();
  },
};

export const Loading: Story = {
  args: { allocations: [], isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading purchases" })).toBeVisible();
    await expect(canvas.queryByText(/Nothing is open/)).toBeNull();
  },
};

export const LoadFailed: Story = {
  args: { allocations: [], isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const ChoosingTheReceiver: Story = {
  args: { canChooseReceiver: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Received by")).toBeVisible();
    await expect(canvas.getByText("Lucas")).toBeVisible();
  },
};
