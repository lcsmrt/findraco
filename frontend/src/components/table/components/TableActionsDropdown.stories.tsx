import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { expect, fn, screen, waitFor } from "storybook/test";
import { TableRoot } from "../Table";
import { TableActionsDropdown, type ColumnAction } from "./TableActionsDropdown";

type Expense = { id: number; description: string; paid: boolean };

const columns: ColumnDef<Expense>[] = [{ accessorKey: "description" }];

type DemoProps = {
  expense: Expense;
  actions: ColumnAction<Expense>[];
  subtle?: boolean;
};

// The dropdown acts on a TanStack row, so the story takes one from a one-row table.
function DemoActions({ expense, actions, subtle }: DemoProps) {
  return (
    <TableRoot data={[expense]} columns={columns} tableId="demo-actions">
      {(table) => (
        <TableActionsDropdown
          row={table.getRowModel().rows[0]}
          columnActions={actions}
          subtle={subtle}
        />
      )}
    </TableRoot>
  );
}

const edit = fn();

const actions: ColumnAction<Expense>[] = [
  { label: "Edit", onClick: edit, icon: <PencilIcon className="size-4" /> },
  {
    label: "Delete",
    onClick: fn(),
    icon: <Trash2Icon className="size-4" />,
    // Paid expenses cannot be deleted, so the action only shows for unpaid ones.
    conditionalRenderingFunctions: [(expense) => !expense.paid],
  },
];

const meta = {
  title: "Table/TableActionsDropdown",
  component: DemoActions,
  args: { expense: { id: 1, description: "Groceries", paid: false }, actions },
} satisfies Meta<typeof DemoActions>;
export default meta;

type Story = StoryObj<typeof meta>;

// The menu renders in a portal, outside the story canvas, so queries go through `screen`.
export const AllActions: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Row actions" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Edit" }));
    await expect(edit).toHaveBeenCalled();
    // Choosing an action closes the menu; the check runs once it has left.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const ConditionalActionHidden: Story = {
  args: { expense: { id: 2, description: "Rent", paid: true } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Row actions" }));
    await expect(await screen.findByRole("menuitem", { name: "Edit" })).toBeVisible();
    await expect(screen.queryByRole("menuitem", { name: "Delete" })).toBeNull();
  },
};

export const Subtle: Story = { tags: ["!test"], args: { subtle: true } };

export const LongLabels: Story = {
  tags: ["!test"],
  args: {
    actions: [
      { label: "Move every installment of this series to another category", onClick: fn() },
      { label: "Duplicate as a new recurring transaction", onClick: fn() },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Row actions" }));
    await expect(await screen.findAllByRole("menuitem")).toHaveLength(2);
  },
};
