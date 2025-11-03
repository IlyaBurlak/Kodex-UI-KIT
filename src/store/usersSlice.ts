import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { RootState } from './index';
import { getUsers } from '../api';
import { getErrorMessage } from './utils';

export type User = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
};

export interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchUsers = createAsyncThunk('users/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getUsers();
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to load users';
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const selectUsers = (state: RootState) => state.users.items;

export default usersSlice.reducer;
