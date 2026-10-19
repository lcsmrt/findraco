import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { expect, fn } from "storybook/test";
import { TableBase } from "../base/TableParts";
import { TableRoot } from "../Table";
import { TableHeader, type Sorting } from "./TableHeader";

type Expense = { description: string; category: string; amount: number };

const columns: ColumnDef<Expense>[] = [
  { accessorKey: "description", header: "Description", enableSorting: true },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "amount", header: "Amount", enableSorting: true },
];

type DemoProps = {
  sorting?: Sorting[];
  onSortChange?: (sorting: Sorting[]) => void;
  headers?: ColumnDef<Expense>[];
};

function DemoTableHeader({ sorting, onSortChange, headers = columns }: DemoProps) {
  return (
    <TableRoot data={[]} columns={headers} tableId="demo-table-header">
      {(table) => (
        <TableBase className="w-[32rem] table-fixed">
          <TableHeader table={table} sorting={sorting} onSortChange={onSortChange} />
        </TableBase>
      )}
    </TableRoot>
  );
}

const meta = {
  title: "Table/TableHeader",
  component: DemoTableHeader,
  args: { onSortChange: fn() },
} satisfies Meta<typeof DemoTableHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unsorted: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Amount" }));
    await expect(args.onSortChange).toHaveBeenCalledWith([{ by: "amount", direction: "asc" }]);
  },
};

export const Ascending: Story = {
  args: { sorting: [{ by: "description", direction: "asc" }] },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Description" }));
    await expect(args.onSortChange).toHaveBeenCalledWith([
      { by: "description", direction: "desc" },
    ]);
  },
};

export const Descending: Story = {
  args: { sorting: [{ by: "description", direction: "desc" }] },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Description" }));
    await expect(args.onSortChange).toHaveBeenCalledWith([]);
  },
};

// Headers truncate rather than wrap, so the header row keeps its height.
export const LongHeaders: Story = {
  args: {
    headers: [
      { accessorKey: "description", header: "Description shown on every installment", enableSorting: true },
      { accessorKey: "category", header: "Category or subcategory of the expense" },
      { accessorKey: "amount", header: "Amount in Brazilian reais", enableSorting: true },
    ],
  },
};
