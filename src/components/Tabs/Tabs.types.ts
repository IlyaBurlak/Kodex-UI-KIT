import type { BaseProps } from '@components/shared/types';
import type { ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends BaseProps {
  tabs: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}
