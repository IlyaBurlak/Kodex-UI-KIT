import { FC } from 'react';

import { Button } from '../../../components';
import { Comment } from '../../../store/CommentsSlice/commentsTypes.ts';

interface CommentItemProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onRemove: (comment: Comment) => void;
}

export const CommentItem: FC<CommentItemProps> = ({ comment, onEdit, onRemove }) => (
  <div className='post-comment'>
    <div className='post-comment__name'>{comment.name}</div>
    <div>{comment.body}</div>
    <div className='post-comment__actions'>
      <Button label='Edit' onClick={() => onEdit(comment)} />
      <Button label='Delete' variant='delete' onClick={() => onRemove(comment)} />
    </div>
  </div>
);
