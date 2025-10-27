import {
  FiBook,
  FiHome,
  FiMail,
  FiMenu,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';

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
    titleIcon: <FiMenu />,
    options: [
      { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
      { id: 'search', label: 'Search', icon: <FiSearch /> },
      { id: 'insights', label: 'Insights', icon: <FiTrendingUp /> },
      { id: 'docs', label: 'Docs', icon: <FiBook /> },
      { id: 'products', label: 'Products', icon: <FiShoppingBag />, checked: true },
      { id: 'settings', label: 'Settings', icon: <FiSettings /> },
      { id: 'messages', label: 'Messages', icon: <FiMail /> },
      { id: 'account', label: 'Account', icon: <FiUser /> },
    ],
  },
};

export const CollapsedByDefault: Story = {
  args: {
    title: 'The App',
    titleIcon: <FiMenu />,
    defaultCollapsed: true,
    options: [
      { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
      { id: 'products', label: 'Products', icon: <FiShoppingBag />, checked: true },
      { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    ],
  },
};
