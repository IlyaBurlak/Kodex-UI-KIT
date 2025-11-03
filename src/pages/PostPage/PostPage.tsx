import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { PostWidget } from '../../widgets/PostWidget/PostWidget';

import '../pages.scss';

export const PostPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  return (
    <div className='page-content'>
      <PostWidget postId={postId} />
    </div>
  );
};
