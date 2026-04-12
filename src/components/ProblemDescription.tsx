import { renderMarkdown } from '../lib/markdown';
import styles from './ProblemDescription.module.css';

type ProblemDescriptionProps = {
  description: string;
};

export function ProblemDescription({ description }: ProblemDescriptionProps) {
  return (
    <article className={styles.panel}>
      {renderMarkdown(description, { codeClassName: styles.markdownCode })}
    </article>
  );
}
