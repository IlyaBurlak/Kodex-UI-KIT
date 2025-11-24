import { FC } from 'react';

import type { TabItem } from './Tabs.types';

type Props = {
  tab: TabItem;
  active?: boolean;
  onSelect: (key: string, disabled?: boolean) => void;
};

export const Tab: FC<Props> = ({ tab, active = false, onSelect }) => {
  const tabClass = [
    'ui-tabs__tab',
    tab.key === (active ? tab.key : undefined) && 'ui-tabs__tab--active',
    tab.disabled && 'ui-tabs__tab--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      aria-controls={`panel-${tab.key}`}
      aria-selected={!!active}
      className={tabClass}
      disabled={tab.disabled}
      role='tab'
      type='button'
      onClick={() => onSelect(tab.key, tab.disabled)}
    >
      {tab.label}
    </button>
  );
};