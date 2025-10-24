import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Feedback/Loader',
  component: Loader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: 'small' },
};

export const Large: Story = {
  args: { size: 'large' },
};
