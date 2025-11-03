import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

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

const handleAsyncError = (error: unknown, rejectWithValue: Function) => {
  return rejectWithValue(getErrorMessage(error));
};

export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (params: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await getPosts(params);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const fetchPost = createAsyncThunk(
  'posts/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getPost(id);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const addPost = createAsyncThunk(
  'posts/add',
  async (post: Partial<Omit<Post, 'id'>>, { rejectWithValue }) => {
    try {
      const response = await createPost(post);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editPost = createAsyncThunk(
  'posts/edit',
  async ({ id, payload }: { id: number; payload: Partial<Post> }, { rejectWithValue }) => {
    try {
      const response = await updatePost(id, payload);
      return response.data;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removePost = createAsyncThunk(
  'posts/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
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

        // Local persistence: merge local-created posts so they survive reloads
        const LOCAL_KEY = 'kodex_posts_local';
        const loadLocal = (): Post[] => {
          try {
            const raw = localStorage.getItem(LOCAL_KEY);
            return raw ? (JSON.parse(raw) as Post[]) : [];
          } catch {
            return [];
          }
        };

        const filterLocal = (p: Post) => {
          if (!params) return true;
          if (params.userId != null && String(params.userId) !== '') {
            // params.userId may be number or string
            if (p.userId !== Number(params.userId)) return false;
          }
          if (params.title_like != null && String(params.title_like) !== '') {
            if (!p.title.includes(String(params.title_like))) return false;
          }
          return true;
        };

        const local = loadLocal().filter(filterLocal);

        if (start && start > 0) {
          state.items = [...state.items, ...action.payload];
        } else {
          // Prepend local created posts to the fetched list (avoid duplicates by id)
          const payloadById = new Set((action.payload as Post[]).map((x) => x.id));
          const uniqueLocal = local.filter((lp) => !payloadById.has(lp.id));
          state.items = [...uniqueLocal, ...action.payload];
        }
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        // persist created posts locally so they survive reloads
        try {
          const LOCAL_KEY = 'kodex_posts_local';
          const raw = localStorage.getItem(LOCAL_KEY);
          const existing: Post[] = raw ? JSON.parse(raw) : [];
          // avoid duplicate ids
          const exists = existing.find((p) => p.id === action.payload.id);
          if (!exists) {
            existing.unshift(action.payload);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
          }
        } catch {
          // ignore localStorage errors
        }
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // update local storage if post was stored locally
        try {
          const LOCAL_KEY = 'kodex_posts_local';
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) {
            const existing: Post[] = JSON.parse(raw);
            const idx = existing.findIndex((p) => p.id === action.payload.id);
            if (idx !== -1) {
              existing[idx] = action.payload;
              localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
            }
          }
        } catch {}
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        try {
          const LOCAL_KEY = 'kodex_posts_local';
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) {
            const existing: Post[] = JSON.parse(raw);
            const updated = existing.filter((p) => p.id !== action.payload);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
          }
        } catch {}
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

export const selectPosts = (state: RootState) => state.posts.items;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectSelectedPost = (state: RootState) => state.posts.selected;

export default postsSlice.reducer;
