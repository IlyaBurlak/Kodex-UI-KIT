import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const demoTabs = [
  { key: 'a', label: 'Tab A', content: <div>Content A</div> },
  { key: 'b', label: 'Tab B', content: <div>Content B</div> },
  { key: 'c', label: 'Disabled', content: <div>Disabled content</div>, disabled: true },
];

export const Default: Story = {
  args: {
    tabs: demoTabs,
  },
};

export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [active, setActive] = useState<string>('b');

      return <Tabs tabs={demoTabs} activeKey={active} onChange={(key) => setActive(key)} />;
    };

    return <ControlledDemo />;
  },
};
