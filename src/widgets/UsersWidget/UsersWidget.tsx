import { FC, useEffect, useMemo, useState } from 'react';

import './usersWidget.scss';

import { useNavigate } from 'react-router-dom';

import type { Column } from '../../components/Table/Table.types';
import { Button, Input, Loader, Table } from '../../components';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectUsers,
  selectUsersError,
  selectUsersLoading,
} from '../../store/UsersSlice/usersSlice';
import { fetchUsers } from '../../store/UsersSlice/usersThunks';
import { User } from '../../store/UsersSlice/usersTypes';
import { ErrorDisplay } from '../ErrorWidget/ErrorDisplay.tsx';

export type UsersWidgetProps = { onViewPosts?: (userId: number) => void };

export const UsersWidget: FC<UsersWidgetProps> = ({ onViewPosts }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [selected, setSelected] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!users || users.length === 0) dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return users;
    const queryLower = debouncedQuery.toLowerCase();
    return users.filter(
      (user: User) =>
        (user.name ?? '').toLowerCase().includes(queryLower) ||
        (user.username ?? '').toLowerCase().includes(queryLower),
    );
  }, [users, debouncedQuery]);

  const columns: Column<User>[] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Company',
      dataIndex: 'company',
      render: (_value: unknown, row: User) => {
        return row.company?.name ?? '-';
      },
    },
  ];

  if (loading && users.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorDisplay
        className='users-widget-error'
        message={error}
        title='Ошибка загрузки пользователей'
        onRetry={() => dispatch(fetchUsers())}
      />
    );
  }
  return (
    <div className='w-users-widget'>
      <div className='w-users-widget__header'>
        <Input
          placeholder='Search users...'
          value={query}
          onChange={(value: string) => setQuery(value)}
        />
      </div>

      <div className='w-users-widget__body'>
        {loading ? (
          <Loader />
        ) : (
          <Table<User>
            columns={columns}
            data={filtered}
            hover
            onRowClick={(row) => setSelected(row)}
          />
        )}
      </div>

      {selected && (
        <aside className='w-users-widget__panel'>
          <Button label='Close' onClick={() => setSelected(null)} />
          <h3>{selected.name}</h3>
          <p>
            <strong>Username:</strong> {selected.username}
          </p>
          <p>
            <strong>Email:</strong> {selected.email}
          </p>
          <p>
            <strong>Phone:</strong> {selected.phone}
          </p>
          <p>
            <strong>Website:</strong> {selected.website}
          </p>
          <p>
            <strong>Company:</strong> {selected.company?.name}
          </p>
          <div className='w-users-widget__toolbar'>
            <Button
              label='Посмотреть посты'
              primary
              onClick={() => {
                if (onViewPosts) return onViewPosts(selected.id);
                navigate(`/posts?userId=${selected.id}`);
              }}
            />
          </div>
        </aside>
      )}
    </div>
  );
};
