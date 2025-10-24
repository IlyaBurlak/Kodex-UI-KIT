import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ],
    placeholder: 'Choose an option',
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    options: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ],
    disabled: true,
  },
};
