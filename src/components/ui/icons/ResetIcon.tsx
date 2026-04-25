import { classNames } from '../../../lib/classNames';
import styles from './Icon.module.css';
import type { IconProps } from './types';

export function ResetIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={classNames(styles.icon, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M6.5 8.25H12a5.75 5.75 0 1 1-4.07 9.82" />
      <path d="m6.5 8.25 3.25-3.25" />
      <path d="m6.5 8.25 3.25 3.25" />
    </svg>
  );
}
