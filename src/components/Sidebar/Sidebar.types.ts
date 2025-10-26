import { ReactNode } from 'react';

export type SidebarOption = {
  id: string;
  label: string;
  icon?: ReactNode | string;
  disabled?: boolean;
  checked?: boolean;
};

export type SidebarProps = {
  title?: string;
  titleIcon?: ReactNode | string;
  options?: SidebarOption[];
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onOptionClick?: (option: SidebarOption) => void;
  className?: string;
};
