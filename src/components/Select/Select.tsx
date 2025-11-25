import { FC } from 'react';

import './select.scss';

import { classNames } from '@/shared/classNames';

import type { SelectProps } from '@/components';

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
  const classes = classNames(
    {
      'ui-select': true,
      [`ui-select--${size}`]: true,
      'ui-select--disabled': disabled,
      'ui-select--primary': primary,
      'ui-select--secondary': !primary,
    },
    className,
  );

  return (
    <select
      className={classes}
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
      onChange={(event) => onChange && onChange(event.target.value)}
      {...props}
    >
      {placeholder ? (
        <option disabled value=''>
          {placeholder}
        </option>
      ) : null}

      {options.map((option) => (
        <option key={option.value} disabled={option.disabled} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
