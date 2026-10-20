import type { FinancialTransaction } from "@/api/dtos/financialTransaction";
import type { PlanMember } from "@/api/dtos/plan";
import { TableBase, TableBodyBase, TableCellBase, TableRowBase } from "@/components/table/base/TableParts";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import {
  ActionsCell,
  DescriptionCell,
  EditableAmountCell,
  EditableCategoryCell,
  EditableDateCell,
  ParticipantsCell,
} from "./TransactionCells";

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
  { userId: 3, name: "Ana Lima", email: "ana@example.com", role: "VIEWER" },
];

const groceries: FinancialTransaction = {
  id: 1,
  type: "DEBIT",
  amount: 320,
  description: "Groceries",
  startDate: "2026-10-14",
  endDate: "2026-10-14",
  category: { id: 1, type: "DEBIT", description: "Food" },
  splitMode: "EQUAL",
  participants: [
    { id: 1, name: "Lucas Martins", shareAmount: 160 },
    { id: 2, name: "Livia Souza", shareAmount: 160 },
  ],
  items: [],
};

type DemoRowProps = {
  transaction: FinancialTransaction;
  canEditParticipants?: boolean;
  isDeleting?: boolean;
  onSave: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

// The cells live in table rows, so the story renders one row the way the transactions table does.
// The category picker that opens on a category click fetches the plan's categories; that state is
// the picker's own and is covered by the transactions flow tests.
function DemoRow({
  transaction,
  canEditParticipants,
  isDeleting,
  onSave,
  onEdit,
  onDuplicate,
  onDelete,
}: DemoRowProps) {
  return (
    <TableBase className="w-full max-w-4xl">
      <TableBodyBase>
        <TableRowBase>
          <TableCellBase>
            <DescriptionCell transaction={transaction} onSave={onSave} />
          </TableCellBase>
          <TableCellBase>
            <EditableCategoryCell transaction={transaction} onSave={onSave} />
          </TableCellBase>
          <TableCellBase>
            <EditableAmountCell transaction={transaction} onSave={onSave} />
          </TableCellBase>
          <TableCellBase>
            <EditableDateCell transaction={transaction} onSave={onSave} />
          </TableCellBase>
          <TableCellBase>
            <ParticipantsCell
              transaction={transaction}
              members={members}
              canEdit={canEditParticipants}
              onSave={onSave}
            />
          </TableCellBase>
          <TableCellBase>
            <ActionsCell
              transaction={transaction}
              isDeleting={isDeleting}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          </TableCellBase>
        </TableRowBase>
      </TableBodyBase>
    </TableBase>
  );
}

const meta = {
  title: "Transactions/TransactionCells",
  component: DemoRow,
  args: {
    transaction: groceries,
    onSave: fn(),
    onEdit: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof DemoRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Expense: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    await expect(args.onEdit).toHaveBeenCalledWith(groceries);
  },
};

export const Income: Story = {
  tags: ["!test"],
  args: {
    transaction: {
      ...groceries,
      type: "CREDIT",
      amount: 5000,
      description: "Salary",
      category: { id: 9, type: "CREDIT", description: "Income" },
      participants: [{ id: 1, name: "Lucas Martins", shareAmount: 5000 }],
    },
  },
};

export const Series: Story = { args: { transaction: { ...groceries, seriesId: "series-1" } } };

export const NoCategoryNoParticipants: Story = {
  args: { transaction: { ...groceries, category: undefined, participants: [] } },
};

export const Deleting: Story = {
  tags: ["!test"],
  args: { isDeleting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeDisabled();
  },
};

export const EditDescription: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Groceries"));
    const input = canvas.getByRole("textbox", { name: "Description" });
    await userEvent.clear(input);
    await userEvent.type(input, "Weekly market{Enter}");
    await expect(args.onSave).toHaveBeenCalledWith(groceries, { description: "Weekly market" });
  },
};

export const EditAmount: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText(/320,00/));
    await expect(canvas.getByRole("textbox", { name: "Amount" })).toHaveFocus();
  },
};

export const EditDate: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("14/10/2026"));
    const input = canvas.getByRole("textbox", { name: "Date" });
    await userEvent.clear(input);
    await userEvent.type(input, "15102026{Enter}");
    await expect(args.onSave).toHaveBeenCalledWith(groceries, { startDate: "2026-10-15" });
  },
};

// The participants popover renders in a portal, outside the story canvas, so queries go through `screen`.
export const EditParticipants: Story = {
  args: { canEditParticipants: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /2 people/ }));
    await expect(await screen.findByRole("dialog", { name: "Participants" })).toBeVisible();
    await expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  },
};

export const LongDescriptionLargeAmount: Story = {
  tags: ["!test"],
  args: {
    transaction: {
      ...groceries,
      description: "Annual maintenance contract for the building's elevators and generators",
      amount: 987654321.99,
      category: { id: 5, type: "DEBIT", description: "Household maintenance and repairs" },
      participants: [{ id: 3, name: "Maximiliano Albuquerque de Vasconcelos", shareAmount: 1 }],
    },
  },
};

// The row actions stay visible on touch screens, where there is no hover to reveal them.
export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
