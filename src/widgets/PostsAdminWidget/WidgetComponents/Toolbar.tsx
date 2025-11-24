import { Button, Input, Select } from '@components';
import { User } from '@store/UsersSlice/usersTypes';
import { FC } from 'react';

export type ToolbarProps = {
  titleFilter: string;
  onTitleChange: (value: string) => void;
  authorFilter?: string;
  onAuthorChange: (value?: string) => void;
  users: User[];
  onNew: () => void;
};

export const Toolbar: FC<ToolbarProps> = ({
  titleFilter,
  onTitleChange,
  authorFilter,
  onAuthorChange,
  users,
  onNew,
}) => {
  return (
    <div className='w-posts-admin__toolbar'>
      <Input
        placeholder='Search title'
        value={titleFilter}
        onChange={(value) => onTitleChange(value)}
      />
      <Select
        options={[
          { label: 'All', value: '' },
          ...users.map((user) => ({ label: user.name, value: String(user.id) })),
        ]}
        value={authorFilter}
        onChange={(value) => onAuthorChange(value || undefined)}
      />
      <Button label='New post' primary onClick={onNew} />
    </div>
  );
};
