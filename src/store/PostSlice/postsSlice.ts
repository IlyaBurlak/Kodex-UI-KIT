import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { RootState } from '../index.ts';
import { addPost, editPost, fetchPost, fetchPosts, removePost } from './postsThunks';
import { PostsState } from './postsTypes';

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
  selected: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const append = Boolean(action.meta.arg?.append);
        if (append) {
          const existingIds = new Set(state.items.map((item) => item.id));
          const toAdd = action.payload.filter((post) => !existingIds.has(post.id));
          state.items.push(...toAdd);
        } else {
          state.items = action.payload;
        }
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        if (state.selected && state.selected.id === action.payload.id) {
          state.selected = { ...state.selected, ...action.payload };
        }
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        if (state.selected && state.selected.id === action.payload) {
          state.selected = null;
        }
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message || 'Operation failed';
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const selectPosts = (state: RootState) => state.posts.items;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectSelectedPost = (state: RootState) => state.posts.selected;

export default postsSlice.reducer;
