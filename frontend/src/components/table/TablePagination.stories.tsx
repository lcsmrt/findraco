import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { expect, fn, waitFor } from "storybook/test";
import { TablePagination } from "./TablePagination";

const meta = {
  title: "Table/TablePagination",
  component: TablePagination,
  args: {
    onPageChange: fn(),
    onPageSizeChange: fn(),
    isSticky: false,
    pagination: { number: 1, size: 10, totalElements: 42, totalPages: 5, first: false, last: false },
  },
} satisfies Meta<typeof TablePagination>;
export default meta;

type Story = StoryObj<typeof meta>;

export const MiddlePage: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("11 – 20 of 42")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
  },
};

// At 360 px the footer keeps previous and next inside the card; first and last step aside.
export const FitsPhone: Story = {
  render: (args) => (
    <div className="w-[328px]">
      <TablePagination {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await page.viewport(360, 800);
    const footer = canvasElement.querySelector<HTMLElement>(".border-t");
    if (!footer) throw new Error("no pagination footer");
    await waitFor(() => expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth));
    const box = footer.getBoundingClientRect();
    for (const name of ["Previous page", "Next page"]) {
      const button = canvas.getByRole("button", { name }).getBoundingClientRect();
      await expect(button.right).toBeLessThanOrEqual(box.right);
      await expect(button.left).toBeGreaterThanOrEqual(box.left);
    }
    await expect(canvas.queryByRole("button", { name: "Last page" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "First page" })).toBeNull();
    await page.viewport(1200, 900);
  },
};

export const FirstPage: Story = {
  tags: ["!test"],
  args: {
    pagination: { number: 0, size: 10, totalElements: 42, totalPages: 5, first: true, last: false },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
  },
};

export const LastPage: Story = {
  tags: ["!test"],
  args: {
    pagination: { number: 4, size: 10, totalElements: 42, totalPages: 5, first: false, last: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("41 – 42 of 42")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};

export const Empty: Story = {
  args: {
    pagination: { number: 0, size: 10, totalElements: 0, totalPages: 0, first: true, last: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("Page 1 of 1")).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Next page" })).toBeNull();
    await expect(canvas.queryByRole("combobox")).toBeNull();
  },
};

// Before the first response arrives there is no pagination at all, and so no pager.
export const Loading: Story = { tags: ["!test"], args: { pagination: undefined } };

export const WithoutPageSize: Story = { args: { onPageSizeChange: undefined } };

export const ManyPages: Story = {
  tags: ["!test"],
  args: {
    pagination: {
      number: 9876,
      size: 50,
      totalElements: 987654,
      totalPages: 19754,
      first: false,
      last: false,
    },
  },
};

// The range and the "Lines per page" label hide on small screens.
export const Mobile: Story = { tags: ["!test"], globals: { viewport: { value: "mobile1" } } };
