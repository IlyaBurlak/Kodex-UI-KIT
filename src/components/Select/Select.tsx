import { FC } from 'react';

import './select.scss';

import type { SelectProps } from './Select.types';

export const Select: FC<SelectProps> = ({
  value,
  defaultValue,
  options,
  onChange,
  disabled = false,
  size = 'medium',
  className,
  placeholder,
  ...props
}) => {
  const classNames = ['ui-select', `ui-select--${size}`, disabled ? 'ui-select--disabled' : '']
    .join(' ')
    .trim();

  return (
    <select
      className={[classNames, className].filter(Boolean).join(' ')}
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...props}
    >
      {placeholder ? (
        <option disabled value="">
          {placeholder}
        </option>
      ) : null}

      {options.map((o) => (
        <option key={o.value} disabled={o.disabled} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};
