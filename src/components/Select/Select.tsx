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
  primary = false,
  className,
  placeholder,
  ...props
}) => {
  const classList = [
    'ui-select',
    `ui-select--${size}`,
    primary ? 'ui-select--primary' : 'ui-select--secondary',
    disabled ? 'ui-select--disabled' : '',
  ].filter(Boolean);

  return (
    <select
      className={[...classList, className].filter(Boolean).join(' ')}
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...props}
    >
      {placeholder ? (
        <option disabled value=''>
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
