import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../index';
import { getUsers } from '../../api';
import { getErrorMessage } from '../utils.ts';
import { User } from './usersTypes';

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchUsers = createAsyncThunk<User[], void, { state: RootState }>(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers();
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (state.users.loading) return false;
      if (state.users.items && state.users.items.length > 0) return false;
      return true;
    },
  },
);
