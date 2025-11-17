import { FC } from 'react';

import type { Post } from '../types.ts';
import { Button } from '../../../components';

export type TableActionsProps = {
  record: Post;
  onView: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

export const TableActions: FC<TableActionsProps> = ({ record, onView, onEdit, onDelete }) => (
  <div className='posts-actions'>
    <Button label='View' primary onClick={onView} />
    <Button label='Edit' onClick={() => onEdit(record)} />
    <Button label='Delete' variant='delete' onClick={() => onDelete(record)} />
  </div>
);
