import { Button, Input, Modal, Select } from '@components';
import { User } from '@store/UsersSlice/usersTypes';
import { getModalTitle, getUserSelectOptions } from '@widgets/PostsAdminWidget/utils/helpers';
import { PostValidationErrors, validatePost } from '@widgets/PostsAdminWidget/utils/validation';
import { FC, useState } from 'react';

import type { Post } from '@widgets/PostsAdminWidget/types';

export type PostFormModalProps = {
  isOpen: boolean;
  editing: Post | null;
  users: User[];
  onSave: (payload: Partial<Post>) => Promise<unknown> | void;
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

  const [errors, setErrors] = useState<PostValidationErrors>({});

  const handleSave = () => {
    const validation = validatePost(editing);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    onSave(editing);
  };

  return (
    <Modal isOpen={isOpen} title={getModalTitle(editing.id)} onClose={onClose}>
      <div className='w-posts-admin__form'>
        <label>Title</label>
        <Input
          value={editing.title}
          onChange={(value) => {
            setEditing({ ...editing, title: value });
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
        />
        {errors.title && <div className='w-posts-admin__field-error'>{errors.title}</div>}

        <label>Author</label>
        <Select
          options={getUserSelectOptions(users)}
          value={String(editing.userId)}
          onChange={(value) => setEditing({ ...editing, userId: Number(value) })}
        />
        {errors.user && <div className='w-posts-admin__field-error'>{errors.user}</div>}

        <label>Body</label>
        <Input
          value={editing.body}
          onChange={(value) => {
            setEditing({ ...editing, body: value });
            setErrors((prev) => ({ ...prev, body: undefined }));
          }}
        />
        {errors.body && <div className='w-posts-admin__field-error'>{errors.body}</div>}

        <div className='w-posts-admin__form-actions'>
          <Button label='Save' primary onClick={handleSave} />
          <Button label='Cancel' onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};
