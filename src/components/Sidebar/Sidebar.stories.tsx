import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'The App',
    titleIcon: '📱',
    options: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'search', label: 'Search', icon: '🎬' },
      { id: 'insights', label: 'Insights', icon: '💠' },
      { id: 'docs', label: 'Docs', icon: '📚' },
      { id: 'products', label: 'Products', icon: '🛍️', checked: true },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'messages', label: 'Messages', icon: '✉️' },
      { id: 'account', label: 'Account', icon: '👤' },
    ],
  },
};

export const CollapsedByDefault: Story = {
  args: {
    title: 'The App',
    titleIcon: '📱',
    defaultCollapsed: true,
    options: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'products', label: 'Products', icon: '🛍️', checked: true },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
  },
};
