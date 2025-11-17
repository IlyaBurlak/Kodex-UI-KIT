import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '../../../store/usersSlice.ts';
import type { Post } from '../types.ts';
import { Button, Table } from '../../../components';
import { TableActions } from '../utils/TableActions.tsx';

export type PostsTableProps = {
  posts: Post[];
  users: User[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  loadMore: () => void;
  hasMore: boolean;
};

export const PostsTable: FC<PostsTableProps> = ({
  posts,
  users,
  onEdit,
  onDelete,
  loadMore,
  hasMore,
}) => {
  const navigate = useNavigate();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Author',
      dataIndex: 'userId',
      key: 'author',
      render: (value: unknown) =>
        users.find((user) => user.id === Number(value))?.name ?? Number(value),
    },
    { title: 'Body', dataIndex: 'body', key: 'body' },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (_: unknown, record: Post) => (
        <TableActions
          record={record}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={() => navigate(`/posts/${record.id}`)}
        />
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={posts} hover />
      {(hasMore || posts.length >= 20) && (
        <div className='w-posts-admin__pager'>
          <Button label='Load more' onClick={loadMore} />
        </div>
      )}
    </>
  );
};
