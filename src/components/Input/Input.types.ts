import { InputHTMLAttributes } from 'react';

import type { BaseProps } from '@/shared/types';

export interface InputProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  primary?: boolean;
}
