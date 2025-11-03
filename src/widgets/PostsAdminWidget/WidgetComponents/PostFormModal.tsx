import { FC } from 'react';
import { Button, Input, Modal, Select } from '../../../components';
import type { Post } from '../types.ts';
import type { User } from '../../../store/usersSlice.ts';
import { getModalTitle, getUserOptions } from '../utils/helpers.ts';

export const PostFormModal: FC<{
  isOpen: boolean;
  editing: Post | null;
  users: User[];
  onSave: (payload: Partial<Post>) => void;
  onClose: () => void;
  setEditing: (p: Post | null) => void;
}> = ({ isOpen, editing, users, onSave, onClose, setEditing }) => {
  if (!editing) return null;

  return (
      <Modal
          isOpen={isOpen}
          title={getModalTitle(editing.id)}
          onClose={onClose}
      >
        <div className='w-posts-admin__form'>
          <label>Title</label>
          <Input
              value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })}
          />

          <label>Author</label>
          <Select
              options={getUserOptions(users)}
              value={String(editing.userId)}
              onChange={(v) => setEditing({ ...editing, userId: Number(v) })}
          />

          <label>Body</label>
          <Input
              value={editing.body}
              onChange={(v) => setEditing({ ...editing, body: v })}
          />

          <div className='w-posts-admin__form-actions'>
            <Button label='Save' primary onClick={() => onSave(editing)} />
            <Button label='Cancel' onClick={onClose} />
          </div>
        </div>
      </Modal>
  );
};