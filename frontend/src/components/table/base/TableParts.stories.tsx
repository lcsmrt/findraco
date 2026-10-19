import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TableBase,
  TableBodyBase,
  TableCellBase,
  TableFooterBase,
  TableHeadBase,
  TableHeaderBase,
  TableRowBase,
} from "./TableParts";
import { formatMoney } from "@/utils/money";

type Row = { description: string; category: string; amount: string };

const rows: Row[] = [
  { description: "Groceries", category: "Food", amount: "R$ 320,00" },
  { description: "Electricity bill", category: "Housing", amount: "R$ 189,90" },
  { description: "Salary", category: "Income", amount: "R$ 5.000,00" },
];

type DemoTableProps = {
  rows: Row[];
  withFooter?: boolean;
  selectedIndex?: number;
};

function DemoTable({ rows, withFooter = false, selectedIndex }: DemoTableProps) {
  return (
    <TableBase className="w-full max-w-xl table-fixed">
      <TableHeaderBase>
        <TableRowBase>
          <TableHeadBase>Description</TableHeadBase>
          <TableHeadBase>Category</TableHeadBase>
          <TableHeadBase className="text-right">Amount</TableHeadBase>
        </TableRowBase>
      </TableHeaderBase>
      <TableBodyBase>
        {rows.length === 0 ? (
          <TableRowBase>
            <TableCellBase colSpan={3} className="text-muted-foreground text-center">
              No transactions
            </TableCellBase>
          </TableRowBase>
        ) : (
          rows.map((row, index) => (
            <TableRowBase
              key={`${row.description}-${index}`}
              data-state={index === selectedIndex ? "selected" : undefined}
            >
              <TableCellBase>{row.description}</TableCellBase>
              <TableCellBase>{row.category}</TableCellBase>
              <TableCellBase className="text-right">{row.amount}</TableCellBase>
            </TableRowBase>
          ))
        )}
      </TableBodyBase>
      {withFooter && (
        <TableFooterBase>
          <TableRowBase>
            <TableCellBase colSpan={2}>Total</TableCellBase>
            <TableCellBase className="text-right">R$ 5.509,90</TableCellBase>
          </TableRowBase>
        </TableFooterBase>
      )}
    </TableBase>
  );
}

const meta = {
  title: "Table/TableParts",
  component: DemoTable,
} satisfies Meta<typeof DemoTable>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Rows: Story = { args: { rows } };

export const WithFooter: Story = { args: { rows, withFooter: true } };

export const SelectedRow: Story = { args: { rows, selectedIndex: 1 } };

export const Empty: Story = { args: { rows: [] } };

// Cells truncate rather than wrap, so long text never changes a row's height.
export const LongContent: Story = {
  args: {
    rows: Array.from({ length: 25 }, (_, index) => ({
      description: "Annual maintenance contract for the building's elevators and generators",
      category: "Housing and maintenance",
      amount: formatMoney(987654.32 + index),
    })),
  },
};
