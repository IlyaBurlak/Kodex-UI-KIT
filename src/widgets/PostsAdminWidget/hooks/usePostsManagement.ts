import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectPosts,
  selectPostsError,
  selectPostsLoading,
  selectPostsLoadingMore,
} from '../../../store/PostSlice/postsSlice.ts';
import { addPost, editPost, fetchPosts, removePost } from '../../../store/PostSlice/postsThunks.ts';
import { selectUsers, selectUsersError } from '../../../store/UsersSlice/usersSlice.ts';
import { fetchUsers } from '../../../store/UsersSlice/usersThunks.ts';
import { Post } from '../types.ts';

export const usePostsManagement = (initialAuthorId?: number) => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectPosts);
  const postsLoading = useAppSelector(selectPostsLoading);
  const postsLoadingMore = useAppSelector(selectPostsLoadingMore);
  const postsError = useAppSelector(selectPostsError);

  const users = useAppSelector(selectUsers);
  const usersError = useAppSelector(selectUsersError);

  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState(initialAuthorId ? String(initialAuthorId) : '');
  const [hasMore, setHasMore] = useState(true); // Добавляем состояние для отслеживания наличия дополнительных постов

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    loadPosts(false);
  }, [titleFilter, authorFilter]);

  const loadPosts = useCallback(
    (append: boolean = false) => {
      const params: Record<string, unknown> = {
        _start: append ? posts.length : 0,
        _limit: 20,
      };

      if (titleFilter) {
        params.title_like = titleFilter;
      }

      if (authorFilter) {
        params.userId = authorFilter;
      }

      dispatch(fetchPosts({ params, append })).then((action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const returnedPostsCount = action.payload.length;
          if (returnedPostsCount < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      });
    },
    [dispatch, titleFilter, authorFilter, posts.length],
  );

  const loadMorePosts = useCallback(() => {
    if (!postsLoadingMore && hasMore) {
      loadPosts(true);
    }
  }, [loadPosts, postsLoadingMore, hasMore]);

  const savePost = useCallback(
    async (payload: Partial<Post>, editing?: Post | null) => {
      if (editing && editing.id !== 0) {
        await dispatch(editPost({ id: editing.id, payload }));
      } else {
        await dispatch(addPost(payload));
      }
    },
    [dispatch],
  );

  const deletePost = useCallback(
    async (post: Post) => {
      await dispatch(removePost(post.id));
    },
    [dispatch],
  );

  return {
    posts,
    users,
    loading: postsLoading && !postsLoadingMore,
    loadingMore: postsLoadingMore,
    hasMore,
    titleFilter,
    authorFilter,
    postsError,
    usersError,
    setTitleFilter,
    setAuthorFilter,
    loadMorePosts,
    savePost,
    deletePost,
  };
};
