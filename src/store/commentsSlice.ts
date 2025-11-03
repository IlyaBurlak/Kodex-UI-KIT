import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { RootState } from './index';
import { getComments } from '../api';
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

const LOCAL_COMMENTS_KEY = 'kodex_comments_local';
const LOCAL_COMMENTS_UPDATES_KEY = 'kodex_comments_updates';

const loadLocalComments = (): Comment[] => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
};

const saveLocalComments = (comments: Comment[]) => {
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch {}
};

const loadCommentUpdates = (): Record<number, Partial<Comment>> => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_UPDATES_KEY);
    return raw ? (JSON.parse(raw) as Record<number, Partial<Comment>>) : {};
  } catch {
    return {};
  }
};

const saveCommentUpdates = (updates: Record<number, Partial<Comment>>) => {
  try {
    localStorage.setItem(LOCAL_COMMENTS_UPDATES_KEY, JSON.stringify(updates));
  } catch {}
};

const applyLocalUpdates = (comments: Comment[]): Comment[] => {
  const updates = loadCommentUpdates();
  return comments.map((comment) => {
    const update = updates[comment.id];
    return update ? { ...comment, ...update } : comment;
  });
};

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await getComments({ postId });
      let comments = response.data as Comment[];

      comments = applyLocalUpdates(comments);

      const localComments = loadLocalComments();
      const localCommentsForPost = localComments.filter((comment) => comment.postId === postId);

      const serverIds = new Set(comments.map((c) => c.id));
      const uniqueLocalComments = localCommentsForPost.filter((c) => !serverIds.has(c.id));

      return [...uniqueLocalComments, ...comments];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const addComment = createAsyncThunk(
  'comments/add',
  async (comment: Omit<Comment, 'id'>, { rejectWithValue }) => {
    try {
      const newComment: Comment = {
        ...comment,
        id: -Date.now(),
      };

      const localComments = loadLocalComments();
      localComments.unshift(newComment);
      saveLocalComments(localComments);

      return newComment;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editComment = createAsyncThunk(
  'comments/edit',
  async ({ id, payload }: { id: number; payload: Partial<Comment> }, { rejectWithValue }) => {
    try {
      const updates = loadCommentUpdates();
      updates[id] = { ...updates[id], ...payload };
      saveCommentUpdates(updates);

      const localComments = loadLocalComments();
      const localCommentIndex = localComments.findIndex((c) => c.id === id);
      if (localCommentIndex !== -1) {
        localComments[localCommentIndex] = { ...localComments[localCommentIndex], ...payload };
        saveLocalComments(localComments);
      }

      return { id, ...payload } as Comment;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removeComment = createAsyncThunk(
  'comments/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      const localComments = loadLocalComments();
      const updatedLocalComments = localComments.filter((comment) => comment.id !== id);
      saveLocalComments(updatedLocalComments);

      const updates = loadCommentUpdates();
      delete updates[id];
      saveCommentUpdates(updates);

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
