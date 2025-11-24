import { FC } from 'react';

import './loader.scss';

import { classNames } from '@shared/classNames';

import type { LoaderProps } from '@/components';

export const Loader: FC<LoaderProps> = ({ size = 'medium', className }) => {
  return <div className={classNames('ui-loader', `ui-loader--${size}`, className)} />;
};
