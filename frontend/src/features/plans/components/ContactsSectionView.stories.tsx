import type { Contact } from "@/api/dtos/contact";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { page } from "@vitest/browser/context";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { ContactsSectionView } from "./ContactsSectionView";

function contact(id: number, name: string, overrides: Partial<Contact> = {}): Contact {
  return { id, name, archived: false, owed: 0, credit: 0, version: 0, ...overrides };
}

const owing = contact(1, "Ana", { owed: 50 });
const withCredit = contact(2, "Bia", { credit: 20 });
const settled = contact(3, "Caio");
const archived = contact(4, "Tio", { archived: true });

// The elements whose right edge sits past the page's width: something clipped or overflowing.
function pastTheViewport() {
  const limit = document.documentElement.clientWidth;
  return [...document.body.querySelectorAll<HTMLElement>("*")]
    .filter((element) => element.getBoundingClientRect().right > limit + 0.5)
    .map((element) => `${element.tagName.toLowerCase()} ${element.textContent?.slice(0, 30) ?? ""}`);
}

const meta = {
  title: "Plans/ContactsSectionView",
  component: ContactsSectionView,
  args: {
    contacts: [owing, withCredit, settled],
    isLoading: false,
    isError: false,
    canManage: true,
    isBusy: false,
    notice: null,
    onCreate: fn(),
    onRetry: fn(),
    onRename: fn(),
    onArchive: fn(),
    onUnarchive: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ContactsSectionView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { contacts: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No contacts yet")).toBeVisible();
    await expect(canvas.getByText(/people outside the plan who share purchases/)).toBeVisible();
  },
};

export const WithBalances: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Contacts")).toBeVisible();
    // Each balance sits on its own contact's row.
    function rowOf(name: string) {
      return canvas.getByRole("link", { name: new RegExp(name) }).closest("li")!;
    }
    await expect(within(rowOf("Ana")).getByText("Owes R$ 50,00")).toBeVisible();
    await expect(within(rowOf("Bia")).getByText("Credit of R$ 20,00")).toBeVisible();
    await expect(within(rowOf("Caio")).getByText("Settled")).toBeVisible();
    await expect(canvas.getAllByText(/Owes R\$|Credit of R\$|Settled/)).toHaveLength(3);
    // Each row opens that contact's statement.
    await expect(canvas.getByRole("link", { name: /Ana/ })).toHaveAttribute("href", "/plans/contacts/1");
    await userEvent.click(canvas.getByRole("button", { name: "New contact" }));
    await expect(args.onCreate).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Bia" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Rename" }));
    await expect(args.onRename).toHaveBeenCalledWith(withCredit);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const WithArchived: Story = {
  args: { contacts: [owing, archived] },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("heading", { name: "Archived" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Tio" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Unarchive" }));
    await expect(args.onUnarchive).toHaveBeenCalledWith(archived);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  },
};

export const ReadOnly: Story = {
  args: { canManage: false, contacts: [owing, archived] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ana")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "New contact" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: /Actions for/ })).toBeNull();
  },
};

export const Loading: Story = {
  args: { contacts: [], isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText("No contacts yet")).toBeNull();
  },
};

export const LoadFailed: Story = {
  args: { contacts: [], isError: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Could not load the contacts.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const FitsPhone: Story = {
  args: {
    contacts: [
      contact(1, "Maria Fernanda da Silva Albuquerque Mendes de Souza Lima", { owed: 1234567.89 }),
      withCredit,
      archived,
    ],
  },
  play: async () => {
    await page.viewport(390, 844);
    await waitFor(() => expect(pastTheViewport()).toEqual([]));
  },
};
