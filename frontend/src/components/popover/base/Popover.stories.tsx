import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./Popover";
import { Button } from "@/components/button/base/Button";

const meta: Meta<typeof Popover> = {
  title: "Popover",
  component: Popover,
  tags: ["autodocs", "!test"],
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover Title</PopoverTitle>
          <PopoverDescription>A short description of the popover content.</PopoverDescription>
        </PopoverHeader>
        <p className="text-sm">Additional body content can go here.</p>
      </PopoverContent>
    </Popover>
  ),
};
