import { ChangeEvent, FC } from 'react';

import './input.scss';

import { classNames } from '@/shared/classNames';

import type { InputProps } from '@/components';

export const Input: FC<InputProps> = ({
  size = 'medium',
  primary = false,
  className,
  onChange,
  ...props
}) => {
  const classes = classNames(
    {
      'ui-input': true,
      [`ui-input--${size}`]: true,
      'ui-input--disabled': !!props.disabled,
      'ui-input--primary': primary,
      'ui-input--secondary': !primary,
    },
    className,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    if (onChange) onChange(event);
  };

  return <input className={classes} type='text' onChange={handleChange} {...props} />;
};
