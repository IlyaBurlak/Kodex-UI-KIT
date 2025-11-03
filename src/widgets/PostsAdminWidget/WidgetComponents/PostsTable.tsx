import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../store/usersSlice.ts';
import type { Post } from '../types.ts';
import { Button, Table } from '../../../components';
import {TableActions} from "../utils/TableActions.tsx";

export const PostsTable: FC<{
  posts: Post[];
  users: User[];
  onEdit: (p: Post) => void;
  onDelete: (p: Post) => void;
  loadMore: () => void;
  hasMore: boolean;
}> = ({ posts, users, onEdit, onDelete, loadMore, hasMore }) => {
  const navigate = useNavigate();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Author',
      dataIndex: 'userId',
      key: 'author',
      render: (v: unknown) => users.find((u) => u.id === (v as number))?.name ?? (v as number),
    },
    { title: 'Body', dataIndex: 'body', key: 'body' },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (_: unknown, record: Post) => (
          <TableActions
              record={record}
              onView={() => navigate(`/posts/${record.id}`)}
              onEdit={onEdit}
              onDelete={onDelete}
          />
      ),
    },
  ];

  return (
      <>
        <Table columns={columns} data={posts} hover />
        {hasMore && (
            <div className='w-posts-admin__pager'>
              <Button label='Load more' onClick={loadMore} />
            </div>
        )}
      </>
  );
};