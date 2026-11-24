import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor } from "storybook/test";
import { CurrencyInput } from "./CurrencyInput";

type CurrencyFieldProps = {
  initialValue: number | null;
  disabled?: boolean;
  error?: string;
};

// CurrencyInput is controlled, so the stories hold its value in local state like a filter does.
function CurrencyField({ initialValue, disabled, error }: CurrencyFieldProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <Field className="w-72" data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <CurrencyInput
        id="amount"
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        placeholder="R$ 0,00"
      />
      <FieldError errors={[error ? { message: error } : undefined]} />
    </Field>
  );
}

const meta = {
  title: "Input/CurrencyInput",
  component: CurrencyField,
} satisfies Meta<typeof CurrencyField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { initialValue: null },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Amount");
    await userEvent.type(input, "1234");
    await expect(input).toHaveValue("R$\u00a012,34");
  },
};

export const WithValue: Story = {
  args: { initialValue: 1250.5 },
};

export const LargeValue: Story = {
  tags: ["!test"],
  args: { initialValue: 9999999999999.99 },
};

export const Invalid: Story = {
  tags: ["!test"],
  args: { initialValue: null, error: "Enter an amount" },
};

export const Disabled: Story = {
  tags: ["!test"],
  args: { initialValue: 12.34, disabled: true },
};

// A field marked invalid keeps its red border; keyboard focus still draws the one solid ring.
export const InvalidFocusRing: Story = {
  args: { initialValue: null, error: "Enter an amount" },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Amount");
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(input).boxShadow).toContain("rgb(161, 74, 7) 0px 0px 0px 3px"));
    await expect(getComputedStyle(input).boxShadow).not.toContain("oklab");
  },
};

function luminance([red, green, blue]: number[]) {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: number[], background: number[]) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// The browser serialises computed colours as rgb() or, for mixed ones, oklab()/color(); painting
// one pixel on a canvas turns any of them into plain 8-bit channels.
function channels(color: string) {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("canvas unavailable");
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  return { rgb: [red, green, blue], alpha: alpha / 255 };
}

function blend(top: { rgb: number[]; alpha: number }, bottom: number[]) {
  return top.rgb.map((channel, index) => channel * top.alpha + bottom[index] * (1 - top.alpha));
}

// The dark `--input` is lighter so borders reach 3:1, which must not lighten the field fill under the placeholder.
export const DarkFieldContrast: Story = {
  args: { initialValue: null },
  play: async ({ canvas }) => {
    const root = document.documentElement;
    root.classList.add("dark");
    try {
      const input = canvas.getByLabelText("Amount");
      await waitFor(() => {
        const fill = channels(getComputedStyle(input).backgroundColor);
        const page = channels(getComputedStyle(document.body).backgroundColor);
        const placeholder = channels(getComputedStyle(input, "::placeholder").color);
        const background = blend(fill, blend(page, [0, 0, 0]));
        return expect(contrast(placeholder.rgb, background)).toBeGreaterThanOrEqual(4.5);
      });
    } finally {
      root.classList.remove("dark");
    }
  },
};
