import { highlightTypeScript } from '../lib/highlight';
import type { SolutionSource } from '../types';
import { Tabs } from './ui/Tabs';
import styles from './SolutionViewer.module.css';

type SolutionViewerProps = {
  solutions: SolutionSource[];
  selectedSolutionId: string;
  onSolutionSelect: (solutionId: string) => void;
};

export function SolutionViewer({
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
          <div className={styles.codeFrame}>
            <div className={styles.codeToolbar} aria-hidden="true">
              <span className={styles.codeFileName}>{selectedSolution.id}.ts</span>
              <span className={styles.codeLanguage}>TypeScript</span>
            </div>
            <pre className={styles.codeViewer}>
              <code
                className="language-typescript"
                dangerouslySetInnerHTML={{
                  __html: highlightTypeScript(selectedSolution.source),
                }}
              />
            </pre>
          </div>
        </>
      ) : (
        <p className={styles.emptyState}>No solution source found.</p>
      )}
    </section>
  );
}
