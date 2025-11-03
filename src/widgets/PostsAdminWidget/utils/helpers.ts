import {User} from "../../../store/usersSlice.ts";

export const buildFetchParams = (opts: {
  limit: number;
  start: number;
  authorFilter?: string;
  titleFilter?: string;
}): Record<string, unknown> => {
  const { limit, start, authorFilter, titleFilter } = opts;
  const params: Record<string, unknown> = { _limit: limit, _start: start };
  if (authorFilter) params.userId = Number(authorFilter);
  if (titleFilter) params.title_like = titleFilter;
  return params;
};

export const getInitialAuthorFilter = (initialAuthorId?: number): string | undefined =>
    initialAuthorId ? String(initialAuthorId) : undefined;

export const getModalTitle = (editingId: number): string =>
    editingId ? 'Edit post' : 'Create post';

export const getUserOptions = (users: User[]) => [
  { label: 'All', value: '' },
  ...users.map((u) => ({ label: u.name, value: String(u.id) }))
];