import { FC } from 'react';

import { Button, Input } from '../../../components';

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  buttonLabel?: string;
}

export const CommentForm: FC<CommentFormProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'New comment',
  buttonLabel = 'Add',
}) => (
  <div className='post-comments__controls'>
    <Input placeholder={placeholder} value={value} onChange={onChange} />
    <Button disabled={!value.trim()} label={buttonLabel} primary onClick={onSubmit} />
  </div>
);
