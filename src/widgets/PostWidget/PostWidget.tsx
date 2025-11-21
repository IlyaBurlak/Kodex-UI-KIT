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
import {
  selectPostsError,
  selectPostsLoading,
  selectSelectedPost,
} from '../../store/PostSlice/postsSlice';
import { fetchPost } from '../../store/PostSlice/postsThunks';
import { Post } from '../PostsAdminWidget/types';

import './postWidget.scss';

import type { RootState } from '../../store';
import { ErrorDisplay } from '../ErrorWidget/ErrorDisplay.tsx';

export type PostWidgetProps = { postId: number };

const selectCommentsError = (state: RootState) => state.comments?.error || null;

export const PostWidget: FC<PostWidgetProps> = ({ postId }) => {
  const dispatch = useAppDispatch();

  const post: Post | null = useAppSelector(selectSelectedPost);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsError = useAppSelector(selectPostsError);
  const comments: Comment[] = useAppSelector(selectComments);
  const commentsLoading = useAppSelector(selectCommentsLoading);
  const commentsError = useAppSelector(selectCommentsError);

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (!postId) return;
    if (!post || post.id !== postId) dispatch(fetchPost(postId));
    const hasCommentsForThisPost =
      comments && comments.length > 0 && comments.every((comment) => comment.postId === postId);
    if (!hasCommentsForThisPost) dispatch(fetchComments(postId));
  }, [dispatch, postId, post, comments]);

  const handleRetry = () => {
    dispatch(fetchPost(postId));
    dispatch(fetchComments(postId));
  };

  const onAdd = async () => {
    if (!newComment.trim()) return;
    dispatch(
      addComment({
        postId,
        body: newComment.trim(),
        name: 'You',
        email: '',
      }),
    );
    setNewComment('');
  };

  const onSave = async (comment: Comment) => {
    if (!comment.body.trim()) return;
    dispatch(
      updateLocalComment({ id: comment.id, payload: { ...comment, body: comment.body.trim() } }),
    );
    setEditingComment(null);
  };

  const onRemove = async (comment: Comment) => {
    await dispatch(removeComment(comment.id));
  };

  const handleNewCommentChange = (value: string) => {
    setNewComment(value);
  };

  const handleEditingCommentChange = (value: string) => {
    if (editingComment) {
      setEditingComment({ ...editingComment, body: value });
    }
  };

  if ((postsLoading && !post) || (commentsLoading && comments.length === 0)) {
    return <Loader />;
  }

  if (postsError || commentsError) {
    return (
      <ErrorDisplay
        className='post-widget-error'
        message={postsError || commentsError}
        title='Произошла ошибка'
        onRetry={handleRetry}
      />
    );
  }

  if (!post) {
    return (
      <ErrorDisplay
        className='post-widget-error'
        message='Возможно, этот пост был удален или еще не синхронизирован с сервером.'
        retryButtonLabel='Вернуться назад'
        title='Пост не найден'
        onRetry={() => window.history.back()}
      />
    );
  }

  return (
    <div className='post-widget'>
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <section>
        <h3>Comments</h3>
        <div className='post-comments__controls'>
          <Input placeholder='New comment' value={newComment} onChange={handleNewCommentChange} />
          <Button disabled={!newComment.trim()} label='Add' primary onClick={onAdd} />
        </div>

        {commentsLoading && comments.length === 0 ? (
          <Loader />
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment.id} className='post-comment'>
              <div className='post-comment__name'>{comment.name}</div>
              <div>{comment.body}</div>
              <div className='post-comment__actions'>
                <Button label='Edit' onClick={() => setEditingComment(comment)} />
                <Button label='Delete' variant='delete' onClick={() => onRemove(comment)} />
              </div>
            </div>
          ))
        )}
      </section>

      <Modal isOpen={!!editingComment} title='Edit comment' onClose={() => setEditingComment(null)}>
        {editingComment && (
          <div className='comment-editor'>
            <Input value={editingComment.body} onChange={handleEditingCommentChange} />
            <div className='comment-editor__actions'>
              <Button
                disabled={!editingComment.body.trim()}
                label='Save'
                primary
                onClick={() => onSave(editingComment)}
              />
              <Button label='Cancel' onClick={() => setEditingComment(null)} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
