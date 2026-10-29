import type { Category, Plan, PlanMember } from "@/api/dtos";
import type { PagedResponse } from "@/api/dtos/paged";
import { ALL_CATEGORIES_PAGE_SIZE } from "@/api/services/useCategoryService";
import { PlanContext, type PlanContextValue } from "@/app/providers/usePlanContext";
import { Button } from "@/components/button/base/Button";
import { Text } from "@/components/typography/base/Text";
import { useCategoryFormSheet } from "@/hooks/useCategoryFormSheet";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { expect, screen, waitFor } from "storybook/test";
import { CategoryFormSheetProvider } from "./CategoryFormSheetProvider";

const PLAN_ID = 1;
const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
const planValue: PlanContextValue = {
  activePlanId: PLAN_ID,
  setActivePlanId: () => {},
  activePlan: plan,
  plans: [plan],
  isLoading: false,
};

const members: PlanMember[] = [
  { userId: 1, name: "Lucas Martins", email: "lucas@example.com", role: "OWNER" },
  { userId: 2, name: "Livia Souza", email: "livia@example.com", role: "EDITOR" },
];

const food: Category = {
  id: 7,
  type: "DEBIT",
  description: "Food",
  parentId: null,
  spendingLimit: 2000,
};

const categoriesPage: PagedResponse<Category> = {
  content: [food],
  page: 0,
  size: ALL_CATEGORIES_PAGE_SIZE,
  totalElements: 1,
  totalPages: 1,
  last: true,
};

// The sheet the provider opens reads the plan's categories and members. Stories have no network,
// so the cache starts with both under the keys the sheet asks for and never goes stale.
function seededClient() {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  client.setQueryData(
    ["categories", PLAN_ID, { size: ALL_CATEGORIES_PAGE_SIZE }],
    categoriesPage,
  );
  client.setQueryData(["members", PLAN_ID], members);
  return client;
}

type AskButtonsProps = { editing: Category };

// A screen opens the sheet through `useCategoryFormSheet`; the answer shows below.
function AskButtons({ editing }: AskButtonsProps) {
  const { openCreate, openEdit } = useCategoryFormSheet();
  const [answer, setAnswer] = useState("No answer yet");

  async function show(result: Promise<Category | null>) {
    const saved = await result;
    setAnswer(saved ? `Saved ${saved.description}` : "Closed without saving");
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => show(openCreate({ description: "Pets" }))}>New category</Button>
      <Button onClick={() => show(openEdit(editing))}>Edit category</Button>
      <Text>{answer}</Text>
    </div>
  );
}

function DemoProvider() {
  const [client] = useState(seededClient);
  return (
    <QueryClientProvider client={client}>
      <PlanContext.Provider value={planValue}>
        <CategoryFormSheetProvider>
          <AskButtons editing={food} />
        </CategoryFormSheetProvider>
      </PlanContext.Provider>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Categories/CategoryFormSheetProvider",
  component: DemoProvider,
} satisfies Meta<typeof DemoProvider>;
export default meta;

type Story = StoryObj<typeof meta>;

// The sheet renders in a portal, outside the story canvas, so queries go through `screen`.
export const Create: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "New category" }));
    const sheet = await screen.findByRole("dialog", { name: "New Category" });
    // The sheet slides in, so it is visible once its entry animation ends.
    await waitFor(() => expect(sheet).toBeVisible());
    await expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Pets");
  },
};

export const Edit: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit category" }));
    const sheet = await screen.findByRole("dialog", { name: "Edit Category" });
    await waitFor(() => expect(sheet).toBeVisible());
    await expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Food");
  },
};

// Closing resolves the caller's promise with no category.
export const Close: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "New category" }));
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(canvas.getByText("Closed without saving")).toBeVisible());
  },
};

export const Mobile: Story = {
  tags: ["!test"],
  ...Create,
  globals: { viewport: { value: "mobile1" } },
};
