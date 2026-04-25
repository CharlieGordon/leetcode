import { classNames } from '../../../lib/classNames';
import styles from './Icon.module.css';
import type { IconProps } from './types';

export function PlayIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={classNames(styles.icon, styles.filled, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8.5 6.75v10.5L17 12 8.5 6.75Z" />
    </svg>
  );
}
