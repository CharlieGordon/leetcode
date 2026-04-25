import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './IconButton.module.css';

type IconButtonProps = {
  children: ReactNode;
  label: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'>;

export function IconButton({ children, className, label, title, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={classNames(styles.iconButton, className)}
      title={title ?? label}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
