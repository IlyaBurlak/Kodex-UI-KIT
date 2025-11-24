import { FC } from 'react';

import './input.scss';

import { classNames } from '@shared/classNames';

import type { InputProps } from '@/components';

export const Input: FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  size = 'medium',
  primary = false,
  className,
  ...props
}) => {
  const classList = [
    'ui-input',
    `ui-input--${size}`,
    primary ? 'ui-input--primary' : 'ui-input--secondary',
    disabled ? 'ui-input--disabled' : '',
  ].filter(Boolean);

  return (
    <input
      className={classNames(...classList, className)}
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onChange={(event) => onChange && onChange(event.target.value)}
      {...props}
    />
  );
};
