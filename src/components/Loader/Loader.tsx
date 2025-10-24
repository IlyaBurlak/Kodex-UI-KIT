import { FC } from 'react';

import './loader.scss';

import type { LoaderProps } from './Loader.types';

export const Loader: FC<LoaderProps> = ({ size = 'medium', className }) => {
  return <div className={[`ui-loader`, `ui-loader--${size}`, className].filter(Boolean).join(' ')} />;
};
