import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './Tag.module.css';

export type TagTone = 'topic' | 'difficultyEasy' | 'difficultyMedium' | 'difficultyHard';

type TagProps = {
  tone?: TagTone;
  className?: string;
} & ComponentPropsWithoutRef<'span'>;

export function Tag({ tone = 'topic', className, children, ...props }: TagProps) {
  return (
    <span className={classNames(styles.tag, styles[tone], className)} {...props}>
      {children}
    </span>
  );
}
