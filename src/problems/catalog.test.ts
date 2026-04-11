import { describe, expect, it } from 'vitest';
import { getCatalogDiagnostics, loadProblemCatalog } from '../lib/catalog';

describe('problem catalog', () => {
  it('has complete assets for every problem', () => {
    expect(getCatalogDiagnostics()).toEqual([]);
  });

  it('loads descriptions, metadata, and displayable solution sources', () => {
    const catalog = loadProblemCatalog();

    expect(catalog.length).toBeGreaterThan(0);

    for (const problem of catalog) {
      expect(problem.title).toBeTruthy();
      expect(problem.slug).toBeTruthy();
      expect(problem.description).toContain(`# ${problem.title}`);
      expect(problem.solutionSources).toHaveLength(problem.solutions.length);

      for (const solution of problem.solutionSources) {
        expect(solution.source).toContain('export function');
      }
    }
  });
});
