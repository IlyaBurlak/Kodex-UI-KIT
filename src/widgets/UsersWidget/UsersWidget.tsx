import { FC, useEffect, useMemo, useState } from 'react';

import './usersWidget.scss';

import { useNavigate } from 'react-router-dom';

import type { User } from '../../store/usersSlice';
import { Button, Input, Loader, Table } from '../../components';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, selectUsers } from '../../store/usersSlice';

export const UsersWidget: FC<{ onViewPosts?: (userId: number) => void }> = ({ onViewPosts }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [selected, setSelected] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUsers()).unwrap();
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return users;
    const q = debouncedQuery.toLowerCase();
    return users.filter(
      (u: User) =>
        (u.name ?? '').toLowerCase().includes(q) || (u.username ?? '').toLowerCase().includes(q),
    );
  }, [users, debouncedQuery]);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Company',
      dataIndex: 'company',
      render: (value: unknown) => {
        const comp = value as User['company'] | undefined;
        return comp?.name ?? '-';
      },
    },
  ];

  return (
    <div className='w-users-widget'>
      <div className='w-users-widget__header'>
        <Input placeholder='Search users...' value={query} onChange={(v: string) => setQuery(v)} />
      </div>

      <div className='w-users-widget__body'>
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            hover
            onRowClick={(row) => setSelected(row as User)}
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
