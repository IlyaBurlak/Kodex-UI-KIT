import { FC } from 'react';

import './checkbox.scss';

import type { CheckboxProps } from './Checkbox.types';

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
  const classList = [
    'ui-checkbox',
    `ui-checkbox--${size}`,
    primary ? 'ui-checkbox--primary' : 'ui-checkbox--secondary',
    disabled ? 'ui-checkbox--disabled' : '',
  ].filter(Boolean);

  return (
    <label className={[...classList, className].filter(Boolean).join(' ')}>
      <input
        checked={checked}
        className='ui-checkbox__input'
        defaultChecked={defaultChecked}
        disabled={disabled}
        type='checkbox'
        onChange={(e) => onChange && onChange(e.target.checked)}
        {...props}
      />
      <span aria-hidden='true' className='ui-checkbox__box' />
      {label ? <span className='ui-checkbox__label'>{label}</span> : null}
    </label>
  );
};
