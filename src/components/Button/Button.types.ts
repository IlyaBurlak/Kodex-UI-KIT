import type { Size } from '../shared/types';

export interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: Size;
  label: string;
  className?: string;
  onClick?: () => void;
}
