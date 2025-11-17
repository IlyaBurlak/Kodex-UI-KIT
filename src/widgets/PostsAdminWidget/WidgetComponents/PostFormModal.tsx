import { FC } from 'react';

import type { User } from '../../../store/usersSlice.ts';
import type { Post } from '../types.ts';
import { Button, Input, Modal, Select } from '../../../components';
import { getModalTitle, getUserOptions } from '../utils/helpers.ts';

export type PostFormModalProps = {
  isOpen: boolean;
  editing: Post | null;
  users: User[];
  onSave: (payload: Partial<Post>) => void;
  onClose: () => void;
  setEditing: (post: Post | null) => void;
};

export const PostFormModal: FC<PostFormModalProps> = ({
  isOpen,
  editing,
  users,
  onSave,
  onClose,
  setEditing,
}) => {
  if (!editing) return null;

  return (
    <Modal isOpen={isOpen} title={getModalTitle(editing.id)} onClose={onClose}>
      <div className='w-posts-admin__form'>
        <label>Title</label>
        <Input
          value={editing.title}
          onChange={(value) => setEditing({ ...editing, title: value })}
        />

        <label>Author</label>
        <Select
          options={getUserOptions(users)}
          value={String(editing.userId)}
          onChange={(value) => setEditing({ ...editing, userId: Number(value) })}
        />

        <label>Body</label>
        <Input value={editing.body} onChange={(value) => setEditing({ ...editing, body: value })} />

        <div className='w-posts-admin__form-actions'>
          <Button label='Save' primary onClick={() => onSave(editing)} />
          <Button label='Cancel' onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};
