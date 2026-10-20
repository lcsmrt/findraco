import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { memberColor } from "@/utils/memberColors";
import type { MemberOption } from "../useOverviewMemberFilter";
import { MemberFilterChips } from "./MemberFilterChips";

type MemberFilterProps = {
  members: MemberOption[];
  initialSelectedId: number | null;
};

// The filter is controlled, so the stories hold the selection like the Overview's URL state does.
function MemberFilter({ members, initialSelectedId }: MemberFilterProps) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const refs = members.map((member) => ({ userId: member.id }));

  return (
    <MemberFilterChips
      members={members}
      selectedId={selectedId}
      onChange={(member) => setSelectedId(member?.id ?? null)}
      colorOf={(userId) => memberColor(refs, userId)}
    />
  );
}

const threeMembers: MemberOption[] = [
  { id: 1, name: "Lucas Martins" },
  { id: 2, name: "Livia Souza" },
  { id: 3, name: "Ana Lima" },
];

const meta = {
  title: "Overview/MemberFilterChips",
  component: MemberFilter,
} satisfies Meta<typeof MemberFilter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const NoneSelected: Story = {
  args: { members: threeMembers, initialSelectedId: null },
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole("button", { name: "All" });
    await expect(all).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(canvas.getByRole("button", { name: "Livia" }));
    await expect(canvas.getByRole("button", { name: "Livia" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(all).toHaveAttribute("aria-pressed", "false");

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Ana" })).toHaveFocus();
  },
};

export const OneSelected: Story = {
  args: { members: threeMembers, initialSelectedId: 2 },
  play: async ({ canvas, userEvent }) => {
    const livia = canvas.getByRole("button", { name: "Livia" });
    await userEvent.click(livia);
    await expect(livia).toHaveAttribute("aria-pressed", "true");
  },
};

export const ManyMembers: Story = {
  args: {
    members: [
      ...threeMembers,
      { id: 4, name: "Bruno Costa" },
      { id: 5, name: "Carla Dias" },
      { id: 6, name: "Diego Rocha" },
    ],
    initialSelectedId: null,
  },
};

export const LongNames: Story = {
  tags: ["!test"],
  args: {
    members: [
      { id: 1, name: "Maximiliano Bartholomeu de Albuquerque" },
      { id: 2, name: "Anastácia Valentina Florença" },
      { id: 3, name: "Bartholomeu Cristóvão" },
      { id: 4, name: "Wenceslau Teodoro" },
    ],
    initialSelectedId: 1,
  },
  globals: { viewport: { value: "mobile1" } },
};
