export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export type EditCommentArgs = { id: number; payload: Partial<Comment> };
export type EditCommentResult = { id: number } & Partial<Comment>;

export interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
  fetchedPosts: Record<number, boolean>;
}
