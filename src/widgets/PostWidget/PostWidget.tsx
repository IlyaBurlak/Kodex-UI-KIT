import { FC, useEffect, useState } from 'react';

import type { Comment as CommentType } from '../../store/commentsSlice';
import type { Post } from '../../store/postsSlice';
import { Button, Input, Loader, Modal } from '../../components';
import {
  addComment,
  editComment,
  fetchComments,
  removeComment,
  selectComments,
  selectCommentsLoading,
} from '../../store/commentsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPost, selectPostsLoading, selectSelectedPost } from '../../store/postsSlice';

import './postWidget.scss';

export const PostWidget: FC<{ postId: number }> = ({ postId }) => {
  const dispatch = useAppDispatch();

  const post = useAppSelector(selectSelectedPost) as Post | null;
  const postsLoading = useAppSelector(selectPostsLoading);

  const comments = useAppSelector(selectComments) as CommentType[];
  const commentsLoading = useAppSelector(selectCommentsLoading);

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);

  useEffect(() => {
    if (!postId) return;
    dispatch(fetchPost(postId));
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const onAdd = async () => {
    if (!newComment) return;
    await dispatch(
      addComment({
        postId,
        body: newComment,
        name: 'You',
        email: ''
      }),
    );
    setNewComment('');
  };

  const onSave = async (c: CommentType) => {
    await dispatch(editComment({ id: c.id, payload: c }));
    setEditingComment(null);
  };

  const onRemove = async (c: CommentType) => {
    await dispatch(removeComment(c.id));
  };

  if (postsLoading || commentsLoading || !post) return <Loader />;

  return (
    <div className='post-widget'>
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <section>
        <h3>Comments</h3>
        <div className='post-comments__controls'>
          <Input placeholder='New comment' value={newComment} onChange={(v) => setNewComment(v)} />
          <Button label='Add' primary onClick={onAdd} />
        </div>
        {comments.map((c: CommentType) => (
          <div key={c.id} className='post-comment'>
            <div className='post-comment__name'>{c.name}</div>
            <div>{c.body}</div>
            <div className='post-comment__actions'>
              <Button label='Edit' onClick={() => setEditingComment(c)} />
              <Button label='Delete' variant='delete' onClick={() => onRemove(c)} />
            </div>
          </div>
        ))}
      </section>

      <Modal isOpen={!!editingComment} title='Edit comment' onClose={() => setEditingComment(null)}>
        {editingComment && (
          <div className='comment-editor'>
            <Input
              value={editingComment.body}
              onChange={(v) => setEditingComment({ ...editingComment, body: v })}
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