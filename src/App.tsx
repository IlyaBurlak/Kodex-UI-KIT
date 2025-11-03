import { FC, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { SidebarWidget } from './widgets/SidebarWidget/SidebarWidget';

import './styles/layout.scss';

import { PostPage } from './pages/PostPage/PostPage.tsx';
import { PostsPage } from './pages/PostsPage';
import { UsersPage } from './pages/UsersPage';

const MainLayout: FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'app-layout--sidebar-collapsed' : ''}`}>
      <div className='app-layout__sidebar'>
        <SidebarWidget onToggle={(v) => setSidebarCollapsed(Boolean(v))} />
      </div>
      <div className='app-layout__content'>
        <Outlet />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} path='/'>
          <Route element={<Navigate replace to='/users' />} index />
          <Route element={<UsersPage />} path='users' />
          <Route element={<PostsPage />} path='posts' />
          <Route element={<PostPage />} path='posts/:id' />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
