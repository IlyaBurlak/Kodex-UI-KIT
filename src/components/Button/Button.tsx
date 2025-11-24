import { CSSProperties, FC, MouseEvent } from 'react';

import './button.scss';

import { ButtonProps } from '@/components';
import { classNames } from '@shared/classNames';

export const Button: FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  variant = 'default',
  backgroundColor,
  className: userClassName,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const className = classNames(
    'ui-button',
    `ui-button--${size}`,
    {
      [`ui-button--${variant}`]: variant && variant !== 'default',
      'ui-button--primary': variant === 'default' && primary,
      'ui-button--secondary': variant === 'default' && !primary,
      'ui-button--disabled': props.disabled,
    },
    userClassName,
  );

  const style: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (props.disabled) {
      event.preventDefault();
      return;
    }
    if (typeof onClick === 'function') onClick(event);
  };

  return (
    <button {...props} className={className} style={style} type={type} onClick={handleClick}>
      {children}
    </button>
  );
};
