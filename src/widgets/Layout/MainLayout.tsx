import { SidebarWidget } from '@widgets/SidebarWidget';
import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';

import '@styles/layout.scss';

import { classNames } from '@/shared/classNames';

export const MainLayout: FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={classNames({
        'app-layout': true,
        'app-layout--sidebar-collapsed': !!sidebarCollapsed,
      })}
    >
      <div className='app-layout__sidebar'>
        <SidebarWidget onToggle={(nextCollapsed) => setSidebarCollapsed(Boolean(nextCollapsed))} />
      </div>
      <div className='app-layout__content'>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
