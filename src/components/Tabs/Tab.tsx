import { classNames } from '@/shared/classNames';
import { FC } from 'react';

import type { TabItem } from './Tabs.types';

type Props = {
  tab: TabItem;
  active?: boolean;
  onSelect: (key: string, disabled?: boolean) => void;
};

export const Tab: FC<Props> = ({ tab, active = false, onSelect }) => {
  const tabClass = classNames({
    'ui-tabs__tab': true,
    'ui-tabs__tab--active': !!active,
    'ui-tabs__tab--disabled': !!tab.disabled,
  });

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
