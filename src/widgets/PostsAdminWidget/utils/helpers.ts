import { User } from '@store/UsersSlice/usersTypes';

export const getModalTitle = (editingId: number): string =>
  editingId ? 'Edit post' : 'Create post';

const mapUsersToOptions = (users: User[]) =>
  users.map((user) => ({ label: user.name, value: String(user.id) }));

export const getUserSelectOptions = mapUsersToOptions;
