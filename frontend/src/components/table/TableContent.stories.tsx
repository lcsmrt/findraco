import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { expect } from "storybook/test";
import type { Sorting } from "./components/TableHeader";
import { TableRoot } from "./Table";
import { TableContent } from "./TableContent";

type Expense = { id: number; description: string; category: string; amount: string };

const columns: ColumnDef<Expense>[] = [
  { accessorKey: "description", header: "Description", enableSorting: true },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "amount", header: "Amount", enableSorting: true },
];

const expenses: Expense[] = [
  { id: 1, description: "Groceries", category: "Food", amount: "R$ 320,00" },
  { id: 2, description: "Electricity bill", category: "Housing", amount: "R$ 189,90" },
  { id: 3, description: "Bus pass", category: "Transport", amount: "R$ 150,00" },
];

type DemoProps = {
  data: Expense[];
  isLoading?: boolean;
  emptyState?: string;
  expandable?: boolean;
};

// Sorting is server-side, so the story only holds the chosen sort like a screen's URL state does.
function DemoTableContent({ data, isLoading, emptyState, expandable }: DemoProps) {
  const [sorting, setSorting] = useState<Sorting[]>([]);
  return (
    <TableRoot
      data={data}
      columns={columns}
      tableId="demo-table-content"
      getRowCanExpand={expandable ? () => true : undefined}
    >
      {(table) => (
        <TableContent
          table={table}
          sorting={sorting}
          onSortChange={setSorting}
          isLoading={isLoading}
          emptyState={emptyState}
          renderSubComponent={(row) => `Details of ${row.original.description}`}
        />
      )}
    </TableRoot>
  );
}

const meta = {
  title: "Table/TableContent",
  component: DemoTableContent,
  args: { data: expenses },
} satisfies Meta<typeof DemoTableContent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = {
  play: async ({ canvas, userEvent }) => {
    const header = canvas.getByRole("button", { name: "Description" });
    await userEvent.click(header);
    await expect(header.querySelector(".lucide-chevron-up")).not.toBeNull();
  },
};

export const Loading: Story = { args: { isLoading: true } };

export const Empty: Story = { args: { data: [], emptyState: "No transactions this month" } };

export const Expandable: Story = {
  args: { expandable: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Groceries"));
    await expect(canvas.getByText("Details of Groceries")).toBeVisible();
  },
};

export const ManyLongRows: Story = {
  args: {
    data: Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      description: "Annual maintenance contract for the building's elevators and generators",
      category: "Housing and maintenance",
      amount: "R$ 987.654,32",
    })),
  },
};

export const Mobile: Story = { globals: { viewport: { value: "mobile1" } } };
