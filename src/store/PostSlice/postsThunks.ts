import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../index';
import { getPost, getPosts } from '../../api';
import { getErrorMessage } from '../utils.ts';
import {
  applyLocalUpdates,
  loadLocalPosts,
  loadPostUpdates,
  saveLocalPosts,
  savePostUpdates,
} from './postsStorage';
import { EditPostArgs, EditPostResult, FetchPostsArgs, Post } from './postsTypes';

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchPosts = createAsyncThunk<Post[], FetchPostsArgs, { state: RootState }>(
  'posts/fetch',
  async (args: FetchPostsArgs, { rejectWithValue }) => {
    try {
      const response = await getPosts(args.params);
      let posts = applyLocalUpdates(response.data);

      const append = Boolean(args.append);
      if (append) {
        return posts;
      }

      const localPosts = loadLocalPosts();
      const localPostsFiltered = localPosts.filter((localPost) => {
        if (!args.params) return true;
        if (args.params.userId != null && String(args.params.userId) !== '') {
          if (localPost.userId !== Number(args.params.userId)) return false;
        }
        if (args.params.title_like != null && String(args.params.title_like) !== '') {
          if (!localPost.title.includes(String(args.params.title_like))) return false;
        }
        return true;
      });

      const serverIds = new Set(posts.map((post) => post.id));
      const uniqueLocalPosts = localPostsFiltered.filter((post) => !serverIds.has(post.id));

      return [...uniqueLocalPosts, ...posts];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
  {
    condition: (args: FetchPostsArgs, { getState }) => {
      const state = getState();
      if (state.posts.loading || state.posts.loadingMore) return false;
      if (args?.params && args.params.start === 0 && state.posts.items.length > 0) return false;
      return true;
    },
  },
);

export const fetchPost = createAsyncThunk<Post, number, { state: RootState }>(
  'posts/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getPost(id);
      let post: Post = response.data;

      const updates = loadPostUpdates();
      const update = updates[id];
      if (update) {
        post = { ...post, ...update };
      }

      const localPosts = loadLocalPosts();
      const localPost = localPosts.find((post) => post.id === id);
      if (localPost) {
        post = { ...post, ...localPost };
      }

      return post;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
  {
    condition: (id: number, { getState }) => {
      const state = getState();
      if (state.posts.loading) return false;
      if (state.posts.selected && state.posts.selected.id === id) return false;
      return true;
    },
  },
);

export const addPost = createAsyncThunk(
  'posts/add',
  async (post: Partial<Omit<Post, 'id'>>, { rejectWithValue }) => {
    try {
      const newPost: Post = {
        id: -Date.now(),
        userId: post.userId ?? 0,
        title: post.title ?? '',
        body: post.body ?? '',
      };

      const localPosts = loadLocalPosts();
      saveLocalPosts([newPost, ...localPosts]);

      return newPost;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editPost = createAsyncThunk<EditPostResult, EditPostArgs>(
  'posts/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const updates = { ...loadPostUpdates(), [id]: { ...loadPostUpdates()[id], ...payload } };
      savePostUpdates(updates);

      const localPosts = loadLocalPosts();
      const index = localPosts.findIndex((post) => post.id === id);
      if (index !== -1) {
        localPosts[index] = { ...localPosts[index], ...payload };
        saveLocalPosts(localPosts);
      }

      return { id, ...payload };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removePost = createAsyncThunk(
  'posts/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      const localPosts = loadLocalPosts().filter((post) => post.id !== id);
      saveLocalPosts(localPosts);

      const updates = { ...loadPostUpdates() };
      delete updates[id];
      savePostUpdates(updates);

      return id;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);
