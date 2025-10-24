import { FC, useState } from 'react';

import type { RadioProps } from './Radio.types';

import './radio.scss';

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
  const currentChecked = isControlled ? (checked as boolean) : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setInternalChecked(next);
    onChange && onChange(next);
  };

  const classList = [
    'ui-radio',
    `ui-radio--${size}`,
    primary ? 'ui-radio--primary' : 'ui-radio--secondary',
    disabled ? 'ui-radio--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

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
