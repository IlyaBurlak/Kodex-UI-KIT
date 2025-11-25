import { configureStore } from '@reduxjs/toolkit';

import commentsReducer from './CommentsSlice/commentsSlice';
import postsReducer from './PostSlice/postsSlice';
import usersReducer from './UsersSlice/usersSlice';

export const store = configureStore({
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
