import { FC } from 'react';

import './input.scss';

import type { InputProps } from './Input.types';

export const Input: FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  size = 'medium',
  className,
  ...props
}) => {
  const classNames = ['ui-input', `ui-input--${size}`, disabled ? 'ui-input--disabled' : '']
    .join(' ')
    .trim();

  return (
    <input
      className={[classNames, className].filter(Boolean).join(' ')}
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...props}
    />
  );
};
