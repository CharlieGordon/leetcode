import type { ProblemCatalogItem, ProblemMeta, SolutionSource } from '../types';

const descriptions = import.meta.glob('../problems/*/problem.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const metadata = import.meta.glob('../problems/*/meta.ts', {
  eager: true,
  import: 'default',
}) as Record<string, ProblemMeta>;

const solutionFiles = import.meta.glob('../problems/*/solutions/*.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const testFiles = import.meta.glob('../problems/*/*.test.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const problemSlugPattern = /\.\.\/problems\/([^/]+)\//;
const solutionFilePattern = /\.\.\/problems\/([^/]+)\/solutions\/([^/]+)\.ts$/;

function getProblemSlug(path: string): string {
  const match = problemSlugPattern.exec(path);

  if (!match) {
    throw new Error(`Unable to read problem slug from path: ${path}`);
  }

  return match[1];
}

function normalizeSource(source: string): string {
  return source.trimEnd();
}

function buildSolutionSourceMap(): Map<string, Map<string, string>> {
  const byProblem = new Map<string, Map<string, string>>();

  for (const [path, source] of Object.entries(solutionFiles)) {
    const match = solutionFilePattern.exec(path);

    if (!match || match[2] === 'index') {
      continue;
    }

    const [, slug, solutionId] = match;
    const problemSolutions = byProblem.get(slug) ?? new Map<string, string>();
    problemSolutions.set(solutionId, normalizeSource(source));
    byProblem.set(slug, problemSolutions);
  }

  return byProblem;
}

export function loadProblemCatalog(): ProblemCatalogItem[] {
  const solutionSourceMap = buildSolutionSourceMap();

  return Object.entries(metadata)
    .map(([path, meta]) => {
      const slug = getProblemSlug(path);
      const description = descriptions[`../problems/${slug}/problem.md`] ?? '';
      const sourcesForProblem = solutionSourceMap.get(slug) ?? new Map<string, string>();
      const solutionSources: SolutionSource[] = meta.solutions.map((solution) => ({
        ...solution,
        source: sourcesForProblem.get(solution.id) ?? '',
      }));

      return {
        ...meta,
        description,
        solutionSources,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCatalogDiagnostics(): string[] {
  const errors: string[] = [];
  const metaSlugs = new Set(Object.keys(metadata).map(getProblemSlug));
  const descriptionSlugs = new Set(Object.keys(descriptions).map(getProblemSlug));
  const testSlugs = new Set(Object.keys(testFiles).map(getProblemSlug));
  const sourceMap = buildSolutionSourceMap();

  for (const slug of metaSlugs) {
    const meta = metadata[`../problems/${slug}/meta.ts`];

    if (!descriptionSlugs.has(slug)) {
      errors.push(`${slug} is missing problem.md`);
    }

    if (!testSlugs.has(slug)) {
      errors.push(`${slug} is missing a unit test file`);
    }

    if (meta.slug !== slug) {
      errors.push(`${slug} meta slug must match its folder name`);
    }

    if (meta.solutions.length === 0) {
      errors.push(`${slug} must define at least one solution`);
    }

    for (const solution of meta.solutions) {
      if (!sourceMap.get(slug)?.has(solution.id)) {
        errors.push(`${slug} metadata references missing solution file: ${solution.id}.ts`);
      }
    }
  }

  for (const slug of descriptionSlugs) {
    if (!metaSlugs.has(slug)) {
      errors.push(`${slug} has problem.md but is missing meta.ts`);
    }
  }

  return errors;
}
