import { Button, Input, Loader, Modal } from '@components';
import {
  selectComments,
  selectCommentsLoading,
  updateLocalComment,
} from '@store/CommentsSlice/commentsSlice';
import { addComment, fetchComments, removeComment } from '@store/CommentsSlice/commentsThunks';
import { Comment } from '@store/CommentsSlice/commentsTypes';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  selectPostsError,
  selectPostsLoading,
  selectSelectedPost,
} from '@store/PostSlice/postsSlice';
import { fetchPost } from '@store/PostSlice/postsThunks';
import { ErrorDisplay } from '@widgets/ErrorWidget/ErrorDisplay';
import { FC, useEffect, useState } from 'react';

import './postWidget.scss';

import type { RootState } from '@store';
import { CommentForm } from './WidgetComponents/CommentForm';
import { CommentItem } from './WidgetComponents/CommentItem';

export type PostWidgetProps = { postId: number };

const selectCommentsError = (state: RootState) => state.comments?.error || null;

export const PostWidget: FC<PostWidgetProps> = ({ postId }) => {
  const dispatch = useAppDispatch();

  const post = useAppSelector(selectSelectedPost);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsError = useAppSelector(selectPostsError);
  const comments = useAppSelector(selectComments);
  const postComments = comments.filter((commentItem: Comment) => commentItem.postId === postId);
  const commentsLoading = useAppSelector(selectCommentsLoading);
  const commentsError = useAppSelector(selectCommentsError);

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (!postId) return;
    if (!post || post.id !== postId) dispatch(fetchPost(postId));
    const hasCommentsForThisPost =
      comments && comments.some((comment) => comment.postId === postId);
    if (!hasCommentsForThisPost) dispatch(fetchComments(postId));
  }, [dispatch, postId, post, comments]);

  const handleRetry = () => {
    dispatch(fetchPost(postId));
    dispatch(fetchComments(postId));
  };

  const handleAddComment = async () => {
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

  const handleSaveComment = async (comment: Comment) => {
    if (!comment.body.trim()) return;
    dispatch(
      updateLocalComment({ id: comment.id, payload: { ...comment, body: comment.body.trim() } }),
    );
    setEditingComment(null);
  };

  const handleRemoveComment = async (comment: Comment) => {
    await dispatch(removeComment(comment.id));
  };

  const handleEditingCommentChange = (value: string) => {
    if (editingComment) {
      setEditingComment({ ...editingComment, body: value });
    }
  };

  if ((postsLoading && !post) || (commentsLoading && postComments.length === 0)) {
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

        <CommentForm value={newComment} onChange={setNewComment} onSubmit={handleAddComment} />

        {commentsLoading && postComments.length === 0 ? (
          <Loader />
        ) : postComments.length === 0 ? (
          <div className='post-widget__empty-comments'>No comments</div>
        ) : (
          postComments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={setEditingComment}
              onRemove={handleRemoveComment}
            />
          ))
        )}
      </section>

      <Modal isOpen={!!editingComment} title='Edit comment' onClose={() => setEditingComment(null)}>
        {editingComment && (
          <div className='comment-editor'>
            <Input
              value={editingComment.body}
              onChange={(event) => handleEditingCommentChange(event.currentTarget.value)}
            />
            <div className='comment-editor__actions'>
              <Button
                disabled={!editingComment.body.trim()}
                primary
                onClick={() => handleSaveComment(editingComment)}
              >
                Save
              </Button>
              <Button onClick={() => setEditingComment(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
