import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { ToggleVariantProps } from "@/components/toggle/base/toggleVariants";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

type PeriodToggleProps = ToggleVariantProps & {
  disabled?: boolean;
};

const PERIODS = [
  ["day", "Day"],
  ["week", "Week"],
  ["month", "Month"],
] as const;

function PeriodToggle({ tone, variant, size, disabled }: PeriodToggleProps) {
  return (
    <ToggleGroup
      aria-label="Period"
      defaultValue={["week"]}
      tone={tone}
      variant={variant}
      size={size}
      disabled={disabled}
      className="w-80"
    >
      {PERIODS.map(([value, label]) => (
        <ToggleGroupItem key={value} value={value} className="flex-1">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const meta = {
  tags: ["!test"],
  title: "Toggle/ToggleGroup",
  component: PeriodToggle,
} satisfies Meta<typeof PeriodToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: { variant: "outline" },
  play: async ({ canvas, userEvent }) => {
    const week = canvas.getByRole("button", { name: "Week" });
    await expect(week).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await userEvent.click(week);
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Month" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await expect(canvas.getByRole("button", { name: "Day" })).toHaveFocus();
  },
};

export const Primary: Story = {
  args: { variant: "outline", tone: "primary" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Month" }));
    await expect(canvas.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};

export const Destructive: Story = {
  args: { variant: "outline", tone: "destructive" },
};

export const Success: Story = {
  args: { variant: "outline", tone: "success" },
};

export const Chip: Story = {
  args: { variant: "chip" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Day" }));
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Week" })).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const Disabled: Story = {
  args: { variant: "outline", tone: "primary", disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Day" })).toBeDisabled();
  },
};
