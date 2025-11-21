import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../index.ts';
import { addPost, editPost, fetchPost, fetchPosts, removePost } from './postsThunks';
import { PostsState } from './postsTypes';

const initialState: PostsState = {
  items: [],
  loading: false,
  loadingMore: false,
  error: null,
  selected: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        const append = Boolean(action.meta.arg?.append);
        if (append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const append = Boolean(action.meta.arg?.append);
        if (append) {
          const existingIds = new Set(state.items.map((item) => item.id));
          const toAdd = action.payload.filter((post) => !existingIds.has(post.id));
          state.items.push(...toAdd);
        } else {
          state.items = action.payload;
        }
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      })
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      })
      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        if (state.selected && state.selected.id === action.payload.id) {
          state.selected = { ...state.selected, ...action.payload };
        }
        state.loading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      })
      .addCase(removePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        if (state.selected && state.selected.id === action.payload) {
          state.selected = null;
        }
        state.loading = false;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      });
  },
});

export const selectPosts = (state: RootState) => state.posts.items;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectPostsLoadingMore = (state: RootState) => Boolean(state.posts.loadingMore);
export const selectSelectedPost = (state: RootState) => state.posts.selected;

export default postsSlice.reducer;
