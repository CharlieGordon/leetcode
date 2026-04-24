const SOLUTION_DRAFT_PREFIX = 'leetcode-draft';

export type ResolvedSolutionSource = {
  source: string;
  hasDraft: boolean;
};

export function getSolutionDraftKey(problemSlug: string, solutionId: string): string {
  return `${SOLUTION_DRAFT_PREFIX}:${problemSlug}:${solutionId}`;
}

export function readSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
): string | null {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(getSolutionDraftKey(problemSlug, solutionId));
  } catch {
    return null;
  }
}

export function saveSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
  source: string,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(getSolutionDraftKey(problemSlug, solutionId), source);
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function clearSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(getSolutionDraftKey(problemSlug, solutionId));
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function resolveSolutionSource(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
  repoSource: string,
): ResolvedSolutionSource {
  const draft = readSolutionDraft(storage, problemSlug, solutionId);

  if (draft !== null) {
    return {
      source: draft,
      hasDraft: true,
    };
  }

  return {
    source: repoSource,
    hasDraft: false,
  };
}
