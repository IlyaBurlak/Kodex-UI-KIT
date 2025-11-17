import { FC, useEffect, useState } from 'react';

import { Button, Input, Loader, Modal } from '../../components';
import {
  selectComments,
  selectCommentsLoading,
  updateLocalComment,
} from '../../store/CommentsSlice/commentsSlice';
import { addComment, fetchComments, removeComment } from '../../store/CommentsSlice/commentsThunks';
import { Comment } from '../../store/CommentsSlice/commentsTypes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPostsLoading, selectSelectedPost } from '../../store/PostSlice/postsSlice';
import { fetchPost } from '../../store/PostSlice/postsThunks';
import { Post } from '../PostsAdminWidget/types';

import './postWidget.scss';

export type PostWidgetProps = { postId: number };

export const PostWidget: FC<PostWidgetProps> = ({ postId }) => {
  const dispatch = useAppDispatch();

  const post: Post | null = useAppSelector(selectSelectedPost);
  const postsLoading = useAppSelector(selectPostsLoading);
  const comments: Comment[] = useAppSelector(selectComments);
  const commentsLoading = useAppSelector(selectCommentsLoading);

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (!postId) return;
    if (!post || post.id !== postId) dispatch(fetchPost(postId));
    const hasCommentsForThisPost =
      comments && comments.length > 0 && comments.every((comment) => comment.postId === postId);
    if (!hasCommentsForThisPost) dispatch(fetchComments(postId));
  }, [dispatch, postId, post, comments]);

  const onAdd = async () => {
    if (!newComment) return;
    dispatch(
      addComment({
        postId,
        body: newComment,
        name: 'You',
        email: '',
      }),
    );
    setNewComment('');
  };

  const onSave = async (comment: Comment) => {
    dispatch(updateLocalComment({ id: comment.id, payload: comment }));
    setEditingComment(null);
  };

  const onRemove = async (comment: Comment) => {
    await dispatch(removeComment(comment.id));
  };

  if (postsLoading || commentsLoading || !post) return <Loader />;

  return (
    <div className='post-widget'>
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <section>
        <h3>Comments</h3>
        <div className='post-comments__controls'>
          <Input
            placeholder='New comment'
            value={newComment}
            onChange={(value) => setNewComment(value)}
          />
          <Button label='Add' primary onClick={onAdd} />
        </div>
        {comments.map((comment: Comment) => (
          <div key={comment.id} className='post-comment'>
            <div className='post-comment__name'>{comment.name}</div>
            <div>{comment.body}</div>
            <div className='post-comment__actions'>
              <Button label='Edit' onClick={() => setEditingComment(comment)} />
              <Button label='Delete' variant='delete' onClick={() => onRemove(comment)} />
            </div>
          </div>
        ))}
      </section>

      <Modal isOpen={!!editingComment} title='Edit comment' onClose={() => setEditingComment(null)}>
        {editingComment && (
          <div className='comment-editor'>
            <Input
              value={editingComment.body}
              onChange={(value) => setEditingComment({ ...editingComment, body: value })}
            />
            <div className='comment-editor__actions'>
              <Button label='Save' primary onClick={() => onSave(editingComment)} />
              <Button label='Cancel' onClick={() => setEditingComment(null)} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
