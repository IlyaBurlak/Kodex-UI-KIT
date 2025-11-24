import { UsersWidget } from '@widgets/UsersWidget/UsersWidget';

import './pages.scss';

import { FC } from 'react';

export type UsersPageProps = { onViewPosts?: (userId: number) => void };

export const UsersPage: FC<UsersPageProps> = ({ onViewPosts }) => {
  return (
    <div className='page-content'>
      <h2>Users</h2>
      <UsersWidget onViewPosts={onViewPosts} />
    </div>
  );
};
