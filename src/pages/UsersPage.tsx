import { UsersWidget } from '../widgets/UsersWidget/UsersWidget';

import './pages.scss';

import { FC } from 'react';

export const UsersPage: FC<{ onViewPosts?: (userId: number) => void }> = ({ onViewPosts }) => {
  return (
    <div className='page-content'>
      <h2>Users</h2>
      <UsersWidget onViewPosts={onViewPosts} />
    </div>
  );
};
