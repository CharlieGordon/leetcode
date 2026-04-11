import type { ProblemCatalogItem } from '../types';

type ProblemSidebarProps = {
  problems: ProblemCatalogItem[];
  totalProblemCount: number;
  query: string;
  selectedSlug?: string;
  onQueryChange: (query: string) => void;
  onProblemSelect: (slug: string) => void;
};

export function ProblemSidebar({
  problems,
  totalProblemCount,
  query,
  selectedSlug,
  onQueryChange,
  onProblemSelect,
}: ProblemSidebarProps) {
  return (
    <aside className="problem-sidebar" aria-label="Problem browser">
      <div className="brand-block">
        <img
          src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=320&q=80"
          alt="Code editor on a laptop"
        />
        <div>
          <p className="eyebrow">Practice Library</p>
          <h1>LeetCode</h1>
        </div>
      </div>

      <label className="search-label" htmlFor="problem-search">
        Search problems
      </label>
      <input
        id="problem-search"
        className="search-input"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="title, tag, difficulty"
      />

      <div className="problem-count">
        {problems.length} of {totalProblemCount} problems
      </div>

      <nav className="problem-list" aria-label="Problems">
        {problems.map((problem) => (
          <button
            key={problem.slug}
            className={`problem-list-item ${problem.slug === selectedSlug ? 'is-active' : ''}`}
            type="button"
            onClick={() => onProblemSelect(problem.slug)}
          >
            <span className="problem-title">{problem.title}</span>
            <span className="problem-meta">
              {problem.difficulty} · {problem.tags.join(', ')}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
