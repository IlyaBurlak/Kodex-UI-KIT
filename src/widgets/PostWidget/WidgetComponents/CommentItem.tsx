import { Button } from '@components';
import { Comment } from '@store/CommentsSlice/commentsTypes';
import { FC } from 'react';

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
      <Button onClick={() => onEdit(comment)}>Edit</Button>
      <Button variant='delete' onClick={() => onRemove(comment)}>
        Delete
      </Button>
    </div>
  </div>
);
