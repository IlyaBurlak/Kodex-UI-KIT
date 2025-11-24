import { Button } from '@components/Button/Button';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    backdropClose: { control: 'boolean' },
    closeLabel: { control: 'text' },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example modal',
    size: 'medium',
    backdropClose: true,
    closeLabel: 'Close modal',
  },
  render: (args) => {
    const Demo = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button label='Open modal' onClick={() => setOpen(true)} />
          <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
            <div style={{ maxWidth: 600 }}>
              <p>This is a basic modal. Click outside or press ESC to close.</p>
              <Button label='Close' onClick={() => setOpen(false)} />
            </div>
          </Modal>
        </div>
      );
    };

    return <Demo />;
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    title: 'Small modal',
    size: 'small',
    children: <p>Small modal content</p>,
  },
};

export const Medium: Story = {
  args: {
    isOpen: true,
    title: 'Medium modal',
    size: 'medium',
    children: <p>Medium modal content</p>,
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: 'Large modal',
    size: 'large',
    children: <p>Large modal content</p>,
  },
};
