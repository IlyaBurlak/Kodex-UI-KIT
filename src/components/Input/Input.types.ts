import type { BaseProps } from '../shared/types';

export interface InputProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  primary?: boolean;
}
