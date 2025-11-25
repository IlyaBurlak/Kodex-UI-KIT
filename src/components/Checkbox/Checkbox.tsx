import { FC } from 'react';

import './checkbox.scss';

import { classNames } from '@/shared/classNames';

import type { CheckboxProps } from '@/components';

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'medium',
  className,
  label,
  primary = false,
  ...props
}) => {
  const classes = classNames(
    {
      'ui-checkbox': true,
      [`ui-checkbox--${size}`]: true,
      'ui-checkbox--disabled': disabled,
      'ui-checkbox--primary': primary,
      'ui-checkbox--secondary': !primary,
    },
    className,
  );

  return (
    <label className={classes}>
      <input
        checked={checked}
        className='ui-checkbox__input'
        defaultChecked={defaultChecked}
        disabled={disabled}
        type='checkbox'
        onChange={(event) => onChange?.(event.target.checked)}
        {...props}
      />
      <span aria-hidden='true' className='ui-checkbox__box' />
      {label ? <span className='ui-checkbox__label'>{label}</span> : null}
    </label>
  );
};
