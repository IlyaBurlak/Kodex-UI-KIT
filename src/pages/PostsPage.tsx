import { useLocation } from 'react-router-dom';

import { PostsAdminWidget } from '../widgets/PostsAdminWidget/PostsAdminWidget';

import './pages.scss';

import { FC } from 'react';

export type PostsPageProps = { userId?: number };

export const PostsPage: FC<PostsPageProps> = ({ userId: propUserId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qUser = params.get('userId');
  const userId = propUserId ?? (qUser ? Number(qUser) : undefined);

  return (
    <div className='page-content'>
      <h2>Posts {userId ? `(User ${userId})` : ''}</h2>
      <PostsAdminWidget initialAuthorId={userId} />
    </div>
  );
};
