import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { selectPosts, selectPostsLoading, selectPostsLoadingMore } from '../../../store/PostSlice/postsSlice.ts';
import { addPost, editPost, fetchPosts, removePost } from '../../../store/PostSlice/postsThunks.ts';
import { selectUsers, selectUsersLoading } from '../../../store/UsersSlice/usersSlice.ts'; // Добавляем селектор loading для users
import { fetchUsers } from '../../../store/UsersSlice/usersThunks.ts';
import { Post } from '../types';
import { buildFetchParams, getInitialAuthorFilter } from '../utils/helpers.ts';

const LIMIT = 20;

export const usePostsManagement = (initialAuthorId?: number) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsLoadingMore = useAppSelector(selectPostsLoadingMore);
  const users = useAppSelector(selectUsers);
  const usersLoading = useAppSelector(selectUsersLoading);

  const [hasMore, setHasMore] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState(getInitialAuthorFilter(initialAuthorId));

  const loading = postsLoading || usersLoading;

  const loadPosts = useCallback(
    async (reset = false) => {
      const params = buildFetchParams({
        limit: LIMIT,
        start: reset ? 0 : posts.length,
        authorFilter,
        titleFilter,
      });

      try {
        const resultAction = await dispatch(fetchPosts({ params, append: !reset }));
        if (fetchPosts.fulfilled.match(resultAction)) {
          const data = resultAction.payload;
          setHasMore(data.length === LIMIT);
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    },
    [dispatch, posts.length, authorFilter, titleFilter],
  );

  const loadMorePosts = async () => {
    const params = buildFetchParams({
      limit: LIMIT,
      start: posts.length,
      authorFilter,
      titleFilter,
    });

    try {
      const resultAction = await dispatch(fetchPosts({ params, append: true }));
      if (fetchPosts.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        setHasMore(data.length === LIMIT);
      }
    } catch (err) {
      console.error('Failed to load more posts', err);
    }
  };

  const savePost = async (payload: Partial<Post>, editing: Post | null) => {
    if (!editing) return;

    try {
      if (editing.id && editing.id > 0) {
        await dispatch(editPost({ id: editing.id, payload }));
      } else {
        await dispatch(addPost(payload));
      }
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  const deletePost = async (post: Post) => {
    try {
      await dispatch(removePost(post.id));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setAuthorFilter(getInitialAuthorFilter(initialAuthorId));
  }, [initialAuthorId]);

  useEffect(() => {
    loadPosts(true);
  }, [titleFilter, authorFilter]);

  return {
    posts,
    users,
    loading,
    loadingMore: postsLoadingMore,
    hasMore,
    titleFilter,
    authorFilter,
    setTitleFilter,
    setAuthorFilter,
    loadMorePosts,
    savePost,
    deletePost,
  };
};
