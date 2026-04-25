import { classNames } from '../../../lib/classNames';
import styles from './Icon.module.css';
import type { IconProps } from './types';

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={classNames(styles.icon, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m7.25 7.25 9.5 9.5" />
      <path d="m16.75 7.25-9.5 9.5" />
    </svg>
  );
}
