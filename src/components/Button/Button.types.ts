import { ButtonHTMLAttributes } from 'react';

import type { BaseProps } from '@components/shared/types';

export interface ButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  primary?: boolean;
  variant?: 'default' | 'delete';
  backgroundColor?: string;
}
