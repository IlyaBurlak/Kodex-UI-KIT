import { createAsyncThunk, createSlice, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';
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

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers();
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

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
          // @ts-ignore
          state.error = action.payload ?? action.error?.message ?? 'Failed to load users';
        })
        .addMatcher(isFulfilled, (state) => {
          state.loading = false;
        });
  },
});

export const selectUsers = (state: RootState) => state.users.items;

export default usersSlice.reducer;