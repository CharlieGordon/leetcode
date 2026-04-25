import { classNames } from '../../../lib/classNames';
import styles from './Icon.module.css';
import type { IconProps } from './types';

export function SpinnerIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={classNames(styles.icon, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 4.75a7.25 7.25 0 1 1-6.39 3.82" />
    </svg>
  );
}
