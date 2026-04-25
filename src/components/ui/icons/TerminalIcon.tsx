import { classNames } from '../../../lib/classNames';
import styles from './Icon.module.css';
import type { IconProps } from './types';

export function TerminalIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={classNames(styles.icon, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m5.5 7.5 4.5 4.5-4.5 4.5" />
      <path d="M12.75 16.5h5.75" />
    </svg>
  );
}
