import { MEMBER_PALETTE, NEUTRAL_MEMBER_COLOR } from "@/utils/memberColors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberDot } from "./MemberDot";

const meta = {
  title: "MemberDot",
  component: MemberDot,
  args: { color: MEMBER_PALETTE[0] },
} satisfies Meta<typeof MemberDot>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Member: Story = {};

// Someone who left the plan keeps their history in the neutral colour.
export const FormerMember: Story = { args: { color: NEUTRAL_MEMBER_COLOR } };

export const Palette: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {MEMBER_PALETTE.map((color) => (
        <MemberDot key={color} color={color} />
      ))}
    </div>
  ),
};

export const Larger: Story = { args: { className: "size-4" } };
