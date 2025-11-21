import type { Post } from '../types';

export type PostValidationErrors = {
  title?: string;
  body?: string;
  user?: string;
};

export const validatePost = (payload: Partial<Post>): PostValidationErrors => {
  const errors: PostValidationErrors = {};

  const title = payload.title ?? '';
  const body = payload.body ?? '';
  const userId = payload.userId ?? 0;

  if (!String(title).trim()) {
    errors.title = 'Title is required';
  } else if (String(title).trim().length <= 3) {
    errors.title = 'Title must be more than 3 characters';
  }

  if (!String(body).trim()) {
    errors.body = 'Body is required';
  }

  if (!userId || Number(userId) <= 0) {
    errors.user = 'Author is required';
  }

  return errors;
};
