import { FC, useState } from 'react';

import type { RadioProps } from './Radio.types';

import './radio.scss';

import { classNames } from '@shared/classNames';

export const Radio: FC<RadioProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'medium',
  className = '',
  label,
  primary = false,
  name,
}) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(!!defaultChecked);

  const isControlled = typeof checked === 'boolean';
  const currentChecked: boolean = isControlled ? Boolean(checked) : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    if (!isControlled) setInternalChecked(next);
    onChange && onChange(next);
  };

  const classList = classNames(
    'ui-radio',
    `ui-radio--${size}`,
    primary ? 'ui-radio--primary' : 'ui-radio--secondary',
    disabled && 'ui-radio--disabled',
    className,
  );

  return (
    <label className={classList}>
      <input
        checked={currentChecked}
        className='ui-radio__native'
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        type='radio'
        onChange={handleChange}
      />

      <span aria-hidden='true' className='ui-radio__box'>
        <span className='ui-radio__dot' />
      </span>

      {label && <span className='ui-radio__label'>{label}</span>}
    </label>
  );
};
