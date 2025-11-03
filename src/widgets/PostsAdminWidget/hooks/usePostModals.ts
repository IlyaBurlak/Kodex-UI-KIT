import { useState } from 'react';

import { User } from '../../../store/usersSlice.ts';
import { Post } from '../types';

export const usePostModals = (users: User[]) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);

  const openCreateModal = () => {
    setEditing({ id: 0, userId: users[0]?.id ?? 1, title: '', body: '' });
    setModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditing(post);
    setModalOpen(true);
  };

  const openDeleteModal = (post: Post) => {
    setConfirmDelete(post);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const closeDeleteModal = () => {
    setConfirmDelete(null);
  };

  return {
    isModalOpen,
    editing,
    confirmDelete,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    closeDeleteModal,
    setEditing,
  };
};
