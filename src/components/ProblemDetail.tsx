import type { ProblemCatalogItem } from '../types';
import { ProblemDescription } from './ProblemDescription';
import { SolutionViewer } from './SolutionViewer';

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
    return <section className="empty-state">No problems found.</section>;
  }

  return (
    <section className="problem-detail" aria-label={`${problem.title} details`}>
      <header className="problem-header">
        <div className="problem-heading">
          <h2>{problem.title}</h2>
          <div className="tag-row" aria-label="Problem metadata">
            <span className={`difficulty-chip difficulty-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className="metadata-divider" aria-hidden="true" />
            {problem.tags.map((tag) => (
              <span className="topic-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="problem-actions" aria-label="Problem actions">
          <a className="leetcode-link" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
            Open on LeetCode
          </a>
        </div>
      </header>

      <div className="content-grid">
        <ProblemDescription description={problem.description} />
        <SolutionViewer
          solutions={problem.solutionSources}
          selectedSolutionId={selectedSolutionId}
          onSolutionSelect={onSolutionSelect}
        />
      </div>
    </section>
  );
}
