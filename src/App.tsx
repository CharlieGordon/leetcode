import { useMemo, useState } from 'react';
import './App.css';
import { loadProblemCatalog } from './lib/catalog';
import { highlightTypeScript } from './lib/highlight';
import { renderMarkdown } from './lib/markdown';

const catalog = loadProblemCatalog();

function includesQuery(values: string[], query: string): boolean {
  return values.some((value) => value.toLowerCase().includes(query));
}

function App() {
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(catalog[0]?.slug ?? '');
  const [selectedSolutionId, setSelectedSolutionId] = useState(catalog[0]?.solutionSources[0]?.id ?? '');

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProblems = useMemo(() => {
    if (!normalizedQuery) {
      return catalog;
    }

    return catalog.filter((problem) =>
      includesQuery(
        [problem.title, problem.slug, problem.difficulty, ...problem.tags],
        normalizedQuery,
      ),
    );
  }, [normalizedQuery]);

  const selectedProblem =
    filteredProblems.find((problem) => problem.slug === selectedSlug) ?? filteredProblems[0];

  const selectedSolution =
    selectedProblem?.solutionSources.find((solution) => solution.id === selectedSolutionId) ??
    selectedProblem?.solutionSources[0];

  function chooseProblem(slug: string) {
    const nextProblem = catalog.find((problem) => problem.slug === slug);
    setSelectedSlug(slug);
    setSelectedSolutionId(nextProblem?.solutionSources[0]?.id ?? '');
  }

  return (
    <main className="app-shell">
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
          onChange={(event) => setQuery(event.target.value)}
          placeholder="title, tag, difficulty"
        />

        <div className="problem-count">
          {filteredProblems.length} of {catalog.length} problems
        </div>

        <nav className="problem-list" aria-label="Problems">
          {filteredProblems.map((problem) => (
            <button
              key={problem.slug}
              className={`problem-list-item ${problem.slug === selectedProblem?.slug ? 'is-active' : ''}`}
              type="button"
              onClick={() => chooseProblem(problem.slug)}
            >
              <span className="problem-title">{problem.title}</span>
              <span className="problem-meta">
                {problem.difficulty} · {problem.tags.join(', ')}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {selectedProblem ? (
        <section className="problem-detail" aria-label={`${selectedProblem.title} details`}>
          <header className="problem-header">
            <div>
              <p className="eyebrow">{selectedProblem.difficulty}</p>
              <h2>{selectedProblem.title}</h2>
              <div className="tag-row">
                {selectedProblem.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <a className="leetcode-link" href={selectedProblem.leetcodeUrl} target="_blank" rel="noreferrer">
              Open on LeetCode
            </a>
          </header>

          <div className="content-grid">
            <article className="description-panel">{renderMarkdown(selectedProblem.description)}</article>

            <section className="solution-panel" aria-label="Solutions">
              <div className="solution-tabs" role="tablist" aria-label="Solution options">
                {selectedProblem.solutionSources.map((solution) => (
                  <button
                    key={solution.id}
                    className={solution.id === selectedSolution?.id ? 'is-active' : ''}
                    type="button"
                    role="tab"
                    aria-selected={solution.id === selectedSolution?.id}
                    onClick={() => setSelectedSolutionId(solution.id)}
                  >
                    {solution.name}
                  </button>
                ))}
              </div>

              {selectedSolution ? (
                <>
                  <p className="solution-summary">{selectedSolution.summary}</p>
                  <pre className="code-viewer">
                    <code>{highlightTypeScript(selectedSolution.source)}</code>
                  </pre>
                </>
              ) : (
                <p className="empty-state">No solution source found.</p>
              )}
            </section>
          </div>
        </section>
      ) : (
        <section className="empty-state">No problems found.</section>
      )}
    </main>
  );
}

export default App;
