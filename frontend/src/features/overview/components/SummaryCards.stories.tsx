import type { DashboardSummaryResponse } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SummaryCards } from "./SummaryCards";
import { summaryView } from "../utils/summaryView";

// Both layouts are in the DOM and CSS shows one per breakpoint, so checks target the visible copy.
function visibleText(canvas: { getAllByText: (text: string) => HTMLElement[] }, text: string) {
  return canvas.getAllByText(text).find((element) => element.checkVisibility());
}

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

function summary(people: DashboardSummaryResponse["personBreakdown"]): DashboardSummaryResponse {
  const totalIncome = people.reduce((sum, person) => sum + person.income, 0);
  const totalExpenses = people.reduce((sum, person) => sum + person.expense, 0);
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryBreakdown: [],
    monthlyTrend: [],
    personBreakdown: people,
  };
}

const couple = summary([
  { userId: 1, name: "Lucas Martins", income: 6200, expense: 2733.4, net: 3466.6 },
  { userId: 2, name: "Livia Souza", income: 4800, expense: 2414.1, net: 2385.9 },
]);

const meta = {
  title: "Overview/SummaryCards",
  component: SummaryCards,
  // The views come from the real builder, so each story shows what the Overview would render.
  args: { view: summaryView(couple, null, colorOf) },
} satisfies Meta<typeof SummaryCards>;
export default meta;

type Story = StoryObj<typeof meta>;

export const PlanTotals: Story = {
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "R$ 11.000,00")).toBeVisible();
    await expect(visibleText(canvas, "R$ 5.852,50")).toBeVisible();
  },
};

// With a member selected, the figures are theirs and the others' segments recede.
export const MemberSelected: Story = {
  tags: ["!test"],
  args: { view: summaryView(couple, 2, colorOf) },
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "R$ 4.800,00")).toHaveClass("text-success");
  },
};

export const NegativeBalance: Story = {
  tags: ["!test"],
  args: {
    view: summaryView(
      summary([{ userId: 1, name: "Lucas Martins", income: 2500, expense: 3200, net: -700 }]),
      null,
      colorOf,
    ),
  },
};

export const NoActivity: Story = {
  args: { view: summaryView(summary([]), null, colorOf) },
};

export const ManyMembersLargeValues: Story = {
  tags: ["!test"],
  args: {
    view: summaryView(
      summary(
        Array.from({ length: 6 }, (_, index) => ({
          userId: index + 1,
          name: `Maximiliano Albuquerque ${index + 1}`,
          income: 987654321.99 / (index + 1),
          expense: 123456789.01 / (index + 1),
          net: (987654321.99 - 123456789.01) / (index + 1),
        })),
      ),
      null,
      colorOf,
    ),
  },
};

// Below `sm` the three cards fold into one block with the balance on top.
export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
