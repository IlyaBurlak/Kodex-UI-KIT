import { FC, useEffect, useState } from 'react';

import './tabs.scss';

import { classNames } from '@shared/classNames';

import { Tab } from './Tab';
import { TabsProps } from './Tabs.types';

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

  const className = classNames('ui-tabs', `ui-tabs--${size}`, userClassName);

  const activeTab = tabs.find((tab) => tab.key === active);

  const handleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey === undefined) setInternalActive(key);
    onChange?.(key);
  };

  return (
    <div className={className} {...props}>
      <div className='ui-tabs__nav' role='tablist'>
        {tabs.map((tab) => (
          <Tab key={tab.key} active={tab.key === active} tab={tab} onSelect={handleSelect} />
        ))}
      </div>
      <div className='ui-tabs__panel' id={`panel-${activeTab?.key}`}>
        {activeTab?.content ?? null}
      </div>
    </div>
  );
};
