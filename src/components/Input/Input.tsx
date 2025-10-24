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
      className={[...classList, className].filter(Boolean).join(' ')}
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
