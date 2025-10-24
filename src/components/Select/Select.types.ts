import type { Size } from '../shared/types';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: Size;
  primary?: boolean;
  className?: string;
  placeholder?: string;
}
