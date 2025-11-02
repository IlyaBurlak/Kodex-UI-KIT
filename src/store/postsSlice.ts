import { createAsyncThunk, createSlice, isRejected, isFulfilled, isPending } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../api';
import { getErrorMessage } from './utils';

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
  selected: Post | null;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
  selected: null,
};

export const fetchPosts = createAsyncThunk<Post[], Record<string, unknown> | undefined, { rejectValue: string }>(
  'posts/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPosts(params);
      return response.data as Post[];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchPost = createAsyncThunk<Post, number, { rejectValue: string }>(
  'posts/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPost(id);
      return response.data as Post;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const addPost = createAsyncThunk<Post, Partial<Omit<Post, 'id'>>, { rejectValue: string }>(
  'posts/add',
  async (post, { rejectWithValue }) => {
    try {
      const response = await createPost(post);
      return response.data as Post;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const editPost = createAsyncThunk<Post, { id: number; payload: Partial<Post> }, { rejectValue: string }>(
  'posts/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updatePost(id, payload);
      return response.data as Post;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const removePost = createAsyncThunk<number, number, { rejectValue: string }>(
  'posts/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchPosts.fulfilled, (state, action) => {
          const params = action.meta.arg as Record<string, unknown> | undefined;
          const start = params && params._start != null ? Number(params._start) : 0;
          if (start && start > 0) {
            state.items = [...state.items, ...action.payload];
          } else {
            state.items = action.payload;
          }
        })

        .addCase(fetchPost.fulfilled, (state, action) => {
          state.selected = action.payload;
        })

        .addCase(addPost.fulfilled, (state, action) => {
          state.items.unshift(action.payload);
        })

        .addCase(editPost.fulfilled, (state, action) => {
          const index = state.items.findIndex(post => post.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        })

        .addCase(removePost.fulfilled, (state, action) => {
          state.items = state.items.filter(post => post.id !== action.payload);
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

export const selectPosts = (state: RootState) => state.posts.items;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectSelectedPost = (state: RootState) => state.posts.selected;

export default postsSlice.reducer;