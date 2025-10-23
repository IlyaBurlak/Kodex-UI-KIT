import { CSSProperties, FC } from 'react';
import './button.scss';
import { ButtonProps } from './Button.types.ts';

export const Button:FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}) => {
  const className = ['ui-button', `ui-button--${size}`, primary ? 'ui-button--primary' : 'ui-button--secondary'].join(' ');

  const style = backgroundColor ? { backgroundColor } as CSSProperties : undefined;

  return (
    <button type="button" className={className} style={style} {...props}>
      {label}
    </button>
  );
};