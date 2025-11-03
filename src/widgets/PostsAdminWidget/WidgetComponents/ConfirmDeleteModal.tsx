import { FC } from 'react';
import { Button, Modal } from '../../../components';
import type { Post } from '../types.ts';

export const ConfirmDeleteModal: FC<{
  confirmDelete: Post | null;
  onConfirm: (p: Post) => void;
  onCancel: () => void;
}> = ({ confirmDelete, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={!!confirmDelete} title='Confirm delete' onClose={onCancel}>
      <div className='w-posts-admin__confirm'>
        <p>Delete post #{confirmDelete?.id}?</p>
        <div>
          <Button label='Delete' variant='delete' onClick={() => confirmDelete && onConfirm(confirmDelete)} />
          <Button label='Cancel' onClick={onCancel} />
        </div>
      </div>
    </Modal>
  );
};
