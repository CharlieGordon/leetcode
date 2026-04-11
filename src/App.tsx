import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ProblemDetail } from './components/ProblemDetail';
import { ProblemSidebar } from './components/ProblemSidebar';
import { loadProblemCatalog } from './lib/catalog';

const catalog = loadProblemCatalog();
const SIDEBAR_STORAGE_KEY = 'leetcode-sidebar-collapsed';

function includesQuery(values: string[], query: string): boolean {
  return values.some((value) => value.toLowerCase().includes(query));
}

function readStoredSidebarState(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function App() {
  const [query, setQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(catalog[0]?.slug ?? '');
  const [selectedSolutionId, setSelectedSolutionId] = useState(catalog[0]?.solutionSources[0]?.id ?? '');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readStoredSidebarState);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed));
    } catch {
      // Ignore storage failures so private browsing or restricted contexts stay usable.
    }
  }, [isSidebarCollapsed]);

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

  function chooseProblem(slug: string) {
    const nextProblem = catalog.find((problem) => problem.slug === slug);
    setSelectedSlug(slug);
    setSelectedSolutionId(nextProblem?.solutionSources[0]?.id ?? '');
  }

  return (
    <main className={`app-shell ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <ProblemSidebar
        problems={filteredProblems}
        totalProblemCount={catalog.length}
        query={query}
        selectedSlug={selectedProblem?.slug}
        isCollapsed={isSidebarCollapsed}
        onQueryChange={setQuery}
        onProblemSelect={chooseProblem}
        onToggleCollapsed={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
      />
      <ProblemDetail
        problem={selectedProblem}
        selectedSolutionId={selectedSolutionId}
        onSolutionSelect={setSelectedSolutionId}
      />
    </main>
  );
}

export default App;
