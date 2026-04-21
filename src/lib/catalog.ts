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

const overviewFiles = import.meta.glob('../problems/*/solutions/*.md', {
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
const overviewFilePattern = /\.\.\/problems\/([^/]+)\/solutions\/([^/]+)\.md$/;

type CatalogAssetMaps = {
  descriptions: Record<string, string>;
  metadata: Record<string, ProblemMeta>;
  solutionFiles: Record<string, string>;
  overviewFiles: Record<string, string>;
  testFiles: Record<string, string>;
};

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

function buildSolutionAssetMap(
  files: Record<string, string>,
  pattern: RegExp,
): Map<string, Map<string, string>> {
  const byProblem = new Map<string, Map<string, string>>();

  for (const [path, source] of Object.entries(files)) {
    const match = pattern.exec(path);

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

export function buildProblemCatalog({
  descriptions,
  metadata,
  solutionFiles,
  overviewFiles,
}: Omit<CatalogAssetMaps, 'testFiles'>): ProblemCatalogItem[] {
  const solutionSourceMap = buildSolutionAssetMap(solutionFiles, solutionFilePattern);
  const overviewSourceMap = buildSolutionAssetMap(overviewFiles, overviewFilePattern);

  return Object.entries(metadata)
    .map(([path, meta]) => {
      const slug = getProblemSlug(path);
      const description = descriptions[`../problems/${slug}/problem.md`] ?? '';
      const sourcesForProblem = solutionSourceMap.get(slug) ?? new Map<string, string>();
      const overviewsForProblem = overviewSourceMap.get(slug) ?? new Map<string, string>();
      const solutionSources: SolutionSource[] = meta.solutions.map((solution) => ({
        ...solution,
        source: sourcesForProblem.get(solution.id) ?? '',
        overviewMarkdown: overviewsForProblem.get(solution.id),
      }));

      return {
        ...meta,
        description,
        solutionSources,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function loadProblemCatalog(): ProblemCatalogItem[] {
  return buildProblemCatalog({
    descriptions,
    metadata,
    solutionFiles,
    overviewFiles,
  });
}

export function getCatalogDiagnosticsForAssets({
  descriptions,
  metadata,
  solutionFiles,
  overviewFiles,
  testFiles,
}: CatalogAssetMaps): string[] {
  const errors: string[] = [];
  const metaSlugs = new Set(Object.keys(metadata).map(getProblemSlug));
  const descriptionSlugs = new Set(Object.keys(descriptions).map(getProblemSlug));
  const testSlugs = new Set(Object.keys(testFiles).map(getProblemSlug));
  const sourceMap = buildSolutionAssetMap(solutionFiles, solutionFilePattern);
  const overviewMap = buildSolutionAssetMap(overviewFiles, overviewFilePattern);

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

  for (const [slug, overviewsForProblem] of overviewMap) {
    const meta = metadata[`../problems/${slug}/meta.ts`];

    for (const solutionId of overviewsForProblem.keys()) {
      const hasRegisteredSolution = meta?.solutions.some((solution) => solution.id === solutionId);
      const hasSolutionSource = sourceMap.get(slug)?.has(solutionId) ?? false;

      if (!hasRegisteredSolution || !hasSolutionSource) {
        errors.push(`${slug} has overview markdown without a matching registered solution: ${solutionId}.md`);
      }
    }
  }

  return errors;
}

export function getCatalogDiagnostics(): string[] {
  return getCatalogDiagnosticsForAssets({
    descriptions,
    metadata,
    solutionFiles,
    overviewFiles,
    testFiles,
  });
}
