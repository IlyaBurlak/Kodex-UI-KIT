import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Option A',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked by default',
    defaultChecked: true,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary style',
    primary: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const Group: Story = {
  render: () => {
    const GroupDemo = () => {
      const [value, setValue] = useState<string>('a');

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Radio
            name="group-1"
            label="Option A"
            checked={value === 'a'}
            onChange={(c) => c && setValue('a')}
          />
          <Radio
            name="group-1"
            label="Option B"
            checked={value === 'b'}
            onChange={(c) => c && setValue('b')}
          />
          <Radio
            name="group-1"
            label="Option C"
            checked={value === 'c'}
            onChange={(c) => c && setValue('c')}
          />
        </div>
      );
    };

    return <GroupDemo />;
  },
};
