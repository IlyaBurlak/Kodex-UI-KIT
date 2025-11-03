import { configureStore } from '@reduxjs/toolkit';

import commentsReducer, { CommentsState } from './commentsSlice';
import postsReducer, { PostsState } from './postsSlice';
import usersReducer, { UsersState } from './usersSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('redux_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return undefined;
  }
};

const saveState = (state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('redux_state', serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
};

const preloadedState: any = loadState();

export const store = configureStore<{
  posts: PostsState;
  users: UsersState;
  comments: CommentsState;
}>({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    comments: commentsReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
