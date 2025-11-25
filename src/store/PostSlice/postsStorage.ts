import { Post } from './postsTypes';

const LOCAL_POSTS_KEY = 'kodex_posts_local';
const LOCAL_POSTS_UPDATES_KEY = 'kodex_posts_updates';

export const loadLocalPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalPosts = (posts: Post[]) => {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch {}
};

export const loadPostUpdates = (): Record<number, Partial<Post>> => {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_UPDATES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const savePostUpdates = (updates: Record<number, Partial<Post>>) => {
  try {
    localStorage.setItem(LOCAL_POSTS_UPDATES_KEY, JSON.stringify(updates));
  } catch {}
};

export const applyLocalUpdates = (posts: Post[]): Post[] => {
  const updates = loadPostUpdates();
  return posts.map((post) => ({
    ...post,
    ...updates[post.id],
  }));
};
