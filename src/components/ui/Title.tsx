import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '../../lib/classNames';
import styles from './Title.module.css';

type TitleElement = 'h1' | 'h2' | 'h3' | 'h4';
type TitleVariant = 'brand' | 'problem';

type TitleProps<TElement extends TitleElement = 'h2'> = {
  as?: TElement;
  variant: TitleVariant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>;

export function Title<TElement extends TitleElement = 'h2'>({
  as,
  variant,
  children,
  className,
  ...props
}: TitleProps<TElement>) {
  const Component = as ?? 'h2';

  return (
    <Component className={classNames(styles.title, styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
