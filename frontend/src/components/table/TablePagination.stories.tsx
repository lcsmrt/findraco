import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
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
    await expect(canvas.getByText("Page 1 of 1")).toBeVisible();
  },
};

// Before the first response arrives there is no pagination at all.
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
