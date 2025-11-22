import type { ReactNode } from 'react';
import type { SwitchProps } from '../../components';
import type { SidebarOption } from '../../components/Sidebar';

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
