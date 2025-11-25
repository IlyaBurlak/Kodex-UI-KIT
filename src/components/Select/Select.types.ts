import type { BaseProps } from '@/shared/types';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  primary?: boolean;
  placeholder?: string;
}
