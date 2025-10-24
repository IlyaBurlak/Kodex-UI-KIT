import type { Size } from '../shared/types';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: Size;
  className?: string;
  label?: string;
  primary?: boolean;
}
