import { highlightTypeScript } from '../lib/highlight';
import type { SolutionSource } from '../types';

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
    <section className="solution-panel" aria-label="Solutions">
      <div className="solution-tabs" role="tablist" aria-label="Solution options">
        {solutions.map((solution) => (
          <button
            key={solution.id}
            className={solution.id === selectedSolution?.id ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={solution.id === selectedSolution?.id}
            onClick={() => onSolutionSelect(solution.id)}
          >
            {solution.name}
          </button>
        ))}
      </div>

      {selectedSolution ? (
        <>
          <div className="solution-brief">
            <p className="solution-summary">{selectedSolution.summary}</p>
          </div>
          <div className="code-frame">
            <div className="code-toolbar" aria-hidden="true">
              <span className="code-file-name">{selectedSolution.id}.ts</span>
              <span className="code-language">TypeScript</span>
            </div>
            <pre className="code-viewer">
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
        <p className="empty-state">No solution source found.</p>
      )}
    </section>
  );
}
