import { CSSProperties, FC } from 'react';

import './button.scss';

import { ButtonProps } from './Button.types.ts';

export const Button: FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  className: userClassName,
  ...props
}) => {
  const baseClass = [
    'ui-button',
    `ui-button--${size}`,
    primary ? 'ui-button--primary' : 'ui-button--secondary',
  ].join(' ');

  const className = [baseClass, userClassName].filter(Boolean).join(' ');

  const style = backgroundColor ? ({ backgroundColor } as CSSProperties) : undefined;

  return (
    <button className={className} style={style} type='button' {...props}>
      {label}
    </button>
  );
};
