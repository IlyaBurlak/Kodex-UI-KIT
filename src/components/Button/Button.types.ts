import type { BaseProps } from '../shared/types';

export interface ButtonProps extends BaseProps {
  primary?: boolean;
  backgroundColor?: string;
  label: string;
  onClick?: () => void;
}
