import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUsers } from '../../api';
import { getErrorMessage } from '../utils.ts';
import { User } from './usersTypes';

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers();
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);
