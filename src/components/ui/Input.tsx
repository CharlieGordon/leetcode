import type { InputHTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './Input.module.css';

type InputProps = {
  id: string;
  label: string;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ id, label, containerClassName, className, ...props }: InputProps) {
  return (
    <div className={classNames(styles.stack, containerClassName)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} className={classNames(styles.input, className)} {...props} />
    </div>
  );
}
