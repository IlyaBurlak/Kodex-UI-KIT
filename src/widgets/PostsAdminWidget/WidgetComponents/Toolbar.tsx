import { FC } from 'react';
import type { User } from '../../../store/usersSlice.ts';
import { Button, Input, Select } from '../../../components';

export const Toolbar: FC<{
  titleFilter: string;
  onTitleChange: (v: string) => void;
  authorFilter?: string;
  onAuthorChange: (v?: string) => void;
  users: User[];
  onNew: () => void;
}> = ({ titleFilter, onTitleChange, authorFilter, onAuthorChange, users, onNew }) => {
  return (
    <div className='w-posts-admin__toolbar'>
      <Input placeholder='Search title' value={titleFilter} onChange={(v) => onTitleChange(v)} />
      <Select
        options={[{ label: 'All', value: '' }, ...users.map((u) => ({ label: u.name, value: String(u.id) }))]}
        value={authorFilter}
        onChange={(v) => onAuthorChange(v || undefined)}
      />
      <Button label='New post' primary onClick={onNew} />
    </div>
  );
};
