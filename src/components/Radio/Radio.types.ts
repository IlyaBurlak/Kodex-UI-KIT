import type { BaseProps } from '@components/shared/types';

export interface RadioProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  primary?: boolean;
  name?: string;
}
