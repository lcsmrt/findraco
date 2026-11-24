import type { Transaction } from "@/api/dtos/transaction";
import type { PlanMember } from "@/api/dtos/plan";
import { TableBase, TableBodyBase, TableCellBase, TableRowBase } from "@/components/table/base/TableParts";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, within } from "storybook/test";
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

const groceries: Transaction = {
  id: 1,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "DEBIT",
  amount: 320,
  description: "Groceries",
  startDate: "2026-10-14",
  endDate: "2026-10-14",
  category: { id: 1, version: 0, type: "DEBIT", description: "Food" },
  splitMode: "EQUAL",
  participants: [
    { id: 1, name: "Lucas Martins", shareAmount: 160 },
    { id: 2, name: "Livia Souza", shareAmount: 160 },
  ],
  items: [],
  status: "ACTUAL", requiresConfirmation: false,
};

type DemoRowProps = {
  transaction: Transaction;
  canEditParticipants?: boolean;
  isDeleting?: boolean;
  onSave: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onConfirm?: () => void;
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
  onConfirm,
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
              onConfirm={onConfirm}
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
      category: { id: 9, version: 0, type: "CREDIT", description: "Income" },
      participants: [{ id: 1, name: "Lucas Martins", shareAmount: 5000 }],
    },
  },
};

export const Series: Story = { args: { transaction: { ...groceries, seriesId: "series-1" } } };

// What the page paints for the card token; a badge tinted differently stands out from the surface.
function cardBackground() {
  const probe = document.createElement("div");
  probe.style.backgroundColor = "var(--card)";
  document.body.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

// The computed colour a theme token resolves to, read the way a rendered element would.
function tokenColor(token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function badgeOf(element: HTMLElement) {
  const badge = element.closest<HTMLElement>("[data-variant]");
  if (!badge) throw new Error("the label is not inside a badge");
  return badge;
}

export const ForecastBadge: Story = {
  args: { transaction: { ...groceries, status: "FORECAST", requiresConfirmation: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Forecast")).toBeVisible();
    await expect(canvas.queryByText("Pending")).toBeNull();
    const badge = badgeOf(canvas.getByText("Forecast"));
    await expect(badge).toHaveAttribute("data-variant", "status");
    await expect(badge).toHaveAttribute("data-tone", "neutral");
    await expect(badge.querySelector("svg")).not.toBeNull();
    await expect(getComputedStyle(badge).borderTopWidth).toBe("0px");
    await expect(getComputedStyle(badge).backgroundColor).not.toBe(cardBackground());
  },
};

export const PendingBadge: Story = {
  args: { transaction: { ...groceries, status: "PENDING", requiresConfirmation: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Pending")).toBeVisible();
    await expect(canvas.queryByText("Forecast")).toBeNull();
    const badge = badgeOf(canvas.getByText("Pending"));
    await expect(badge).toHaveAttribute("data-variant", "status");
    await expect(badge).toHaveAttribute("data-tone", "warning");
    await expect(badge.querySelector("svg")).not.toBeNull();
  },
};

// A status badge is told by its icon and its colour, so each is read from the rendered svg and text.
export const StatusColoursAndIcons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <DemoRow
        {...args}
        transaction={{ ...groceries, id: 2, description: "Electricity", status: "FORECAST", requiresConfirmation: true }}
      />
      <DemoRow
        {...args}
        transaction={{ ...groceries, id: 3, description: "Water", status: "PENDING", requiresConfirmation: true }}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const forecast = badgeOf(canvas.getByText("Forecast"));
    await expect(forecast.querySelector("svg")).toHaveClass("lucide-clock");

    const pending = badgeOf(canvas.getByText("Pending"));
    await expect(pending.querySelector("svg")).toHaveClass("lucide-triangle-alert");
    await expect(getComputedStyle(pending).color).toBe(tokenColor("--warning"));
    await expect(getComputedStyle(pending).color).not.toBe(getComputedStyle(forecast).color);
  },
};

// The category is the one tag: outlined, with no icon, so it never reads as a status.
export const CategoryTag: Story = {
  play: async ({ canvas }) => {
    const badge = badgeOf(canvas.getByText("Food"));
    await expect(badge).toHaveAttribute("data-variant", "tag");
    await expect(badge.querySelector("svg")).toBeNull();
  },
};

const everyBadge: Transaction = {
  ...groceries,
  status: "FORECAST",
  requiresConfirmation: true,
  kind: "TRANSFER",
  seriesId: "series-1",
  items: [1, 2, 3].map((id) => ({ id, description: `Item ${id}`, amount: 10, quantity: 1 })),
};

// The description cell and the phone list share one badge row; this is its table half.
export const BadgeRow: Story = {
  args: { transaction: everyBadge },
  play: async ({ canvas }) => {
    const labels = ["Forecast", "Between members", "Series", "3 items"];
    const positions = labels.map((label) => canvas.getByText(label).getBoundingClientRect().left);
    await expect(positions).toEqual([...positions].sort((a, b) => a - b));
  },
};

// Series, kind and participants are quiet facts about the row, never a state or a category.
export const MetaBadges: Story = {
  args: { transaction: everyBadge },
  play: async ({ canvas }) => {
    for (const label of ["Series", "Between members", "2 people"]) {
      await expect(badgeOf(canvas.getByText(label))).toHaveAttribute("data-variant", "meta");
    }
  },
};

// One row per status, so a badge on the wrong row fails the story as surely as a missing one.
export const StatusBadges: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <DemoRow
        {...args}
        transaction={{ ...groceries, id: 2, description: "Electricity", status: "FORECAST", requiresConfirmation: true }}
      />
      <DemoRow
        {...args}
        transaction={{ ...groceries, id: 3, description: "Water", status: "PENDING", requiresConfirmation: true }}
      />
      <DemoRow {...args} transaction={groceries} />
    </div>
  ),
  play: async ({ canvas }) => {
    const [forecast, pending, actual] = canvas.getAllByRole("row").map((row) => within(row));
    await expect(forecast.getByText("Electricity")).toBeVisible();
    await expect(forecast.getByText("Forecast")).toBeVisible();
    await expect(forecast.queryByText("Pending")).toBeNull();
    await expect(pending.getByText("Water")).toBeVisible();
    await expect(pending.getByText("Pending")).toBeVisible();
    await expect(pending.queryByText("Forecast")).toBeNull();
    await expect(actual.getByText("Groceries")).toBeVisible();
    await expect(actual.queryByText("Forecast")).toBeNull();
    await expect(actual.queryByText("Pending")).toBeNull();
  },
};

