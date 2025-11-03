import { configureStore } from '@reduxjs/toolkit';

import commentsReducer, { CommentsState } from './commentsSlice';
import postsReducer, { PostsState } from './postsSlice';
import usersReducer, { UsersState } from './usersSlice';

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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
