import type { ReactNode } from 'react';
import type { SidebarOption } from '../../components/Sidebar/Sidebar.types';
import type { SwitchProps } from '../../components/Switch/Switch.types';

export type SidebarWidgetProps = {
  title?: string;
  titleIcon?: ReactNode | string;
  options?: SidebarOption[];
  switchId?: string;
  switchLabel?: string;
  switchProps?: SwitchProps;
  className?: string;
  onNavigate?: (route: string) => void;
  onToggle?: (collapsed: boolean) => void;
};
