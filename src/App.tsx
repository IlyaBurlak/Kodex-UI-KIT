import MainLayout from '@widgets/Layout/MainLayout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { PostPage } from './pages/PostPage';
import { PostsPage } from './pages/PostsPage';
import { UsersPage } from './pages/UsersPage';

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
