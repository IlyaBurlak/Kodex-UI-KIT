import { CSSProperties, FC, MouseEvent } from 'react';

import './button.scss';

import { ButtonProps } from './Button.types.ts';

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
  const classes: string[] = ['ui-button', `ui-button--${size}`];
  if (variant && variant !== 'default') {
    classes.push(`ui-button--${variant}`);
  } else {
    classes.push(primary ? 'ui-button--primary' : 'ui-button--secondary');
  }

  const className = [classes.join(' '), userClassName].filter(Boolean).join(' ');

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
