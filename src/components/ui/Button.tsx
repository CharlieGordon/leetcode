import type { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './Button.module.css';

type ButtonVariant = 'plain' | 'sidebarToggle' | 'tab';

type ButtonProps = {
  variant?: ButtonVariant;
  isActive?: boolean;
  iconOnly?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'plain',
  isActive = false,
  iconOnly = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        isActive && styles.active,
        iconOnly && styles.iconOnly,
        className,
      )}
      type={type}
      {...props}
    />
  );
}
