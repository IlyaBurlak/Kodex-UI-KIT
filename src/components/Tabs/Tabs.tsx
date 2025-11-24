import { FC, useEffect, useState } from 'react';

import './tabs.scss';

import { TabsProps } from './Tabs.types.ts';

export const Tabs: FC<TabsProps> = ({
  tabs = [],
  activeKey,
  defaultActiveKey,
  onChange,
  className: userClassName,
  size = 'medium',
  ...props
}) => {
  const isControlled = activeKey !== undefined;

  const [internalActive, setInternalActive] = useState<string | undefined>(() => {
    if (isControlled) return activeKey;
    if (defaultActiveKey) return defaultActiveKey;
    return tabs[0]?.key;
  });

  useEffect(() => {
    if (activeKey !== undefined) setInternalActive(activeKey);
  }, [activeKey]);

  const active = activeKey ?? internalActive;

  const className = ['ui-tabs', `ui-tabs--${size}`, userClassName].filter(Boolean).join(' ');

  const activeTab = tabs.find((tab) => tab.key === active);

  const handleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey === undefined) setInternalActive(key);
    onChange?.(key);
  };

  return (
    <div className={className} {...props}>
      <div className='ui-tabs__nav' role='tablist'>
        {tabs.map((tab) => {
          const tabClass = [
            'ui-tabs__tab',
            tab.key === active && 'ui-tabs__tab--active',
            tab.disabled && 'ui-tabs__tab--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={tab.key}
              aria-controls={`panel-${tab.key}`}
              aria-selected={tab.key === active}
              className={tabClass}
              disabled={tab.disabled}
              role='tab'
              type='button'
              onClick={() => handleSelect(tab.key, tab.disabled)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className='ui-tabs__panel' id={`panel-${activeTab?.key}`}>
        {activeTab?.content ?? null}
      </div>
    </div>
  );
};
