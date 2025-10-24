import type { Size } from '../shared/types';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  size?: Size;
  primary?: boolean;
  className?: string;
}
