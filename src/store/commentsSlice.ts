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

export const fetchComments = createAsyncThunk<Comment[], number, { rejectValue: string }>(
  'comments/fetch',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getComments({ postId });
      return response.data as Comment[];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const addComment = createAsyncThunk<Comment, Omit<Comment, 'id'>, { rejectValue: string }>(
  'comments/add',
  async (comment, { rejectWithValue }) => {
    try {
      const response = await createComment(comment);
      return response.data as Comment;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const editComment = createAsyncThunk<
  Comment,
  { id: number; payload: Partial<Comment> },
  { rejectValue: string }
>('comments/edit', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await updateComment(id, payload);
    return response.data as Comment;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const removeComment = createAsyncThunk<number, number, { rejectValue: string }>(
  'comments/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteComment(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.items.findIndex((comment) => comment.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
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
        // @ts-ignore
        state.error = action.payload ?? action.error?.message ?? 'Operation failed';
      })

      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const selectComments = (state: RootState) => state.comments.items;
export const selectCommentsLoading = (state: RootState) => state.comments.loading;

export default commentsSlice.reducer;
