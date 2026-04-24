import { renderMarkdown } from '../lib/markdown';
import type { SolutionSource } from '../types';
import { EditableSolutionRunner } from './EditableSolutionRunner';
import { Tabs } from './ui/Tabs';
import styles from './SolutionViewer.module.css';

type SolutionViewerProps = {
  problemSlug: string;
  solutions: SolutionSource[];
  selectedSolutionId: string;
  onSolutionSelect: (solutionId: string) => void;
};

export function SolutionViewer({
  problemSlug,
  solutions,
  selectedSolutionId,
  onSolutionSelect,
}: SolutionViewerProps) {
  const selectedSolution =
    solutions.find((solution) => solution.id === selectedSolutionId) ?? solutions[0];

  return (
    <section className={styles.panel} aria-label="Solutions">
      <Tabs
        items={solutions.map((solution) => ({ id: solution.id, label: solution.name }))}
        selectedId={selectedSolution?.id}
        onSelect={onSolutionSelect}
        ariaLabel="Solution options"
      />

      {selectedSolution ? (
        <>
          <div className={styles.brief}>
            <p className={styles.summary}>{selectedSolution.summary}</p>
          </div>
          <EditableSolutionRunner problemSlug={problemSlug} solution={selectedSolution} />
          {selectedSolution.overviewMarkdown && (
            <section className={styles.overview} aria-label="AI overview">
              <h2 className={styles.overviewTitle}>AI Overview</h2>
              <div className={styles.overviewMarkdown}>
                {renderMarkdown(selectedSolution.overviewMarkdown, {
                  codeClassName: styles.markdownCode,
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className={styles.emptyState}>No solution source found.</p>
      )}
    </section>
  );
}
