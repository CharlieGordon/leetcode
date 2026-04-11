import { useMemo, useState } from 'react';
import './App.css';
import { ProblemDetail } from './components/ProblemDetail';
import { ProblemSidebar } from './components/ProblemSidebar';
import { loadProblemCatalog } from './lib/catalog';

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

  function chooseProblem(slug: string) {
    const nextProblem = catalog.find((problem) => problem.slug === slug);
    setSelectedSlug(slug);
    setSelectedSolutionId(nextProblem?.solutionSources[0]?.id ?? '');
  }

  return (
    <main className="app-shell">
      <ProblemSidebar
        problems={filteredProblems}
        totalProblemCount={catalog.length}
        query={query}
        selectedSlug={selectedProblem?.slug}
        onQueryChange={setQuery}
        onProblemSelect={chooseProblem}
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
