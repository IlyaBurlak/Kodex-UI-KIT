import { Button } from '@components';
import { FC } from 'react';

import type { Post } from '@widgets/PostsAdminWidget/types';

export type TableActionsProps = {
  record: Post;
  onView: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

export const TableActions: FC<TableActionsProps> = ({ record, onView, onEdit, onDelete }) => (
  <div className='posts-actions'>
    <Button primary onClick={onView}>
      View
    </Button>
    <Button onClick={() => onEdit(record)}>Edit</Button>
    <Button variant='delete' onClick={() => onDelete(record)}>
      Delete
    </Button>
  </div>
);
