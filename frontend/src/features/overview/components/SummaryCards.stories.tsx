import type { DashboardSummaryResponse } from "@/api/dtos";
import { MEMBER_PALETTE } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SummaryCards } from "./SummaryCards";
import { summaryView } from "../utils/summaryView";

// Both layouts are in the DOM and CSS shows one per breakpoint, so checks target the visible copy.
function visibleText(canvas: { getAllByText: (text: string) => HTMLElement[] }, text: string) {
  return canvas.getAllByText(text).find((element) => element.checkVisibility());
}

function colorOf(memberId: number) {
  return MEMBER_PALETTE[(memberId - 1) % MEMBER_PALETTE.length];
}

type Person = Omit<
  DashboardSummaryResponse["personBreakdown"][number],
  "actualIncome" | "actualExpense" | "actualNet"
>;

/** A summary whose actual figures equal the totals: nothing is ahead. */
function summary(people: Person[]): DashboardSummaryResponse {
  const totalIncome = people.reduce((sum, person) => sum + person.income, 0);
  const totalExpenses = people.reduce((sum, person) => sum + person.expense, 0);
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    actualIncome: totalIncome,
    actualExpenses: totalExpenses,
    actualBalance: totalIncome - totalExpenses,
    neutralOut: 0,
    neutralIn: 0,
    personBreakdown: people.map((person) => ({
      ...person,
      actualIncome: person.income,
      actualExpense: person.expense,
      actualNet: person.net,
    })),
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

// Part of the month's expenses is still ahead: R$ 800,00 happened of the R$ 5.147,50 forecast.
const actualByPerson: Record<number, { actualExpense: number; actualNet: number }> = {
  1: { actualExpense: 500, actualNet: 5700 },
  2: { actualExpense: 300, actualNet: 4500 },
};
const withForecast: DashboardSummaryResponse = {
  ...couple,
  actualIncome: 11000,
  actualExpenses: 800,
  actualBalance: 10200,
  // The members' actual amounts add up to the headline, as the API reports them.
  personBreakdown: couple.personBreakdown.map((person) => ({ ...person, ...actualByPerson[person.userId] })),
};

// A period with no neutral movements shows no line for them.
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "Net")).toBeVisible();
    await expect(canvas.queryByText("Neutral")).toBeNull();
    await expect(canvas.queryByText(/^out /)).toBeNull();
  },
};

// A card bill and Pix between the members moved money that is in no figure above.
const withNeutral: DashboardSummaryResponse = { ...couple, neutralOut: 2000, neutralIn: 500 };

export const WithNeutralMovements: Story = {
  args: { view: summaryView(withNeutral, null, colorOf) },
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "Neutral")).toBeVisible();
    await expect(visibleText(canvas, "out R$ 2.000,00 · in R$ 500,00")).toBeVisible();
    // The result is untouched by them.
    await expect(visibleText(canvas, "R$ 5.852,50")).toBeVisible();
  },
};

export const WithForecast: Story = {
  args: { view: summaryView(withForecast, null, colorOf) },
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "Net")).toBeVisible();
    await expect(visibleText(canvas, "R$ 800,00")).toBeVisible();
    await expect(visibleText(canvas, "R$ 10.200,00")).toBeVisible();
    // The headline is the actual figure, named on its own line, apart from the forecast line.
    await expect(visibleText(canvas, "Actual")).toBeVisible();
    await expect(visibleText(canvas, "Forecast R$ 5.147,50")).toBeVisible();
    await expect(visibleText(canvas, "Forecast R$ 5.852,50")).toBeVisible();
  },
};

// Nothing is ahead, so the forecast equals the actual figures.
// Below `sm` the phone card is the first card in the DOM and the three wide cards follow it.
function cards(canvasElement: HTMLElement) {
  const [phone, ...wide] = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="card"]'));
  return { phone: within(phone), wide: wide.map((card) => within(card)) };
}

function fontSize(element: HTMLElement) {
  return parseFloat(getComputedStyle(element).fontSize);
}

export const FigureSizes: Story = {
  play: async ({ canvasElement }) => {
    const { phone } = cards(canvasElement);
    await expect(fontSize(phone.getByText("R$ 11.000,00"))).toBe(20);
    await expect(fontSize(phone.getByText("R$ 5.147,50"))).toBe(20);
    await expect(fontSize(phone.getByText("R$ 5.852,50"))).toBe(24);
  },
};

// Both layouts are in the DOM, so each text is found twice: once per layout.
export const ReadableFigures: Story = {
  args: { view: summaryView({ ...withForecast, neutralOut: 2000, neutralIn: 500 }, null, colorOf) },
  play: async ({ canvas }) => {
    const figures = [
      canvas.getAllByText("R$ 500,00"), // a member's expense
      canvas.getAllByText("R$ 300,00"),
      canvas.getAllByText("R$ 6.200,00"), // a member's income
      canvas.getAllByText("R$ 4.800,00"),
      canvas.getAllByText("Forecast R$ 5.147,50"), // the forecast line
      canvas.getAllByText("Forecast R$ 11.000,00"),
      canvas.getAllByText("Forecast R$ 5.852,50"),
      canvas.getAllByText("out R$ 2.000,00 · in R$ 500,00"), // the neutral line
    ];
    for (const matches of figures) {
      await expect(matches).toHaveLength(2);
      for (const figure of matches) await expect(fontSize(figure)).toBeGreaterThanOrEqual(14);
    }
  },
};

export const NoForecast: Story = {
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "R$ 5.852,50")).toBeVisible();
    await expect(visibleText(canvas, "Forecast R$ 5.852,50")).toBeVisible();
  },
};

export const PlanTotals: Story = {
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "R$ 11.000,00")).toBeVisible();
    await expect(visibleText(canvas, "R$ 5.852,50")).toBeVisible();
  },
};

// With a member selected, the figures are theirs, actual and forecast, and the others' segments recede.
// Livia has R$ 414,10 of her R$ 2.414,10 expenses still ahead.
const liviaAhead: DashboardSummaryResponse = {
  ...couple,
  personBreakdown: couple.personBreakdown.map((person) =>
    person.userId === 2 ? { ...person, actualExpense: 2000, actualNet: 2800 } : person,
  ),
};

export const MemberSelected: Story = {
  args: { view: summaryView(liviaAhead, 2, colorOf) },
  play: async ({ canvas }) => {
    await expect(visibleText(canvas, "R$ 4.800,00")).toHaveClass("text-success");
    await expect(visibleText(canvas, "R$ 2.000,00")).toBeVisible();
    await expect(visibleText(canvas, "Forecast R$ 2.414,10")).toBeVisible();
    await expect(visibleText(canvas, "R$ 2.800,00")).toBeVisible();
    await expect(visibleText(canvas, "Forecast R$ 2.385,90")).toBeVisible();
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
