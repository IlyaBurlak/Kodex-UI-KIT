import { Button, Input } from '@components';
import { FC } from 'react';

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
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
    <Button disabled={!value.trim()} primary onClick={onSubmit}>
      {buttonLabel}
    </Button>
  </div>
);
