import { FC, useMemo } from 'react';

import './sidebarWidget.scss';

import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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
  onNavigate,
  onToggle,
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
    { id: 'users', label: 'Users', icon: <FiUser /> },
    { id: 'posts', label: 'Posts', icon: <FiSettings /> },
  ];

  const baseOptions = options && options.length > 0 ? options : defaultOptions;

  const mergedOptions = useMemo(() => [...baseOptions, switchOption], [baseOptions, switchOption]);
  const headerTitle = title ?? 'Navigation';
  const headerIcon = titleIcon ?? <FiMenu />;

  const handleOptionClick = (opt: SidebarOption) => {
    if (opt.id === switchId) return;
    if (onNavigate) {
      onNavigate(opt.id);
    } else {
      try {
        navigate(`/${opt.id}`);
      } catch (err) {
        console.error('Navigation error', err);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className={`w-sidebar-widget ${className}`.trim()}>
      <Sidebar
        options={mergedOptions}
        title={headerTitle}
        titleIcon={headerIcon}
        onOptionClick={handleOptionClick}
        onToggle={onToggle}
      />
    </div>
  );
};
