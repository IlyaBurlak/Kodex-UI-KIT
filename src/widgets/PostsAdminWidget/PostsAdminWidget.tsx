import { FC } from 'react';

import { Loader } from '../../components';
import { usePostModals } from './hooks/usePostModals';
import { usePostsManagement } from './hooks/usePostsManagement';
import { ConfirmDeleteModal } from './WidgetComponents/ConfirmDeleteModal.tsx';
import { PostFormModal } from './WidgetComponents/PostFormModal.tsx';
import { PostsTable } from './WidgetComponents/PostsTable.tsx';
import { Toolbar } from './WidgetComponents/Toolbar.tsx';

import './postsAdmin.scss';

import { Post } from './types.ts';

export const PostsAdminWidget: FC<{ initialAuthorId?: number }> = ({ initialAuthorId }) => {
  const {
    posts,
    users,
    loading,
    hasMore,
    titleFilter,
    authorFilter,
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

  return (
    <div className='w-posts-admin'>
      <Toolbar
        authorFilter={authorFilter}
        titleFilter={titleFilter}
        users={users}
        onAuthorChange={setAuthorFilter}
        onNew={openCreateModal}
        onTitleChange={setTitleFilter}
      />

      <div className='w-posts-admin__content'>
        {loading ? (
          <Loader />
        ) : (
          <PostsTable
            hasMore={hasMore}
            loadMore={loadMorePosts}
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
