import type { ReactNode } from 'react';
import type { BaseProps } from '../shared/types';

export interface TabItem {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends BaseProps {
  /** List of tabs to render. Each item must have a unique `key` */
  tabs: TabItem[];

  /** Controlled active key */
  activeKey?: string;

  /** Uncontrolled initial active key */
  defaultActiveKey?: string;

  /** Called when user selects a tab */
  onChange?: (key: string) => void;
}
