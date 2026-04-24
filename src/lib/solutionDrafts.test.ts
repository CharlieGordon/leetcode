import { describe, expect, it } from 'vitest';
import {
  clearSolutionDraft,
  getSolutionDraftKey,
  readSolutionDraft,
  resolveSolutionSource,
  saveSolutionDraft,
} from './solutionDrafts';

function createStorage(seed: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(seed));

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe('solution draft storage', () => {
  it('builds a stable key from problem slug and solution id', () => {
    expect(getSolutionDraftKey('two-sum', 'hash-map')).toBe('leetcode-draft:two-sum:hash-map');
  });

  it('uses repo source when no browser draft exists', () => {
    const storage = createStorage();

    expect(resolveSolutionSource(storage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'repo source',
      hasDraft: false,
    });
  });

  it('uses browser draft before repo source when draft exists', () => {
    const key = getSolutionDraftKey('two-sum', 'hash-map');
    const storage = createStorage({ [key]: 'draft source' });

    expect(resolveSolutionSource(storage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'draft source',
      hasDraft: true,
    });
  });

  it('saves, reads, and clears a draft', () => {
    const storage = createStorage();

    saveSolutionDraft(storage, 'two-sum', 'hash-map', 'draft source');
    expect(readSolutionDraft(storage, 'two-sum', 'hash-map')).toBe('draft source');

    clearSolutionDraft(storage, 'two-sum', 'hash-map');
    expect(readSolutionDraft(storage, 'two-sum', 'hash-map')).toBeNull();
  });

  it('falls back to repo source when storage throws', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('storage unavailable');
      },
      removeItem: () => {
        throw new Error('storage unavailable');
      },
      setItem: () => {
        throw new Error('storage unavailable');
      },
    } as unknown as Storage;

    expect(resolveSolutionSource(throwingStorage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'repo source',
      hasDraft: false,
    });
    expect(() => saveSolutionDraft(throwingStorage, 'two-sum', 'hash-map', 'draft')).not.toThrow();
    expect(() => clearSolutionDraft(throwingStorage, 'two-sum', 'hash-map')).not.toThrow();
  });
});
