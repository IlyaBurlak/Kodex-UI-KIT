import type { BaseProps } from '../shared/types';

export interface SwitchProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  primary?: boolean;
}
