export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export interface PostsState {
  items: Post[];
  loading: boolean;
  loadingMore?: boolean;
  error: string | null;
  selected: Post | null;
}

export type FetchPostsArgs = { params?: Record<string, unknown>; append?: boolean };
export type EditPostArgs = { id: number; payload: Partial<Post> };
export type EditPostResult = { id: number } & Partial<Post>;
