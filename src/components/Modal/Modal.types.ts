import type { BaseProps } from '@components/shared/types';
import type { ReactNode } from 'react';

export interface ModalProps extends BaseProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  closeLabel?: string;
  backdropClose?: boolean;
  children?: ReactNode;
}
