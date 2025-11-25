import { RootState } from '@/store';
import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { addComment, editComment, fetchComments, removeComment } from './commentsThunks';
import { CommentsState } from './commentsTypes';

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
  fetchedPosts: {},
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateLocalComment: (state, action) => {
      const { id, payload } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) Object.assign(existing, payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload.comments;
        const fetchedPostId = action.payload.postId;
        if (typeof fetchedPostId === 'number') state.fetchedPosts[fetchedPostId] = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        const addedPostId = action.payload.postId;
        if (typeof addedPostId === 'number') state.fetchedPosts[addedPostId] = true;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const comment = state.items.find((item) => item.id === action.payload.id);
        if (comment) Object.assign(comment, action.payload);
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
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

export const { updateLocalComment } = commentsSlice.actions;
export const selectComments = (state: RootState) => state.comments.items;
export const selectCommentsLoading = (state: RootState) => state.comments.loading;
export default commentsSlice.reducer;
