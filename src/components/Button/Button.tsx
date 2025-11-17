import { CSSProperties, FC } from 'react';

import './button.scss';

import { ButtonProps } from './Button.types.ts';

export const Button: FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  variant = 'default',
  backgroundColor,
  label,
  className: userClassName,
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

  return (
    <button className={className} style={style} type='button' {...props}>
      {label}
    </button>
  );
};
