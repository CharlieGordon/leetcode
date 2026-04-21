import { describe, expect, it } from 'vitest';
import {
  buildProblemCatalog,
  getCatalogDiagnostics,
  getCatalogDiagnosticsForAssets,
  loadProblemCatalog,
} from '../lib/catalog';

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

  it('loads optional solution overview markdown when a matching sibling file exists', () => {
    const catalog = loadProblemCatalog();
    const factorial = catalog.find((problem) => problem.slug === 'factorial');
    const iterative = factorial?.solutionSources.find((solution) => solution.id === 'iterative');
    const recursive = factorial?.solutionSources.find((solution) => solution.id === 'recursive');

    expect(iterative?.overviewMarkdown).toContain('### Approach');
    expect(iterative?.overviewMarkdown).toContain('running product');
    expect(recursive?.overviewMarkdown).toBeUndefined();
  });

  it('reports orphaned optional overview markdown files', () => {
    const diagnostics = getCatalogDiagnosticsForAssets({
      descriptions: {
        '../problems/demo/problem.md': '# Demo',
      },
      metadata: {
        '../problems/demo/meta.ts': {
          title: 'Demo',
          slug: 'demo',
          difficulty: 'Easy',
          tags: ['Array'],
          solutions: [
            {
              id: 'iterative',
              name: 'Iterative',
              summary: 'Loops through the values once.',
            },
          ],
        },
      },
      solutionFiles: {
        '../problems/demo/solutions/iterative.ts': 'export function demo(): void {}',
      },
      overviewFiles: {
        '../problems/demo/solutions/orphan.md': '### Approach\nOrphaned overview.',
      },
      testFiles: {
        '../problems/demo/demo.test.ts': 'describe("demo", () => {})',
      },
    });

    expect(diagnostics).toContain(
      'demo has overview markdown without a matching registered solution: orphan.md',
    );
  });

  it('attaches overview markdown only to the matching solution id', () => {
    const catalog = buildProblemCatalog({
      descriptions: {
        '../problems/demo/problem.md': '# Demo',
      },
      metadata: {
        '../problems/demo/meta.ts': {
          title: 'Demo',
          slug: 'demo',
          difficulty: 'Easy',
          tags: ['Array'],
          solutions: [
            {
              id: 'iterative',
              name: 'Iterative',
              summary: 'Loops through the values once.',
            },
            {
              id: 'recursive',
              name: 'Recursive',
              summary: 'Builds the result recursively.',
            },
          ],
        },
      },
      solutionFiles: {
        '../problems/demo/solutions/iterative.ts': 'export function iterative(): void {}',
        '../problems/demo/solutions/recursive.ts': 'export function recursive(): void {}',
      },
      overviewFiles: {
        '../problems/demo/solutions/recursive.md': '### Approach\nUses recursion.',
      },
    });

    expect(catalog[0].solutionSources).toEqual([
      expect.objectContaining({
        id: 'iterative',
        overviewMarkdown: undefined,
      }),
      expect.objectContaining({
        id: 'recursive',
        overviewMarkdown: '### Approach\nUses recursion.',
      }),
    ]);
  });
});