const KINDS = [
  { kind: "TRANSFER", label: "Between members" },
  { kind: "CARD_BILL_PAYMENT", label: "Card bill" },
  { kind: "SAVINGS", label: "Savings" },
  { kind: "REFUND", label: "Refund" },
] as const;

// One row per kind: a badge on the wrong row fails the story as surely as a missing one. A neutral
// row has no category to pick and no one to attribute to, so its cells are not editable.
export const MovementKinds: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      {KINDS.map(({ kind }, index) => (
        <DemoRow
          key={kind}
          {...args}
          canEditParticipants
          transaction={{ ...groceries, id: index + 10, description: `Row ${index}`, kind }}
        />
      ))}
      <DemoRow {...args} canEditParticipants transaction={groceries} />
    </div>
  ),
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole("row").map((row) => within(row));
    for (const [index, { label }] of KINDS.entries()) {
      await expect(rows[index].getByText(label)).toBeVisible();
      for (const other of KINDS.filter((candidate) => candidate.label !== label)) {
        await expect(rows[index].queryByText(other.label)).toBeNull();
      }
    }
    await expect(rows[KINDS.length].queryByText("Refund")).toBeNull();
    // Attribution is editable on a normal row and not on a neutral one.
    await expect(rows[KINDS.length].getByRole("button", { name: /2 people/ })).toBeVisible();
    await expect(rows[0].queryByRole("button", { name: /2 people/ })).toBeNull();
  },
};

export const Confirmable: Story = {
  args: {
    transaction: { ...groceries, status: "PENDING", requiresConfirmation: true },
    onConfirm: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};

export const Actual: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Forecast")).toBeNull();
    await expect(canvas.queryByText("Pending")).toBeNull();
  },
};

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

export const EditAmountTypeface: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText(/320,00/));
    const { fontFamily, fontVariantNumeric } = getComputedStyle(
      canvas.getByRole("textbox", { name: "Amount" }),
    );
    await expect(fontFamily.replace(/^["']/, "").startsWith("Space Grotesk")).toBe(true);
    await expect(fontVariantNumeric).toContain("tabular-nums");
  },
};

// A debit shows its minus and red, a credit no sign and green, in the app typeface.
export const MoneyAmounts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <DemoRow {...args} transaction={{ ...groceries, id: 20, amount: 1234.5 }} />
      <DemoRow
        {...args}
        transaction={{ ...groceries, id: 21, type: "CREDIT", amount: 1234.5, description: "Salary" }}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("\u2212R$ 1.234,50")).toHaveClass("text-destructive");
    await expect(canvas.getByText("R$ 1.234,50")).toHaveClass("text-success");
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

// Another member's row seen by a contributor: the server allows neither edit nor delete.
export const ReadOnly: Story = {
  args: {
    transaction: { ...groceries, permissions: { edit: false, delete: false } },
    canEditParticipants: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.queryByRole("button", { name: "Edit" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Delete" })).toBeNull();
    await userEvent.click(canvas.getByText("Groceries"));
    await expect(canvas.queryByRole("textbox", { name: "Description" })).toBeNull();
    await expect(args.onSave).not.toHaveBeenCalled();
  },
};

export const LongDescriptionLargeAmount: Story = {
  tags: ["!test"],
  args: {
    transaction: {
      ...groceries,
      description: "Annual maintenance contract for the building's elevators and generators",
      amount: 987654321.99,
      category: { id: 5, version: 0, type: "DEBIT", description: "Household maintenance and repairs" },
      participants: [{ id: 3, name: "Maximiliano Albuquerque de Vasconcelos", shareAmount: 1 }],
    },
  },
};

// The row actions stay visible on touch screens, where there is no hover to reveal them.
export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
