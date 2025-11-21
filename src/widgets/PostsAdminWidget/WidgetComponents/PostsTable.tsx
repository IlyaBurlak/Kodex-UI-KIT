import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Column } from '../../../components/Table/Table.types';
import type { Post } from '../types.ts';
import { Button, Table } from '../../../components';
import { User } from '../../../store/UsersSlice/usersTypes.ts';
import { TableActions } from '../utils/TableActions.tsx';

export type PostsTableProps = {
  posts: Post[];
  users: User[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  loadMore: () => void;
  hasMore: boolean;
  loadingMore?: boolean;
};

export const PostsTable: FC<PostsTableProps> = ({
  posts,
  users,
  onEdit,
  onDelete,
  loadMore,
  hasMore,
  loadingMore,
}) => {
  const navigate = useNavigate();

  const columns: Column<Post>[] = [
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
          {loadingMore ? (
            <div className='w-posts-admin__loading-more'>Loading more...</div>
          ) : (
            <Button label='Load more' onClick={loadMore} />
          )}
        </div>
      )}
    </>
  );
};
