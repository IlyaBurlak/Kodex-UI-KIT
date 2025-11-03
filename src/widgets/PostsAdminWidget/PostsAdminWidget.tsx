import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '../../store/usersSlice';
import { Button, Input, Loader, Modal, Select, Table } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addPost,
  editPost,
  fetchPosts,
  removePost,
  selectPosts,
  selectPostsLoading,
} from '../../store/postsSlice';
import { fetchUsers, selectUsers } from '../../store/usersSlice';

import './postsAdmin.scss';

type Post = { id: number; userId: number; title: string; body: string };

export const PostsAdminWidget: FC<{ initialAuthorId?: number }> = ({ initialAuthorId }) => {
  const LIMIT = 20;
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const postsLoading = useAppSelector(selectPostsLoading);
  const users = useAppSelector(selectUsers);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState<string | undefined>(
    initialAuthorId ? String(initialAuthorId) : undefined,
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchUsers()).unwrap();
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    loadUsers();
  }, [dispatch]);

  useEffect(() => {
    if (initialAuthorId) setAuthorFilter(String(initialAuthorId));
  }, [initialAuthorId]);

  const load = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = { _limit: LIMIT, _start: reset ? 0 : page * LIMIT };
        if (authorFilter) params.userId = authorFilter;
        if (titleFilter) params.title_like = titleFilter;
        const data = (await dispatch(fetchPosts(params)).unwrap()) as Post[];
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, page, authorFilter, titleFilter],
  );

  useEffect(() => {
    setPage(0);
    const isFilterEmpty = !titleFilter && !authorFilter;
    if (isFilterEmpty && posts.length > 0) {
      setHasMore(posts.length >= LIMIT);
      return;
    }
    load(true);
  }, [titleFilter, authorFilter, posts.length, load]);

  useEffect(() => {
    if (page === 0) return;
    load(false);
  }, [page, load]);

  const columns = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id' },
      { title: 'Title', dataIndex: 'title' },
      {
        title: 'Author',
        dataIndex: 'userId',
        render: (v: unknown) =>
          users.find((u: User) => u.id === (v as number))?.name ?? (v as number),
      },
      { title: 'Body', dataIndex: 'body' },
      {
        title: 'Actions',
        dataIndex: 'id',
        render: (_: unknown, record: Post) => (
          <div className='posts-actions'>
            <Button label='View' primary onClick={() => navigate(`/posts/${record.id}`)} />
            <Button
              label='Edit'
              onClick={() => {
                setEditing(record);
                setModalOpen(true);
              }}
            />
            <Button label='Delete' variant='delete' onClick={() => setConfirmDelete(record)} />
          </div>
        ),
      },
    ],
    [users, navigate],
  );

  const openCreate = () => {
    setEditing({ id: 0, userId: users[0]?.id ?? 1, title: '', body: '' });
    setModalOpen(true);
  };

  const save = async (payload: Partial<Post>) => {
    if (!editing) return;
    setLoading(true);
    try {
      if (editing.id && editing.id > 0) {
        await dispatch(editPost({ id: editing.id, payload })).unwrap();
      } else {
        await dispatch(addPost(payload)).unwrap();
      }
    } catch (err) {
      console.error('Failed to save post', err);
    } finally {
      setLoading(false);
      setModalOpen(false);
      setEditing(null);
    }
  };

  const doDelete = async (post: Post) => {
    setLoading(true);
    try {
      await dispatch(removePost(post.id)).unwrap();
    } catch (err) {
      console.error('Failed to delete post', err);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  return (
    <div className='w-posts-admin'>
      <div className='w-posts-admin__toolbar'>
        <Input placeholder='Search title' value={titleFilter} onChange={(v) => setTitleFilter(v)} />
        <Select
          options={[
            { label: 'All', value: '' },
            ...users.map((u: User) => ({ label: u.name, value: String(u.id) })),
          ]}
          value={authorFilter}
          onChange={(v) => setAuthorFilter(v || undefined)}
        />
        <Button label='New post' primary onClick={openCreate} />
      </div>

      <div className='w-posts-admin__content'>
        {postsLoading || loading ? <Loader /> : <Table columns={columns} data={posts} hover />}
      </div>

      {hasMore && (
        <div className='w-posts-admin__pager'>
          <Button label='Load more' onClick={() => setPage((p) => p + 1)} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editing?.id ? 'Edit post' : 'Create post'}
        onClose={() => setModalOpen(false)}
      >
        {editing && (
          <div className='w-posts-admin__form'>
            <label>Title</label>
            <Input value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <label>Author</label>
            <Select
              options={users.map((u: User) => ({ label: u.name, value: String(u.id) }))}
              value={String(editing.userId)}
              onChange={(v) => setEditing({ ...editing, userId: Number(v) })}
            />
            <label>Body</label>
            <Input value={editing.body} onChange={(v) => setEditing({ ...editing, body: v })} />
            <div className='w-posts-admin__form-actions'>
              <Button label='Save' primary onClick={() => save(editing)} />
              <Button label='Cancel' onClick={() => setModalOpen(false)} />
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!confirmDelete} title='Confirm delete' onClose={() => setConfirmDelete(null)}>
        <div className='w-posts-admin__confirm'>
          <p>Delete post #{confirmDelete?.id}?</p>
          <div>
            <Button
              label='Delete'
              variant='delete'
              onClick={() => confirmDelete && doDelete(confirmDelete)}
            />
            <Button label='Cancel' onClick={() => setConfirmDelete(null)} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
