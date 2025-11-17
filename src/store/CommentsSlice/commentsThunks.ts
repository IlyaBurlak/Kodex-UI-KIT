import { createAsyncThunk } from '@reduxjs/toolkit';

import { getComments } from '../../api';
import { getErrorMessage } from '../utils.ts';
import {
  applyLocalUpdates,
  loadCommentUpdates,
  loadLocalComments,
  saveCommentUpdates,
  saveLocalComments,
} from './commentsStorage';
import { Comment, EditCommentArgs, EditCommentResult } from './commentsTypes';

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchComments = createAsyncThunk<Comment[], number>(
  'comments/fetch',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await getComments({ postId });
      let comments = applyLocalUpdates(response.data);

      const localComments = loadLocalComments();
      const localCommentsForPost = localComments.filter((c) => c.postId === postId);
      const serverIds = new Set(comments.map((c) => c.id));

      return [...localCommentsForPost.filter((c) => !serverIds.has(c.id)), ...comments];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const addComment = createAsyncThunk(
  'comments/add',
  async (comment: Omit<Comment, 'id'>, { rejectWithValue }) => {
    try {
      const newComment: Comment = { ...comment, id: -Date.now() };
      const localComments = loadLocalComments();
      saveLocalComments([newComment, ...localComments]);
      return newComment;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editComment = createAsyncThunk<EditCommentResult, EditCommentArgs>(
  'comments/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const updates = {
        ...loadCommentUpdates(),
        [id]: { ...loadCommentUpdates()[id], ...payload },
      };
      saveCommentUpdates(updates);

      const localComments = loadLocalComments();
      const index = localComments.findIndex((c) => c.id === id);
      if (index !== -1) {
        localComments[index] = { ...localComments[index], ...payload };
        saveLocalComments(localComments);
      }

      return { id, ...payload };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removeComment = createAsyncThunk(
  'comments/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      const localComments = loadLocalComments().filter((c) => c.id !== id);
      saveLocalComments(localComments);

      const updates = { ...loadCommentUpdates() };
      delete updates[id];
      saveCommentUpdates(updates);

      return id;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);
