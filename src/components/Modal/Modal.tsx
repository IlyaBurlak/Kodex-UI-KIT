import { FC, useEffect } from 'react';

import './modal.scss';

import { ModalProps } from './Modal.types.ts';

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeLabel = 'Close modal',
  backdropClose = true,
  className: userClassName,
  size = 'medium',
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const close = () => {
    onClose?.();
  };

  const handleBackdrop = (event: React.MouseEvent) => {
    if (!backdropClose) return;
    if (event.target === event.currentTarget) close();
  };

  const open = Boolean(isOpen);

  const baseClass = ['ui-modal', `ui-modal--${size}`].join(' ');
  const className = [baseClass, userClassName].filter(Boolean).join(' ');

  if (!open) return null;

  return (
    <div aria-modal='true' className={className} role='dialog' {...props} onClick={handleBackdrop}>
      <div className='ui-modal__overlay'>
        <div className='ui-modal__content' role='document'>
          <div className='ui-modal__header'>
            <div className='ui-modal__title'>{title}</div>
            <button
              aria-label={closeLabel}
              className='ui-modal__close'
              type='button'
              onClick={close}
            >
              ×
            </button>
          </div>
          <div className='ui-modal__body'>{children}</div>
        </div>
      </div>
    </div>
  );
};
