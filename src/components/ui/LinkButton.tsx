import type { AnchorHTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './Button.module.css';

type LinkButtonVariant = 'external';

type LinkButtonProps = {
  variant?: LinkButtonVariant;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function LinkButton({ variant = 'external', className, ...props }: LinkButtonProps) {
  return (
    <a
      className={classNames(styles.linkButton, styles[variant], className)}
      {...props}
    />
  );
}
