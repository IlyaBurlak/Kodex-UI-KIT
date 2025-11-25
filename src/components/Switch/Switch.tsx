import { FC } from 'react';

import './switch.scss';

import { classNames } from '@/shared/classNames';

import type { SwitchProps } from '@/components';

export const Switch: FC<SwitchProps> = ({
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
      'ui-switch': true,
      [`ui-switch--${size}`]: true,
      'ui-switch--disabled': disabled,
      'ui-switch--primary': primary,
      'ui-switch--secondary': !primary,
    },
    className,
  );

  return (
    <label className={classes}>
      <input
        checked={checked}
        className='ui-switch__input'
        defaultChecked={defaultChecked}
        disabled={disabled}
        role='switch'
        type='checkbox'
        onChange={(event) => onChange && onChange(event.target.checked)}
        {...props}
      />
      <span aria-hidden='true' className='ui-switch__track'>
        <span className='ui-switch__thumb' />
      </span>
      {label ? <span className='ui-switch__label'>{label}</span> : null}
    </label>
  );
};
