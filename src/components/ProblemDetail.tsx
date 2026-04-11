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
        <div>
          <p className="eyebrow">{problem.difficulty}</p>
          <h2>{problem.title}</h2>
          <div className="tag-row">
            {problem.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <a className="leetcode-link" href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
          Open on LeetCode
        </a>
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
