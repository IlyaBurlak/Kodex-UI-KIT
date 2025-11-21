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
  const [hasMore, setHasMore] = useState(true);
  const [fetchedCount, setFetchedCount] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    loadPosts(false);
  }, [titleFilter, authorFilter]);

  const loadPosts = useCallback(
    (append: boolean = false) => {
      const limit = 20;
      const params: Record<string, unknown> = {
        _start: append ? fetchedCount : 0,
        _limit: limit,
      };

      if (titleFilter) {
        params.title_like = titleFilter;
      }

      if (authorFilter) {
        params.userId = authorFilter;
      }

      dispatch(fetchPosts({ params, append })).then((action) => {
        if (action.payload && Array.isArray(action.payload)) {
          const payload = action.payload as Post[];
          const serverReturnedCount = payload.filter((p) => Number(p.id) > 0).length;
          if (append) {
            setFetchedCount((prev) => prev + serverReturnedCount);
          } else {
            setFetchedCount(serverReturnedCount);
          }
          if (serverReturnedCount < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      });
    },
    [dispatch, titleFilter, authorFilter, fetchedCount],
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
