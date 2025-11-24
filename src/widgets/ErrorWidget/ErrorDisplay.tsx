import { FC, ReactNode } from 'react';

import './ErrorDisplay.scss';

import { Button } from '@components';

export type ErrorDisplayProps = {
  title: string;
  message: ReactNode;
  onRetry?: () => void;
  retryButtonLabel?: string;
  showRetryButton?: boolean;
  className?: string;
};

export const ErrorDisplay: FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  retryButtonLabel = 'Попробовать снова',
  showRetryButton = true,
  className = '',
}) => {
  return (
    <div className={`error-display ${className}`}>
      <h3 className='error-display__title'>{title}</h3>
      <p className='error-display__message'>{message}</p>
      {showRetryButton && onRetry && (
        <Button
          className='error-display__button'
          label={retryButtonLabel}
          primary
          onClick={onRetry}
        />
      )}
    </div>
  );
};
