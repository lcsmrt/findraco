import type { Contact } from "@/api/dtos/contact";
import type { PlanMember } from "@/api/dtos/plan";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useFieldArray, useForm } from "react-hook-form";
import { expect, fn } from "storybook/test";
import { AttributionFields } from "./AttributionFields";
import {
  buildDefaultValues,
  type TransactionFormOutput,
  type TransactionFormValues,
} from "./transactionForm";

function member(userId: number, name: string): PlanMember {
  return { userId, name, email: `${name.toLowerCase()}@example.com`, role: "EDITOR" };
}

const ana = member(1, "Ana");
const bia = member(2, "Bia");
const manyMembers = [
  ana,
  bia,
  member(3, "Caio"),
  member(4, "Daniela"),
  member(5, "Eduardo"),
  member(6, "Fernanda Albuquerque de Souza Lima"),
];

type DemoFormProps = Pick<TransactionFormValues, "attributionMode" | "splitMode" | "participants"> & {
  members: PlanMember[];
  contacts: Contact[];
  onEdit: () => void;
  type?: TransactionFormValues["type"];
};

// AttributionFields needs a live form that owns the participants list, as the drawer does.
function DemoForm({ attributionMode, splitMode, participants, members, contacts, onEdit, type = "DEBIT" }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), type, amount: 100, attributionMode, splitMode, participants },
  });
  const participantsArray = useFieldArray({ control, name: "participants" });

  return (
    <form className="flex w-full max-w-96 flex-col gap-4">
      <AttributionFields
        control={control}
        participants={participantsArray}
        onEdit={onEdit}
        members={members}
        contacts={contacts}
        currentUserId={ana.userId}
      />
    </form>
  );
}

// A centred label wider than its button spills over both borders, and `scrollWidth` does not see a
// spill to the left, so compare the label's own width with the space inside the padding.
function labelFits(button: HTMLElement) {
  const label = document.createRange();
  label.selectNodeContents(button);
  const { paddingLeft, paddingRight } = getComputedStyle(button);
  const room = button.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
  return label.getBoundingClientRect().width <= room;
}

function asParticipant(person: PlanMember, shareAmount: number | null = null) {
  return { memberId: person.userId, memberName: person.name, shareAmount };
}

function contact(id: number, name: string, archived = false): Contact {
  return { id, name, archived, owed: 0, credit: 0, version: 0 };
}

const mae = contact(7, "Mãe");

const meta = {
  title: "Transactions/AttributionFields",
  component: DemoForm,
  args: {
    attributionMode: "ME",
    splitMode: "EQUAL",
    participants: [],
    members: [ana, bia],
    contacts: [],
    onEdit: fn(),
  },
} satisfies Meta<typeof DemoForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SinglePayer: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("button", { name: "Me" })).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.queryByText("Participants")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Someone else" }));
    await expect(canvas.getByLabelText("Person")).toBeVisible();
    await expect(args.onEdit).toHaveBeenCalled();
  },
};

export const SomeoneElse: Story = {
  args: { attributionMode: "SOMEONE", participants: [asParticipant(bia)] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Someone else" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByLabelText("Person")).toBeVisible();
    await expect(canvas.getByText("Bia")).toBeVisible();
  },
};

export const Split: Story = {
  args: { attributionMode: "SPLIT", participants: [asParticipant(ana), asParticipant(bia)] },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("checkbox", { name: "Bia" })).toBeChecked();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Bia" }));
    await expect(canvas.getByRole("checkbox", { name: "Bia" })).not.toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Exact" }));
    await expect(canvas.getByLabelText("Ana's share")).toBeVisible();
    await expect(canvas.queryByLabelText("Bia's share")).toBeNull();
  },
};

// The contacts come after the members, in the equal and the exact split alike.
export const SplitWithContact: Story = {
  args: { attributionMode: "SPLIT", participants: [asParticipant(ana)], contacts: [mae] },
  play: async ({ canvas, userEvent }) => {
    const names = canvas.getAllByRole("checkbox").map((box) => box.getAttribute("aria-label"));
    await expect(names).toEqual(["Ana", "Bia", "Mãe"]);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Mãe" }));
    await expect(canvas.getByRole("checkbox", { name: "Mãe" })).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Exact" }));
    await expect(canvas.getByLabelText("Mãe's share")).toBeVisible();
  },
};

// An income cannot be shared with a contact, so none is offered on one.
export const NoContactOnAnIncome: Story = {
  args: { attributionMode: "SPLIT", participants: [asParticipant(ana)], contacts: [mae], type: "CREDIT" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Bia" })).toBeVisible();
    await expect(canvas.queryByRole("checkbox", { name: "Mãe" })).toBeNull();
  },
};

// A contact archived after the row was saved still shows on it, so its share can be changed or removed.
export const ArchivedContactOnTheRow: Story = {
  args: {
    attributionMode: "SPLIT",
    participants: [asParticipant(ana), { contactId: 8, memberName: "Tio", shareAmount: null }],
    contacts: [mae],
  },
  play: async ({ canvas, userEvent }) => {
    const archived = canvas.getByRole("checkbox", { name: "Tio (archived)" });
    await expect(archived).toBeChecked();
    await userEvent.click(archived);
    await expect(canvas.queryByRole("checkbox", { name: /Tio/ })).toBeNull();
  },
};

const formerAna = member(9, "Ana Lima");

// Ana Lima left the plan but is still on the row, so she is not among `members`.
export const FormerParticipant: Story = {
  args: {
    attributionMode: "SPLIT",
    splitMode: "EXACT",
    participants: [asParticipant(ana, 40), asParticipant(formerAna, 60)],
  },
  play: async ({ canvas, userEvent }) => {
    const former = canvas.getByRole("checkbox", { name: "Ana Lima (no longer in the plan)" });
    await expect(former).toBeChecked();
    await expect(canvas.getByLabelText("Ana Lima's share")).toHaveValue("R$ 60,00");
    await userEvent.click(former);
    await expect(canvas.queryByRole("checkbox", { name: /Ana Lima/ })).toBeNull();
    await expect(canvas.queryByLabelText("Ana Lima's share")).toBeNull();
  },
};

export const FormerPerson: Story = {
  args: { attributionMode: "SOMEONE", participants: [asParticipant(formerAna)] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ana Lima (no longer in the plan)")).toBeVisible();
  },
};

export const SplitExactShares: Story = {
  args: {
    attributionMode: "SPLIT",
    splitMode: "EXACT",
    participants: [asParticipant(ana, 30.25), asParticipant(bia, 69.75)],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Bia's share")).toHaveValue("R$ 69,75");
  },
};

export const ManyMembers: Story = {
  tags: ["!test"],
  args: {
    attributionMode: "SPLIT",
    splitMode: "EXACT",
    participants: manyMembers.map((person) => asParticipant(person, 16.67)),
    members: manyMembers,
  },
};

export const MobileSomeoneElse: Story = {
  tags: ["!test"],
  args: { attributionMode: "SOMEONE", participants: [asParticipant(bia)] },
  globals: { viewport: { value: "mobile1" } },
  // The drawer's content on a 320 px phone: the screen minus its 16 px side padding.
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    for (const name of ["Me", "Someone else", "Split"]) {
      await expect(labelFits(canvas.getByRole("button", { name })), name).toBe(true);
    }
  },
};
