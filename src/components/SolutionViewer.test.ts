import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SolutionViewer } from './SolutionViewer';

function createDemoSolutionViewer() {
  return createElement(SolutionViewer, {
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
  });
}

describe('SolutionViewer', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders runner controls with the terminal hidden by default', () => {
    const markup = renderToStaticMarkup(createDemoSolutionViewer());

    expect(markup).toContain('aria-label="Run solution"');
    expect(markup).toContain('title="Run solution"');
    expect(markup).toContain('aria-label="Show terminal"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).not.toContain('aria-label="Reset browser draft"');
    expect(markup).not.toContain('aria-label="Terminal output"');
    expect(markup).toContain('AI Overview');
    expect(markup.indexOf('Run solution')).toBeLessThan(markup.indexOf('iterative.ts'));
    expect(markup.indexOf('Run solution')).toBeLessThan(markup.indexOf('Show terminal'));
    expect(markup.indexOf('Show terminal')).toBeLessThan(markup.indexOf('iterative.ts'));
    expect(markup.indexOf('iterative.ts')).toBeLessThan(markup.indexOf('AI Overview'));
  });

  it('shows reset after the terminal toggle only when a browser draft exists', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) =>
          key === 'leetcode-draft:demo:iterative' ? 'export function iterative(): void { console.log(1); }' : null,
        removeItem: () => {},
        setItem: () => {},
      },
    });

    const markup = renderToStaticMarkup(createDemoSolutionViewer());

    expect(markup).toContain('aria-label="Reset browser draft"');
    expect(markup).toContain('Browser draft');
    expect(markup.indexOf('Run solution')).toBeLessThan(markup.indexOf('Show terminal'));
    expect(markup.indexOf('Show terminal')).toBeLessThan(markup.indexOf('Reset browser draft'));
    expect(markup.indexOf('Reset browser draft')).toBeLessThan(markup.indexOf('iterative.ts'));
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
    expect(withOverview).not.toContain('aria-label="Terminal output"');
    expect(withoutOverview).not.toContain('AI Overview');
    expect(withoutOverview).not.toContain('<h3>Approach</h3>');
  });
});
