import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { RootState } from './index';
import { getPost, getPosts } from '../api';
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

const LOCAL_POSTS_KEY = 'kodex_posts_local';
const LOCAL_POSTS_UPDATES_KEY = 'kodex_posts_updates';

const loadLocalPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
};

const saveLocalPosts = (posts: Post[]) => {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch {}
};

const loadPostUpdates = (): Record<number, Partial<Post>> => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_UPDATES_KEY);
    return raw ? (JSON.parse(raw) as Record<number, Partial<Post>>) : {};
  } catch {
    return {};
  }
};

const savePostUpdates = (updates: Record<number, Partial<Post>>) => {
  try {
    localStorage.setItem(LOCAL_POSTS_UPDATES_KEY, JSON.stringify(updates));
  } catch {}
};

const applyLocalUpdates = (posts: Post[]): Post[] => {
  const updates = loadPostUpdates();
  return posts.map((post) => {
    const update = updates[post.id];
    return update ? { ...post, ...update } : post;
  });
};

export const fetchPosts = createAsyncThunk(
  'posts/fetch',
  async (
    args: {
      params?: Record<string, unknown>;
      append?: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPosts(args.params);
      let posts = response.data as Post[];

      posts = applyLocalUpdates(posts);

      const append = Boolean(args.append);

      if (append) {
        return posts;
      }

      const localPosts = loadLocalPosts();
      const localPostsFiltered = localPosts.filter((localPost) => {
        if (!args.params) return true;
        if (args.params.userId != null && String(args.params.userId) !== '') {
          if (localPost.userId !== Number(args.params.userId)) return false;
        }
        if (args.params.title_like != null && String(args.params.title_like) !== '') {
          if (!localPost.title.includes(String(args.params.title_like))) return false;
        }
        return true;
      });

      const serverIds = new Set(posts.map((p) => p.id));
      const uniqueLocalPosts = localPostsFiltered.filter((p) => !serverIds.has(p.id));

      return [...uniqueLocalPosts, ...posts];
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
      let post = response.data as Post;

      const updates = loadPostUpdates();
      const update = updates[id];
      if (update) {
        post = { ...post, ...update };
      }

      const localPosts = loadLocalPosts();
      const localPost = localPosts.find((p) => p.id === id);
      if (localPost) {
        post = { ...post, ...localPost };
      }

      return post;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const addPost = createAsyncThunk(
  'posts/add',
  async (post: Partial<Omit<Post, 'id'>>, { rejectWithValue }) => {
    try {
      const newPost: Post = {
        ...(post as Omit<Post, 'id'>),
        id: -Date.now(),
      };

      const localPosts = loadLocalPosts();
      localPosts.unshift(newPost);
      saveLocalPosts(localPosts);

      return newPost;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const editPost = createAsyncThunk(
  'posts/edit',
  async ({ id, payload }: { id: number; payload: Partial<Post> }, { rejectWithValue }) => {
    try {
      const updates = loadPostUpdates();
      updates[id] = { ...updates[id], ...payload };
      savePostUpdates(updates);

      const localPosts = loadLocalPosts();
      const localPostIndex = localPosts.findIndex((p) => p.id === id);
      if (localPostIndex !== -1) {
        localPosts[localPostIndex] = { ...localPosts[localPostIndex], ...payload };
        saveLocalPosts(localPosts);
      }

      return { id, ...payload } as Post;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  },
);

export const removePost = createAsyncThunk(
  'posts/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      const localPosts = loadLocalPosts();
      const updatedLocalPosts = localPosts.filter((post) => post.id !== id);
      saveLocalPosts(updatedLocalPosts);

      const updates = loadPostUpdates();
      delete updates[id];
      savePostUpdates(updates);

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
        const metaArg = action.meta.arg as
          | { params?: Record<string, unknown>; append?: boolean }
          | undefined;
        const append = Boolean(metaArg && metaArg.append);
        if (append) {
          const existingIds = new Set(state.items.map((i) => i.id));
          const toAdd = (action.payload as Post[]).filter((p) => !existingIds.has(p.id));
          state.items.push(...toAdd);
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
        const index = state.items.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selected && state.selected.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        if (state.selected && state.selected.id === action.payload) {
          state.selected = null;
        }
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
