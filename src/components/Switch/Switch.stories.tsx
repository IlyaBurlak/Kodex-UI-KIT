import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Enable feature',
  },
};

export const Checked: Story = {
  args: {
    label: 'On by default',
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small switch',
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};
