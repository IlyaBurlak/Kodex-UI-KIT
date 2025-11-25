import type { BaseProps } from '@/shared/types';
import type { ReactNode } from 'react';

export interface Column<T = Record<string, unknown>> {
  key?: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

export interface TableProps<T = Record<string, unknown>> extends BaseProps {
  columns: Column<T>[];
  data?: T[];
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index?: number) => void;
  emptyText?: ReactNode;
}
