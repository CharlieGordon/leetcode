import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SolutionViewer } from './SolutionViewer';

describe('SolutionViewer', () => {
  it('renders runner controls, terminal, and AI Overview in the accepted order', () => {
    const markup = renderToStaticMarkup(
      createElement(SolutionViewer, {
        problemSlug: 'demo',
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
        ],
        selectedSolutionId: 'iterative',
        onSolutionSelect: () => {},
      }),
    );

    expect(markup).toContain('Run');
    expect(markup).toContain('Reset draft');
    expect(markup).toContain('Terminal');
    expect(markup).toContain('AI Overview');
    expect(markup.indexOf('Run')).toBeLessThan(markup.indexOf('iterative.ts'));
    expect(markup.indexOf('iterative.ts')).toBeLessThan(markup.indexOf('Terminal'));
    expect(markup.indexOf('Terminal')).toBeLessThan(markup.indexOf('AI Overview'));
  });

  it('renders an AI Overview section only for solutions with overview markdown', () => {
    const withOverview = renderToStaticMarkup(
      createElement(SolutionViewer, {
        problemSlug: 'demo',
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
        problemSlug: 'demo',
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
    expect(withOverview.indexOf('Terminal')).toBeLessThan(withOverview.indexOf('AI Overview'));
    expect(withoutOverview).not.toContain('AI Overview');
    expect(withoutOverview).not.toContain('<h3>Approach</h3>');
  });
});
