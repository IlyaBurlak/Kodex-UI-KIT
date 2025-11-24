import { FC } from 'react';

import { usePostModals } from './hooks/usePostModals';
import { usePostsManagement } from './hooks/usePostsManagement';
import { ConfirmDeleteModal } from './WidgetComponents/ConfirmDeleteModal';
import { PostFormModal } from './WidgetComponents/PostFormModal';
import { PostsTable } from './WidgetComponents/PostsTable';
import { Toolbar } from './WidgetComponents/Toolbar';

import './postsAdmin.scss';

import { Loader } from '@components';
import { ErrorDisplay } from '@widgets/ErrorWidget/ErrorDisplay';

import { Post } from './types.ts';

export type PostsAdminWidgetProps = { initialAuthorId?: number };

export const PostsAdminWidget: FC<PostsAdminWidgetProps> = ({ initialAuthorId }) => {
  const {
    posts,
    users,
    loading,
    loadingMore,
    hasMore,
    titleFilter,
    authorFilter,
    postsError,
    usersError,
    setTitleFilter,
    setAuthorFilter,
    loadMorePosts,
    savePost,
    deletePost,
  } = usePostsManagement(initialAuthorId);

  const {
    isModalOpen,
    editing,
    confirmDelete,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    closeDeleteModal,
    setEditing,
  } = usePostModals(users);

  const handleSave = async (payload: Partial<Post>) => {
    await savePost(payload, editing);
    closeModal();
  };

  const handleDelete = async (post: Post) => {
    await deletePost(post);
    closeDeleteModal();
  };

  if (postsError || usersError) {
    return (
      <ErrorDisplay
        className='posts-admin-error'
        message={postsError || usersError}
        title='Ошибка загрузки'
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleTitleChange = (value?: string) => {
    setTitleFilter(value || '');
  };

  const handleAuthorChange = (value?: string) => {
    setAuthorFilter(value || '');
  };

  return (
    <div className='w-posts-admin'>
      <Toolbar
        authorFilter={authorFilter}
        titleFilter={titleFilter}
        users={users}
        onAuthorChange={handleAuthorChange}
        onNew={openCreateModal}
        onTitleChange={handleTitleChange}
      />

      <div className='w-posts-admin__content'>
        {loading ? (
          <Loader />
        ) : (
          <PostsTable
            hasMore={hasMore}
            loadMore={loadMorePosts}
            loadingMore={loadingMore}
            posts={posts}
            users={users}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
          />
        )}
      </div>

      <PostFormModal
        editing={editing}
        isOpen={isModalOpen}
        setEditing={setEditing}
        users={users}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        confirmDelete={confirmDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};
