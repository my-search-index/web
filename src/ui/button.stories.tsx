import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Search",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Search className="size-4" />
        Search
      </>
    ),
  },
};
