import { AppLogo } from './AppLogo';
import type { ProblemCatalogItem } from '../types';

type ProblemSidebarProps = {
  problems: ProblemCatalogItem[];
  totalProblemCount: number;
  query: string;
  selectedSlug?: string;
  isCollapsed: boolean;
  onQueryChange: (query: string) => void;
  onProblemSelect: (slug: string) => void;
  onToggleCollapsed: () => void;
};

export function ProblemSidebar({
  problems,
  totalProblemCount,
  query,
  selectedSlug,
  isCollapsed,
  onQueryChange,
  onProblemSelect,
  onToggleCollapsed,
}: ProblemSidebarProps) {
  const browserPanelId = 'problem-browser-panel';
  const toggleLabel = isCollapsed ? 'Open problem browser' : 'Collapse problem browser';

  return (
    <aside className={`problem-sidebar ${isCollapsed ? 'is-collapsed' : ''}`} aria-label="Problem browser">
      <div className="sidebar-topline">
        <div className="brand-block">
          <AppLogo />
          <div className="brand-copy">
            <p className="eyebrow">Practice Library</p>
            <h1>LeetCode</h1>
          </div>
        </div>

        <button
          className="sidebar-toggle"
          type="button"
          aria-controls={browserPanelId}
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          onClick={onToggleCollapsed}
        >
          <svg
            className="sidebar-toggle-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path className="sidebar-toggle-grip" d="M8 7.5v9" />
            <path className="sidebar-toggle-grip" d="M11 7.5v9" />
            <path className="sidebar-toggle-arrow" d="M16 8.5 12.5 12 16 15.5" />
          </svg>
        </button>
      </div>

      <div
        id={browserPanelId}
        className={`sidebar-browser ${isCollapsed ? 'is-collapsed' : ''}`}
        aria-hidden={isCollapsed}
      >
        <div className="sidebar-browser-inner">
          <label className="search-label" htmlFor="problem-search">
            Search problems
          </label>
          <input
            id="problem-search"
            className="search-input"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title, tag, difficulty"
            tabIndex={isCollapsed ? -1 : undefined}
          />

          <div className="problem-count">
            {problems.length} of {totalProblemCount} problems
          </div>

          <nav className="problem-list" aria-label="Problems">
            {problems.map((problem) => (
              <button
                key={problem.slug}
                className={`problem-list-item difficulty-${problem.difficulty.toLowerCase()} ${
                  problem.slug === selectedSlug ? 'is-active' : ''
                }`}
                type="button"
                tabIndex={isCollapsed ? -1 : undefined}
                onClick={() => onProblemSelect(problem.slug)}
              >
                <span className="problem-title">{problem.title}</span>
                <span className="problem-meta" aria-label={`${problem.difficulty}, ${problem.tags.join(', ')}`}>
                  <span className="difficulty-dot" aria-hidden="true" />
                  <span>{problem.difficulty}</span>
                  <span aria-hidden="true">/</span>
                  <span>{problem.tags.join(', ')}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
