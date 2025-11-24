import { CSSProperties, FC, MouseEvent } from 'react';

import './button.scss';

import { ButtonProps } from '@/components';
import { classNames } from '@shared/classNames';

export const Button: FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  variant = 'default',
  backgroundColor,
  label,
  className: userClassName,
  disabled,
  onClick,
  ...props
}) => {
  const className = classNames(
    'ui-button',
    `ui-button--${size}`,
    {
      [`ui-button--${variant}`]: variant && variant !== 'default',
      'ui-button--primary': variant === 'default' && primary,
      'ui-button--secondary': variant === 'default' && !primary,
      'ui-button--disabled': disabled,
    },
    userClassName,
  );

  const style: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (typeof onClick === 'function') onClick();
  };

  return (
    <button
      aria-disabled={disabled}
      className={className}
      disabled={disabled}
      style={style}
      type='button'
      onClick={handleClick}
      {...props}
    >
      {label}
    </button>
  );
};
