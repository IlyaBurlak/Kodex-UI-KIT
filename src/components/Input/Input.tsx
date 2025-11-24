import { ChangeEvent, FC } from 'react';

import './input.scss';

import { classNames } from '@shared/classNames';

import type { InputProps } from '@/components';

export const Input: FC<InputProps> = ({
  size = 'medium',
  primary = false,
  className,
  onChange,
  ...props
}) => {
  const classList = [
    'ui-input',
    `ui-input--${size}`,
    primary ? 'ui-input--primary' : 'ui-input--secondary',
    props.disabled ? 'ui-input--disabled' : '',
  ].filter(Boolean);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    if (onChange) onChange(event);
  };

  return (
    <input
      className={classNames(...classList, className)}
      type='text'
      onChange={handleChange}
      {...props}
    />
  );
};
