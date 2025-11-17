import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { RootState } from '../index.ts';
import { addComment, editComment, fetchComments, removeComment } from './commentsThunks';
import { CommentsState } from './commentsTypes';

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateLocalComment: (state, action) => {
      const { id, payload } = action.payload;
      const comment = state.items.find((c) => c.id === id);
      if (comment) Object.assign(comment, payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const comment = state.items.find((c) => c.id === action.payload.id);
        if (comment) Object.assign(comment, action.payload);
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
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
