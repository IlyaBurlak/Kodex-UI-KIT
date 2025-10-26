import { FC, useMemo } from 'react';

import './sidebarWidget.scss';

import { FiHome, FiMenu, FiSettings, FiUser } from 'react-icons/fi';

import type { SidebarOption } from '../../components/Sidebar';
import type { SidebarWidgetProps } from './SidebarWidget.types';
import { Sidebar, Switch, useTheme } from '../../components';

export const SidebarWidget: FC<SidebarWidgetProps> = ({
  title,
  titleIcon,
  options = [],
  switchId = 'sidebar-widget-switch',
  switchLabel = 'Dark Mode',
  switchProps,
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();

  const effectiveSwitchProps = switchProps ?? {
    checked: theme === 'dark',
    onChange: (checked: boolean) => toggleTheme(checked),
  };

  const switchOption: SidebarOption = useMemo(
    () => ({
      id: switchId,
      label: switchLabel,
      icon: <Switch {...effectiveSwitchProps} />,
      disabled: !!effectiveSwitchProps?.disabled,
    }),
    [switchId, switchLabel, effectiveSwitchProps, theme],
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
