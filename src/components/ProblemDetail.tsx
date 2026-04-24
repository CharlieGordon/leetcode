import type { ProblemCatalogItem } from '../types';
import { ProblemDescription } from './ProblemDescription';
import { SolutionViewer } from './SolutionViewer';
import { LinkButton } from './ui/LinkButton';
import { TagList } from './ui/TagList';
import { Title } from './ui/Title';
import styles from './ProblemDetail.module.css';

type ProblemDetailProps = {
  problem?: ProblemCatalogItem;
  selectedSolutionId: string;
  onSolutionSelect: (solutionId: string) => void;
};

export function ProblemDetail({
  problem,
  selectedSolutionId,
  onSolutionSelect,
}: ProblemDetailProps) {
  if (!problem) {
    return <section className={styles.emptyState}>No problems found.</section>;
  }

  return (
    <section className={styles.detail} aria-label={`${problem.title} details`}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <Title as="h2" variant="problem">{problem.title}</Title>
          <div className={styles.metaRow}>
            <TagList difficulty={problem.difficulty} tags={problem.tags} aria-label="Problem metadata" />
            {problem.leetcodeUrl && (
              <LinkButton href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
                Open on LeetCode
              </LinkButton>
            )}
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <ProblemDescription description={problem.description} />
        <SolutionViewer
          problemSlug={problem.slug}
          solutions={problem.solutionSources}
          selectedSolutionId={selectedSolutionId}
          onSolutionSelect={onSolutionSelect}
        />
      </div>
    </section>
  );
}
