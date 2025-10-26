import { FC, useMemo } from 'react';

import './sidebarWidget.scss';

import { FiHome, FiMenu, FiSettings, FiUser } from 'react-icons/fi';

import type { SidebarOption } from '../../components/Sidebar/Sidebar.types';
import type { SidebarWidgetProps } from './SidebarWidget.types';
import { Sidebar, Switch } from '../../components';

export const SidebarWidget: FC<SidebarWidgetProps> = ({
  title,
  titleIcon,
  options = [],
  switchId = 'sidebar-widget-switch',
  switchLabel = 'Toggle',
  switchProps,
  className = '',
}) => {
  const switchOption: SidebarOption = useMemo(
    () => ({
      id: switchId,
      label: switchLabel,
      icon: <Switch {...switchProps} />,
      disabled: !!switchProps?.disabled,
    }),
    [switchId, switchLabel, switchProps],
  );

  const defaultOptions: SidebarOption[] = [
    { id: 'home', label: 'Home', icon: <FiHome /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const baseOptions = options && options.length > 0 ? options : defaultOptions;

  const mergedOptions = useMemo(() => [...baseOptions, switchOption], [baseOptions, switchOption]);
  const headerTitle = title ?? 'Navigation';
  const headerIcon = titleIcon ?? <FiMenu />;

  return (
    <div className={`w-sidebar-widget ${className}`.trim()}>
      <Sidebar options={mergedOptions} title={headerTitle} titleIcon={headerIcon} />
    </div>
  );
};
