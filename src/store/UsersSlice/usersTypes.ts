export type User = {
  id: number;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
};

export interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}
