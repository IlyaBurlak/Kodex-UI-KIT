import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import {
  addPost,
  editPost,
  fetchPosts,
  removePost,
  selectPosts,
  selectPostsLoading,
} from '../../../store/postsSlice.ts';
import { fetchUsers, selectUsers } from '../../../store/usersSlice.ts';
import { Post } from '../types';
import { buildFetchParams, getInitialAuthorFilter } from '../utils/helpers.ts';

const LIMIT = 20;

export const usePostsManagement = (initialAuthorId?: number) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const postsLoading = useAppSelector(selectPostsLoading);
  const users = useAppSelector(selectUsers);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState(getInitialAuthorFilter(initialAuthorId));

  const loadPosts = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const params = buildFetchParams({
          limit: LIMIT,
          start: reset ? 0 : page * LIMIT,
          authorFilter,
          titleFilter,
        });
        const data = (await dispatch(fetchPosts(params)).unwrap()) as Post[];
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, page, authorFilter, titleFilter],
  );

  const loadMorePosts = async () => {
    setLoading(true);
    try {
      const params = buildFetchParams({
        limit: LIMIT,
        start: posts.length,
        authorFilter,
        titleFilter,
      });
      const data = (await dispatch(fetchPosts(params)).unwrap()) as Post[];
      setHasMore(data.length === LIMIT);
    } catch (err) {
      console.error('Failed to load more posts', err);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (payload: Partial<Post>, editing: Post | null) => {
    if (!editing) return;
    setLoading(true);
    try {
      if (editing.id && editing.id > 0) {
        await dispatch(editPost({ id: editing.id, payload })).unwrap();
      } else {
        await dispatch(addPost(payload)).unwrap();
      }
    } catch (err) {
      console.error('Failed to save post', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (post: Post) => {
    setLoading(true);
    try {
      await dispatch(removePost(post.id)).unwrap();
    } catch (err) {
      console.error('Failed to delete post', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchUsers()).unwrap();
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    loadUsers();
  }, [dispatch]);

  useEffect(() => {
    setAuthorFilter(getInitialAuthorFilter(initialAuthorId));
  }, [initialAuthorId]);

  useEffect(() => {
    setPage(0);
    loadPosts(true);
  }, [titleFilter, authorFilter]);

  useEffect(() => {
    if (page === 0) return;
    loadPosts(false);
  }, [page]);

  return {
    posts,
    users,
    loading: loading || postsLoading,
    hasMore,
    titleFilter,
    authorFilter,
    setTitleFilter,
    setAuthorFilter,
    setPage,
    loadMorePosts,
    savePost,
    deletePost,
  };
};
