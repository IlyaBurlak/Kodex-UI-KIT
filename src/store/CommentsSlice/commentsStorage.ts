import { Comment } from './commentsTypes';

const LOCAL_COMMENTS_KEY = 'kodex_comments_local';
const LOCAL_COMMENTS_UPDATES_KEY = 'kodex_comments_updates';

export const loadLocalComments = (): Comment[] => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalComments = (comments: Comment[]) => {
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch {}
};

export const loadCommentUpdates = (): Record<number, Partial<Comment>> => {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_UPDATES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveCommentUpdates = (updates: Record<number, Partial<Comment>>) => {
  try {
    localStorage.setItem(LOCAL_COMMENTS_UPDATES_KEY, JSON.stringify(updates));
  } catch {}
};

export const applyLocalUpdates = (comments: Comment[]): Comment[] => {
  const updates = loadCommentUpdates();
  return comments.map((comment) => ({
    ...comment,
    ...updates[comment.id],
  }));
};
