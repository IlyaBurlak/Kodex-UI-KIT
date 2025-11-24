import { SidebarWidget } from '@widgets/SidebarWidget';
import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';

import '@styles/layout.scss';

export const MainLayout: FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'app-layout--sidebar-collapsed' : ''}`}>
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
