import type { ReactNode } from 'react';
import type { BaseProps } from '../shared/types';

export interface ModalProps extends BaseProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  closeLabel?: string;
  backdropClose?: boolean;
  children?: ReactNode;
}
