import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SolutionViewer } from './SolutionViewer';

describe('SolutionViewer', () => {
  it('renders an AI Overview section only for solutions with overview markdown', () => {
    const withOverview = renderToStaticMarkup(
      createElement(SolutionViewer, {
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
          {
            id: 'recursive',
            name: 'Recursive',
            summary: 'Builds the answer with recursion.',
            source: 'export function recursive(): void {}',
          },
        ],
        selectedSolutionId: 'iterative',
        onSolutionSelect: () => {},
      }),
    );

    const withoutOverview = renderToStaticMarkup(
      createElement(SolutionViewer, {
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
          {
            id: 'recursive',
            name: 'Recursive',
            summary: 'Builds the answer with recursion.',
            source: 'export function recursive(): void {}',
          },
        ],
        selectedSolutionId: 'recursive',
        onSolutionSelect: () => {},
      }),
    );

    expect(withOverview).toContain('AI Overview');
    expect(withOverview).toContain('<h3>Approach</h3>');
    expect(withoutOverview).not.toContain('AI Overview');
    expect(withoutOverview).not.toContain('<h3>Approach</h3>');
  });
});
