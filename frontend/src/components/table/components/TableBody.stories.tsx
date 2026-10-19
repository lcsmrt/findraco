import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { expect } from "storybook/test";
import { TableBase } from "../base/TableParts";
import { TableRoot } from "../Table";
import { TableBody } from "./TableBody";

type Expense = { id: number; description: string; amount: string };

const columns: ColumnDef<Expense>[] = [
  { accessorKey: "description", header: "Description" },
  { accessorKey: "amount", header: "Amount" },
];

const expenses: Expense[] = [
  { id: 1, description: "Groceries", amount: "R$ 320,00" },
  { id: 2, description: "Electricity bill", amount: "R$ 189,90" },
];

type DemoProps = {
  data: Expense[];
  isLoading?: boolean;
  emptyState?: string;
  expandable?: boolean;
};

function DemoTableBody({ data, isLoading, emptyState, expandable }: DemoProps) {
  return (
    <TableRoot
      data={data}
      columns={columns}
      tableId="demo-table-body"
      getRowCanExpand={expandable ? (row) => row.original.id === 1 : undefined}
    >
      {(table) => (
        <TableBase className="w-96">
          <TableBody
            table={table}
            isLoading={isLoading}
            emptyState={emptyState}
            renderSubComponent={(row) => `Split into 3 items: ${row.original.description}`}
          />
        </TableBase>
      )}
    </TableRoot>
  );
}

const meta = {
  title: "Table/TableBody",
  component: DemoTableBody,
  args: { data: expenses },
} satisfies Meta<typeof DemoTableBody>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = {};

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("row")).toHaveLength(5);
  },
};

export const Empty: Story = {
  args: { data: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No results.")).toBeVisible();
  },
};

export const CustomEmptyState: Story = { args: { data: [], emptyState: "Nothing spent yet" } };

// Only expandable rows react to a click; one row open at a time.
export const Expandable: Story = {
  args: { expandable: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Groceries"));
    await expect(canvas.getByText("Split into 3 items: Groceries")).toBeVisible();
    await userEvent.click(canvas.getByText("Groceries"));
    await expect(canvas.queryByText("Split into 3 items: Groceries")).toBeNull();
  },
};

export const ManyLongRows: Story = {
  args: {
    data: Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      description: "Annual maintenance contract for the building's elevators and generators",
      amount: "R$ 987.654,32",
    })),
  },
};
