import { FC, useState } from 'react';
import { FiCheck, FiChevronRight } from 'react-icons/fi';

import './sidebar.scss';

import type { SidebarOption, SidebarProps } from './Sidebar.types';

export const Sidebar: FC<SidebarProps> = ({
  title,
  titleIcon,
  options = [],
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onToggle,
  onOptionClick,
  className = '',
}) => {
  const isControlled = typeof collapsedProp === 'boolean';
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(defaultCollapsed);
  const collapsed: boolean = isControlled ? Boolean(collapsedProp) : internalCollapsed;

  const handleToggle = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onToggle?.(next);
  };

  const handleOptionClick = (option: SidebarOption) => {
    if (!option.disabled) {
      onOptionClick?.(option);
    }
  };

  const rootClass = `ui-sidebar ${collapsed ? 'ui-sidebar--collapsed' : ''} ${className}`.trim();

  return (
    <aside className={rootClass} data-collapsed={collapsed}>
      <div className='ui-sidebar__header'>
        <div className='ui-sidebar__brand'>
          <div className='ui-sidebar__title-icon'>{titleIcon}</div>
          <div aria-hidden={collapsed} className='ui-sidebar__title'>
            {title}
          </div>
        </div>
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className='ui-sidebar__toggle'
          type='button'
          onClick={handleToggle}
        >
          <FiChevronRight
            aria-hidden
            className={`ui-sidebar__toggle-icon ${collapsed ? 'rotated' : ''}`}
          />
        </button>
      </div>

      <nav className='ui-sidebar__body'>
        <ul className='ui-sidebar__options'>
          {options.map((opt) => (
            <li
              key={opt.id}
              className={`ui-sidebar__option ${opt.disabled ? 'disabled' : ''} ${opt.checked ? 'checked' : ''}`}
              title={opt.label}
              onClick={() => handleOptionClick(opt)}
            >
              <div className='ui-sidebar__option-icon'>
                {typeof opt.icon === 'string' ? (
                  <span>{opt.icon}</span>
                ) : (
                  (opt.icon ?? String(opt.label).charAt(0).toUpperCase())
                )}
              </div>
              <div className='ui-sidebar__option-label'>{opt.label}</div>
              {opt.checked && (
                <div className='ui-sidebar__option-check'>
                  <FiCheck aria-hidden className='ui-sidebar__check-icon' />
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
