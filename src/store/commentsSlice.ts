import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { RootState } from './index';
import { createComment, deleteComment, getComments, updateComment } from '../api';
import { getErrorMessage } from './utils';

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await getComments({ postId });
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const addComment = createAsyncThunk(
  'comments/add',
  async (comment: Omit<Comment, 'id'>, { rejectWithValue }) => {
    try {
      const response = await createComment(comment);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editComment = createAsyncThunk(
  'comments/edit',
  async ({ id, payload }: { id: number; payload: Partial<Comment> }, { rejectWithValue }) => {
    try {
      const response = await updateComment(id, payload);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removeComment = createAsyncThunk(
  'comments/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteComment(id);
      return id;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    updateLocalComment: (state, action: { payload: { id: number; payload: Partial<Comment> } }) => {
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
        state.items = state.items.filter((comment) => comment.id !== action.payload);
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Operation failed';
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
