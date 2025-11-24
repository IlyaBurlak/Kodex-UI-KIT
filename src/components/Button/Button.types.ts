import type { BaseProps } from '@components/shared/types';

export interface ButtonProps extends BaseProps {
  primary?: boolean;
  variant?: 'default' | 'delete';
  backgroundColor?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}
