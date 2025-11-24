import { Button, Modal } from '@components';
import { FC } from 'react';

import type { Post } from '@widgets/PostsAdminWidget/types';

export type ConfirmDeleteModalProps = {
  confirmDelete: Post | null;
  onConfirm: (post: Post) => void;
  onCancel: () => void;
};

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  confirmDelete,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={!!confirmDelete} title='Confirm delete' onClose={onCancel}>
      <div className='w-posts-admin__confirm'>
        <p>Delete post #{confirmDelete?.id}?</p>
        <div>
          <Button variant='delete' onClick={() => confirmDelete && onConfirm(confirmDelete)}>
            Delete
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};
