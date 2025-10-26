import type { Meta, StoryObj } from '@storybook/react';
import type { Column } from './Table.types';
import { Table } from './Table';

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

type Row = { id: number; name: string; age: number; address: string };

const columns: Column<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'age', title: 'Age', dataIndex: 'age', align: 'right' },
  { key: 'address', title: 'Address', dataIndex: 'address' },
];

const data = [
  { id: 1, name: 'John Doe', age: 32, address: '10 Downing St' },
  { id: 2, name: 'Jane Smith', age: 28, address: '221B Baker St' },
  { id: 3, name: 'Bob Johnson', age: 45, address: '742 Evergreen Terrace' },
];

export const Default: Story = {
  args: {
    columns: columns as unknown as Column<unknown>[],
    data,
    striped: true,
    bordered: true,
    hover: true,
  },
};
