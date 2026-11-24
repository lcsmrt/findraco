import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Money } from "./Money";

const NBSP = " ";

const meta = {
  title: "Money/Money",
  component: Money,
} satisfies Meta<typeof Money>;
export default meta;

type Story = StoryObj<typeof meta>;

function figures(canvasElement: HTMLElement) {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>("span"));
}

export const Formats: Story = {
  args: { value: 0 },
  render: () => (
    <div>
      <Money value={1234.5} />
      <Money value={-1234.5} />
      <Money value={0} />
      <Money value={-0.004} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(figures(canvasElement).map((figure) => figure.textContent)).toEqual([
      `R$${NBSP}1.234,50`,
      `−R$${NBSP}1.234,50`,
      `R$${NBSP}0,00`,
      `R$${NBSP}0,00`,
    ]);
  },
};

export const Typeface: Story = {
  args: { value: 1234.5 },
  play: async ({ canvasElement }) => {
    const [figure] = figures(canvasElement);
    const { fontFamily, fontVariantNumeric } = getComputedStyle(figure);
    await expect(fontFamily.replace(/^["']/, "").startsWith("Space Grotesk")).toBe(true);
    await expect(fontFamily).not.toMatch(/mono/i);
    await expect(fontVariantNumeric).toContain("tabular-nums");
  },
};

export const Tones: Story = {
  args: { value: 0 },
  render: () => (
    <div>
      <Money value={10} tone="income" />
      <Money value={10} tone="expense" />
      <Money value={10} tone="bySign" />
      <Money value={0} tone="bySign" />
      <Money value={-0.004} tone="bySign" />
      <Money value={-10} tone="bySign" />
      <Money value={10} tone="default" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [income, expense, positive, zero, almostZero, negative, plain] = figures(canvasElement);
    await expect(income).toHaveClass("text-success");
    await expect(expense).toHaveClass("text-destructive");
    await expect(positive).toHaveClass("text-success");
    await expect(zero).toHaveClass("text-success");
    await expect(almostZero).toHaveClass("text-success");
    await expect(negative).toHaveClass("text-destructive");
    await expect(plain).not.toHaveClass("text-success");
    await expect(plain).not.toHaveClass("text-destructive");
  },
};

// Half a cent rounds to "−R$ 0,01", so the colour must say negative too.
export const HalfCentTone: Story = {
  args: { value: -0.005, tone: "bySign" },
  play: async ({ canvasElement }) => {
    const [figure] = figures(canvasElement);
    await expect(figure.textContent).toBe(`\u2212R$${NBSP}0,01`);
    await expect(figure).toHaveClass("text-destructive");
  },
};

export const LargeValue: Story = {
  args: { value: 9999999999999.99 },
  play: async ({ canvasElement }) => {
    const [figure] = figures(canvasElement);
    await expect(figure.textContent).toBe(`R$${NBSP}9.999.999.999.999,99`);
    await expect(getComputedStyle(figure).whiteSpace).toBe("nowrap");
  },
};
