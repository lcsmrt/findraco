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
  onEdit: () => void;
};

// AttributionFields needs a live form that owns the participants list, as the drawer does.
function DemoForm({ attributionMode, splitMode, participants, members, onEdit }: DemoFormProps) {
  const { control } = useForm<TransactionFormValues, unknown, TransactionFormOutput>({
    defaultValues: { ...buildDefaultValues(), amount: 100, attributionMode, splitMode, participants },
  });
  const participantsArray = useFieldArray({ control, name: "participants" });

  return (
    <form className="flex w-96 flex-col gap-4">
      <AttributionFields
        control={control}
        participants={participantsArray}
        onEdit={onEdit}
        members={members}
        currentUserId={ana.userId}
      />
    </form>
  );
}

function asParticipant(person: PlanMember, shareAmount: number | null = null) {
  return { memberId: person.userId, memberName: person.name, shareAmount };
}

const meta = {
  title: "Transactions/AttributionFields",
  component: DemoForm,
  args: {
    attributionMode: "ME",
    splitMode: "EQUAL",
    participants: [],
    members: [ana, bia],
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
  args: {
    attributionMode: "SPLIT",
    splitMode: "EXACT",
    participants: manyMembers.map((person) => asParticipant(person, 16.67)),
    members: manyMembers,
  },
};
